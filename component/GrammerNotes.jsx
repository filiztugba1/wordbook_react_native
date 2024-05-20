import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput,StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { dailyList,dailyUpdate,dailyAdd} from './apiService';
import moment from 'moment';
const GrammerNotes = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState({d_id:0,d_notes:'',create_date:''});
  const [grammerNotes, setgrammerNotes] = useState([]);
  const [newLog, setNewLog] = useState('');

  useEffect(() => {
    const fetchdaily = async () => {
        const ds = await dailyList();
        setgrammerNotes(ds);
    };
    fetchdaily(); 
  }, []); 

  
  const addLog = () => {
    if (selectedLog.d_notes.trim() !== '') {
      const fetchdailyAdd = async () => {
        await dailyAdd(selectedLog).then((x) => {

          const fetchdaily = async () => {
            const ds = await dailyList();
            setgrammerNotes(ds);
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
            setgrammerNotes(ds);
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
      <View style={{ marginHorizontal: 20 }}>
       

        <View style={{flexDirection: 'row'}}>
                        <View style={[styles.buttonContainer,{marginTop: "4px",marginBottom:"4px"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => addModal()}>New Grammer Note</button>
                        </View>
         </View> 


        {grammerNotes.map((log, index) => (
          
          <View style={{ marginBottom: 20, backgroundColor: 'white', padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
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
              <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', minHeight: '90%' }}>
              <View style={{flexDirection: 'row',borderBottom:"1px solid #e2e2e2",marginBottom:10}}>
                    <Text style={{padding:0,width: "100%",margin: 0,fontSize:20}}><b>{selectedLog.d_id!==0?<><YourComponent log={selectedLog} /><Text> Güncelleme</Text></>:'Not Ekleme'}</b></Text>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                            <Text>X</Text>
                            </TouchableOpacity>
                    </View>

                    <Text style={[styles.label,{marginTop:10}]}><b>Not Başlığı</b></Text>
                <TextInput
                        
                        value={selectedLog.d_notes}
                        placeholder='Grammer not başlığı giriniz'
                        onChangeText={(text) => handleformData('w_name', text)}
                        name='w_name'
                        style={{ borderWidth: 1,borderRadius:10, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
                        />
                <Text style={[styles.label,{marginTop:10}]}><b>Grammer İçeriği</b></Text>
                <TextInput
                  placeholder="Notunuz..."
                  multiline
                  value={selectedLog.d_notes}
                  onChangeText={(val)=>handleformData('d_notes',val)}
                  style={{ borderWidth: 1,borderRadius:10, borderColor: '#ccc', padding: 10, marginBottom: 10, minHeight: '60%' }}
                />
          

                
                <View style={{flexDirection: 'row',marginTop: 20,}}>
                        <View style={styles.buttonContainer}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => selectedLog.d_id==0?addLog():updateLog()}>Save</button>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <button 
                            style={{backgroundColor:"rgb(255 232 232)",transitionDuration:"0s",border: "1px dotted rgb(196 161 161)",color: "rgb(134 0 0)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() =>setShowModal(false)}>Cancel</button>

                        </View> 
                </View>

              </View>
            </View>
          {/* </TouchableWithoutFeedback> */}
        </Modal>
      </View>
    </ScrollView>
  );
};

export default GrammerNotes;
const styles = StyleSheet.create({
buttonContainer: {
  flex: 1, // Eşit genişlikte iki düğme sağlamak için
  marginHorizontal: 5, // Düğmeler arasında yatay boşluk
},
});