import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,Modal } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { userApi,userUpdate,LanguageFind } from './apiService';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProfileUpdate from './ProfileUpdate';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileScreen = ({ user, onItemLongPress }) => {
  const [userData, setUserData] = useState(false);
  const [chats, setchats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    let iscart = AsyncStorage.getItem('carts');
    const chats = JSON.parse(iscart);
    setchats(chats);
    const fetchuser = async () => {
      const users = await userApi();
      setUserData(users);
    };
    fetchuser();
  }, []);

  // Örnek veriler
  const wordData = [
    { date: '2024-02-01', count: 100, correct: 80, incorrect: 20 },
    { date: '2024-02-02', count: 150, correct: 120, incorrect: 30 },
    { date: '2024-02-03', count: 200, correct: 150, incorrect: 50 },
    // ... diğer tarihler ve veriler buraya eklenebilir
  ];

  // Grafik konfigürasyonu
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default 3
  };




  const pieData = [
    { key: 'correct', value: 80, svg: { fill: '#4CAF50' }, arc: { outerRadius: '110%', cornerRadius: 10 } },
    { key: 'incorrect', value: 20, svg: { fill: '#F44336' }, arc: { outerRadius: '100%', cornerRadius: 10 } },
  ];

  const closeModal=()=>
  {
      setShowModal(false);
  }

  const onUpdateModal = () => {
    // setParams({params:undefined})
    setShowModal(true);
};
  const crudApi=(item)=>{
    console.log("güncelle yapılacak",item);
    const fetchuserUpdate= async () => {
      await userUpdate(item.data).then((x) => {
          alert(LanguageFind("update_success"));
          const fetchuser = async () => {
            const users = await userApi();
            setUserData(users);
          };
          fetchuser();
          closeModal();
    
        }).catch(err => console.log(err));
    };
    fetchuserUpdate();
    
   
} 

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        {/* Kapak Fotoğrafı ve Profil Resmi */}
        <View>
          {/* Kapak Fotoğrafı ve Profil Değiştirme İkonu */}
          <View style={{ position: 'relative' }}>
            {userData!==false && userData.user_image_back !== null ? <Image
              source={{ uri: userData.user_image_back }}
              style={{ width: '100%', height: 200 }}
            /> : <View style={styles.avatar}>
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="image" size={50} color="#888" />
                <Text>{LanguageFind("no_picture")}</Text>
              </View>
            </View>}

            {/* Profil Değiştirme İkonu */}
            {/* <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 20 }}>
              <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 20 }}>
                <Text style={{ color: 'black' }}>📷</Text>
              </View>
            </TouchableOpacity> */}
          </View>

          {/* Profil Resmi */}
          <View style={{ alignItems: 'center', marginTop: -80 }}>
            {userData.user_image !== null ? <Image
              source={{ uri: user.avatar }}
              style={{ width: 150, height: 150, borderRadius: 75, borderWidth: 5, borderColor: '#ebebeb' }}
            /> : <View style={[styles.avatar, { width: 150, height: 150, borderRadius: 75, borderWidth: 5, borderColor: '#ebebeb' }]}>
              <View style={styles.imagePlaceholder}>
                <FontAwesome name="image" size={50} color="#888" />
                <Text>{LanguageFind("no_picture")}</Text>
              </View>
            </View>}
            {/* <TouchableOpacity style={{ position: 'absolute', bottom: 10, right: 20 }}>
              <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 20 }}>
                <Text style={{ color: 'black' }}>📷</Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Diğer İçerikler */}
        <View>
          {/* İsim ve Kelime Sayısı */}
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>{userData.name + " " + userData.surname}</Text>
            <Text style={{ color: 'gray', marginBottom: 10 }}>{userData.user_name}</Text>
            <Text style={{ color: 'gray', marginBottom: 10 }}>{userData.mail}</Text>
            <Text style={{ color: 'gray' }}>{LanguageFind("total_word_count")}: {chats.length}</Text>
          </View>

          {/* Profil Düzenleme Butonu */}
          <TouchableOpacity onPress={() => onUpdateModal()} style={{ alignItems: 'center', backgroundColor: '#1877f2', padding: 10, borderRadius: 5, marginBottom: 20, marginHorizontal: 20 }}>
            <Text style={{ color: 'white' }}>{LanguageFind("profile_update")}</Text>
          </TouchableOpacity>

          {/* Grafik */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Günlük Kelime Ezberleme İstatistikleri</Text>
            <BarChart
              data={{
                labels: wordData.map(data => data.date),
                datasets: [
                  {
                    data: wordData.map(data => data.count),
                  },
                  {
                    data: wordData.map(data => data.correct),
                  },
                  {
                    data: wordData.map(data => data.incorrect),
                  },
                ],
              }}
              width={350}
              height={220}
              chartConfig={chartConfig}
              style={{ marginBottom: 20 }}
            />
          </View>


          {/* Yuvarlak grafikler */}
          {/* <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Günlük Kelime Ezberleme İstatistikleri</Text>
        <PieChart
          style={{ height: 200 }}
          data={pieData}
          innerRadius="45%"
          outerRadius="70%"
        />
      </View> */}
        </View>
      </ScrollView>
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <ProfileUpdate route={userData} closeModal={closeModal} crudApi={crudApi} />
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd', // veya başka bir arkaplan rengi
    width: "100%",
    height: 200
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 8,
},
modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    zIndex: 8,
},

});