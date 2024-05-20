import React, { useState,useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, Button, TouchableWithoutFeedback,StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { dailyList,dailyUpdate,dailyAdd,LanguageFind} from './apiService';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DailyScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState({d_id:0,d_notes:'',create_date:''});
  const [dailyLogs, setDailyLogs] = useState([]);
  const [newLog, setNewLog] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const fetchdaily = async () => {
        const ds = await dailyList();
        setDailyLogs(ds);
    };
    fetchdaily(); 
  }, []); 

  
  const addLog = () => {
    if (selectedLog.d_notes.trim() !== '') {
      const fetchdailyAdd = async () => {
        await dailyAdd(selectedLog).then((x) => {

          const fetchdaily = async () => {
            const ds = await dailyList();
            setDailyLogs(ds);
        };
        fetchdaily(); 
      
    }).catch(err => console.log(err));
    }
    fetchdailyAdd(); 
    setShowModal(false);

  };
}

  const updateLog = () => {
    if (selectedLog.d_notes.trim() !== '') {
      const fetchdailyUpdate = async () => {
        await dailyUpdate(selectedLog).then((x) => {

          const fetchdaily = async () => {
            const ds = await dailyList();
            setDailyLogs(ds);
        };
        fetchdaily(); 

    }).catch(err => console.log(err));
   
    }
    fetchdailyUpdate(); 
    setShowModal(false);
  };
  };

  const updateModal = (item) => {
    setSelectedLog({
      d_id:item.d_id,
      d_notes:item.d_notes,
      create_date:item.create_date
    });
    setShowModal(true);
  }; 

  
  const deleteModal = (item) => {
    setSelectedLog({
      d_id:item.d_id,
      d_notes:item.d_notes,
      create_date:item.create_date
    });
    setShowDeleteModal(true);
  }; 

  const handeleDelete=(item)=>
  {
      console.log("silinecekitem",item);
      const fetchwordsDelete= async () => {
          await wordDelete(item).then((x) => {
              ///// silme başarılı dönmesi gerekiyor
              const fetchData = async () => {
                const chats = await words();
                AsyncStorage.setItem('carts',JSON.stringify(chats));
                setchats(chats);
                setschats(chats);
                closeDeleteModal();
            };
        
            fetchData(); // API isteğini gönder
            }).catch(err => console.log(err));
        };
        fetchwordsDelete();
  }

  const closeDeleteModal=()=>
    {
        setShowDeleteModal(false);
    }

  const addModal = () => {
    setSelectedLog({
      d_id:0,
      d_notes:""
    });
    setShowModal(true);
  }; 

  const handleformData = (name, value) => {
    setSelectedLog((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const YourComponent = ({ log }) => {
    const formattedDate = log.create_date ? moment(log.create_date).format('DD-MM-YYYY HH:mm') : 'Date is null';
    
    return (
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
        {formattedDate}
      </Text>
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ marginHorizontal: 10 }}>
       

                        <View style={[styles.buttonContainer,{padding: "5px 0px"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold",marginTop:5,marginBottom:5}} 
                            onClick={() => addModal()}>{LanguageFind("new_daily")}</button>
                        </View>
                      



        {dailyLogs.map((log, index) => (
          <View key={index} style={{ marginBottom: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1, paddingRight: 28 }}>
              <YourComponent log={log} />
              <Text numberOfLines={3} ellipsizeMode="tail" style={{ flex: 1 }}>{log.d_notes.substring(0, 100)}...</Text>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => updateModal(log)}    >
              <FontAwesome name="pencil" size={17} style={{backgroundColor:"#ffd39b",transitionDuration:"0s",border: "1px dotted rgb(255 146 0)",color: "#ff8100",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold",padding:"5px",margin:"1px"}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteModal(log)}    >
              <FontAwesome name="trash" size={17} style={{backgroundColor:"#ffd6d6",transitionDuration:"0s",border: "1px dotted rgb(196 161 161)",color: "red",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold",padding:"5px",margin:"1px"}}/>
          </TouchableOpacity>

          </View>
      </View>
        ))}

        <Modal visible={showModal} animationType="slide" transparent={true}>
          {/* <TouchableWithoutFeedback onPress={() => setShowModal(false)}> */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '95%', minHeight: '90%' }}>
              <View style={{flexDirection: 'row',borderBottom:"1px solid #e2e2e2",marginBottom:10}}>
                    <Text style={{padding:0,width: "100%",margin: 0,fontSize:17,marginBottom:3}}><b>{selectedLog.d_id!==0?<><YourComponent log={selectedLog} /><Text> Tarihli Günlüğü Güncelleme</Text></>:'Günlük Ekleme'}</b></Text>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                            <Text>X</Text>
                            </TouchableOpacity>
                    </View>

                <TextInput
                  placeholder={LanguageFind("daily_add_placeholder")+"..."}
                  multiline
                  value={selectedLog.d_notes}
                  onChangeText={(val)=>handleformData('d_notes',val)}
                  style={{ borderWidth: 1,borderRadius:10, borderColor: '#ccc', padding: 10, marginBottom: 10, minHeight: '80%' }}
                />
          

                
                <View style={{flexDirection: 'row',marginTop: 10,}}>
                        <View style={[styles.buttonContainer,{marginRight:1,marginLeft:1}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => selectedLog.d_id==0?addLog():updateLog()}>{LanguageFind("save")}</button>
                        </View>
                        
                        <View style={[styles.buttonContainer,{marginRight:1,marginLeft:1}]}>
                            <button 
                            style={{backgroundColor:"rgb(255 232 232)",transitionDuration:"0s",border: "1px dotted rgb(196 161 161)",color: "rgb(134 0 0)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() =>setShowModal(false)}>{LanguageFind("close")}</button>

                        </View> 
                </View>

              </View>
            </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>

        <Modal visible={showDeleteModal} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <ScrollView style={{ flexGrow: 1,width:"95%",marginTop:"10px"}}>
      
                    <View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20,borderRadius:10,background: "#fff" }] }>
                    <View style={{flexDirection: 'row',borderBottom:"1px solid #e2e2e2",marginBottom:23}}>
                    <Text style={{padding:0,width: "100%",margin: 0,fontSize:17}}>{selectedLog.d_id!==0?<><YourComponent log={selectedLog} /><Text> {LanguageFind("date_daily_delete")}</Text></>:'Günlük Silme'}</Text>
                        <TouchableOpacity onPress={() => closeDeleteModal()} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                            <Text>X</Text>
                            </TouchableOpacity>
                    </View>
                    <View><Text>{LanguageFind("are_you_sure_you_want_to_delete")}</Text></View>
                        
                    <View style={{flexDirection: 'row',marginTop: 20,}}>
                        
                        <View style={[styles.buttonContainer,{marginRight:1,marginLeft:1}]}>
                            <button 
                            style={{backgroundColor:"rgb(255 232 232)",transitionDuration:"0s",border: "1px dotted rgb(196 161 161)",color: "rgb(134 0 0)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() =>handeleDelete(false)}>{LanguageFind("delete")}</button>

                        </View> 
                        <View style={[styles.buttonContainer,{marginRight:1,marginLeft:1}]}>
                           

<button 
                            style={{backgroundColor:"rgb(233 233 233)",transitionDuration:"0s",border: "1px dotted rgb(186 185 185)",color: "rgb(0 0 0)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() =>closeDeleteModal(false)}>{LanguageFind("close")}</button>
                        </View>
                        </View>

                    </View>
                    
                </ScrollView>
                </View>
            </Modal>

      </View>
    </ScrollView>
  );
};

export default DailyScreen;
const styles = StyleSheet.create({
buttonContainer: {
  flex: 1, // Eşit genişlikte iki düğme sağlamak için
  marginHorizontal: 0, // Düğmeler arasında yatay boşluk
},
});