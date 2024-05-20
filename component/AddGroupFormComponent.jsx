import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Button,
    FlatList
} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon  from 'react-native-vector-icons/FontAwesome'; 
import { TextInput, IconButton,Menu } from 'react-native-paper';
import { wordGroupList,wordGroupAdd,wordGroupUpdate,wordGroupDelete,LanguageFind } from './apiService';

const AddGroupFormComponent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectValue, setSelectValue] = useState({});
    const [title, setTitle] = useState("");
    const [isAddOrUpdate, setisAddOrUpdate] = useState(0);
    const [formData, setFormData] = useState({wg_id:0,wg_parent_id:'',wg_name:'',words:[],grammerNote:[],user_id:0,User:null});
    const [items, setItems] = useState([]);
    const fetchwordGroupData = async () => {
        const chats = await wordGroupList();
        setItems(chats);
      };
    useEffect(() => {
        fetchwordGroupData(); 
      }, []); 
      const handleInputChange = (name, value) => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    const openModal = (item) => {
        if(item.wg_id==0)
        {
            setTitle(LanguageFind("main_group_add"));
        }
        else
        {
            setTitle(item.wg_name+' '+LanguageFind("sub_group_add"));
        }
        
       setFormData({wg_id:0,wg_parent_id:item.wg_id,wg_name:'',words:[],grammerNote:[],user_id:0,User:null});
        setIsModalVisible(true);
    };
 
    

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = () => {
        if(formData.wg_name=='')
        {
            alert(LanguageFind("type_name_and_type_short_name_fields_are_mandatory_fields_please_fill_them_in"));
            return 0;
        }
        if(formData.wg_id!=='' && +formData.wg_id!==0) //// güncelleme olacak
        {
            const fetchwordGroupUpdate= async () => {
                await wordGroupUpdate(formData).then((x) => {
                    fetchwordGroupData(); 
                  }).catch(err => console.log('hata var'));
              };
              fetchwordGroupUpdate(); 
        }
        else //// ekleme yapılacak
        {
            const fetchwordGroupAdd= async () => {
                await wordGroupAdd(formData).then((x) => {
                    fetchwordGroupData(); 
                  }).catch(err => console.log('hata var'));
              };
              fetchwordGroupAdd(); 
              setFormData({wg_id:0,wg_parent_id:'',wg_name:'',words:[],grammerNote:[],user_id:0,User:null}); //// bu kısım eklede girmeli
            
        }
        closeModal();
    };

    const handleEdit = (item) => {
        setTitle(item.wg_name+' '+LanguageFind("update"));
        setFormData({grammerNote:[],wg_id:item.wg_id,wg_name:item.wg_name,wg_parent_id:item.wg_parent_id,words:[],user_id:0,User:null});
        setIsModalVisible(true);
    };

    const handleSubEdit = (item,child) => {
        setTitle(item.wg_name+' > '+child.wg_name+' '+LanguageFind("update"));
        setFormData({grammerNote:[],wg_id:child.wg_id,wg_name:child.wg_name,wg_parent_id:child.wg_parent_id,words:[],user_id:0,User:null});
        setIsModalVisible(true);
    };

    const handleDelete = (item) => {
        const fetchwordGroupDelete= async () => {
            await wordGroupDelete(item.wg_id).then((x) => {
                fetchwordGroupData(); 
              }).catch(err => console.log('hata var'));
          };
          fetchwordGroupDelete(); 
          setFormData({wg_id:0,wg_parent_id:'',wg_name:'',words:[],grammerNote:[],user_id:0,User:null}); //// bu kısım eklede girmeli
    };

    const ChatItem = ({ item }) => {
        return (
            <View key={item.wg_id} style={{ backgroundColor: '#e9e7e7', marginBottom: 4, borderRadius: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, marginHorizontal: 10, backgroundColor: 'white', borderColor: '#e9e7e7', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                    <Text style={{ color: '#000' }}>{item.wg_name}</Text>
                    <View key={item.wg_id} style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => handlePlay(item)}>
                            <FontAwesomeIcon  name="play" size={20} color="orange" style={{ marginLeft: 10, marginTop: -2 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openModal(item)}>
                            <FontAwesome name="plus" size={20} color="green" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleEdit(item)}>
                            <FontAwesome name="edit" size={20} color="blue" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(item)}>
                            <FontAwesome name="trash" size={20} color="red" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>



                </View>
                {
                    item.child.map((value, index) =>
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, marginHorizontal: 10, backgrounDColor: 'white', borderColor: '#e9e7e7', borderWidth: 1, padding: 5, borderRadius: 5 }}>
                            <Text style={{ color: '#000' }}>{value.wg_name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => handleSubPlay(value.id)}>
                                    <FontAwesomeIcon   name="play" size={20} color="orange" style={{ marginLeft: 10, marginTop: -2 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSubEdit(item,value)}>
                                    <FontAwesome name="edit" size={20} color="blue" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() =>  handleDelete(value)}>
                                    <FontAwesome name="trash" size={20} color="red" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
            </View>
        );
    };



    return (
        <ScrollView style={{ flexGrow: 1 }}>
            <View style={styles.listItem}>
                <View style={styles.formContainer}>
                    <View style={[styles.tabMenu, { backgroundBottomColor: 'white', borderBottomColor: '#e9e7e7', borderBottomWidth: 1, paddingBottom: 5 }]}>
                        <Text style={[styles.buttonText]}>{LanguageFind("word_group_list")}</Text>
                    </View>
                    <TouchableOpacity onPress={() => openModal(formData)}>
                    <View style={[styles.tabMenu, { backgroundColor: '#e9e7e7', borderColor: '#e9e7e7', borderWidth: 1, marginBottom: 10, padding: 5, borderRadius: 5 }]}>
                            <Text style={styles.buttonText}>{LanguageFind("main_group_add")}</Text>
                    </View>
                    </TouchableOpacity>
                    <FlatList
                        data={items}
                        renderItem={({ item }) => (
                            <ChatItem
                                item={item}
                            // onItemLongPress={() => onItemLongPress(item.id)}
                            // onItemPress={() => onItemPress(item.id)}
                            // selectedItems={selectedItems}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        style={styles.flatList}
                    />
                </View>



                {/* Modal */}
                <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        

                        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                       
                        <View style={[styles.tabMenu, { backgroundBottomColor: 'white', borderBottomColor: '#e9e7e7', borderBottomWidth: 1, paddingBottom: 5 }]}>
                            <Text style={[styles.buttonText]}><b>{title}</b></Text>
                        </View>

                            <Text><b>{LanguageFind("group_name")}</b></Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: 'white' }]}
                                value={formData.wg_name}
                                placeholder={LanguageFind("group_name_placeholder")}
                                onChangeText={(text) => handleInputChange('wg_name',text)}
                                name='wg_name'
                            />
                            <View style={styles.tabMenu}>
                                <Button title="Submit" onPress={handleSubmit} />
                                <Button title="Close" onPress={closeModal} />
                            </View>

                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    addItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    wordCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wordMains: {
        flexDirection: 'row', // Yazıları yatayda sıralamak için
        flexWrap: 'wrap',
        marginLeft: 10,
    },
    wordMain: {
        marginRight: 5,       // Yazılar arasına boşluk bırakmak için
    },

    fileBorder: {
        borderColor: '#e9e7e7',  // Sağdan, soldan ve üstten border rengi
        borderWidth: 1,        // Sağdan, soldan ve üstten border kalınlığı
        borderStyle: 'solid',  // Sağdan, soldan ve üstten border stil
        padding: 5
    },

    listItem: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    tabMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    tabButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        zIndex: 2
    },
    activeTabButton: {
        backgroundColor: 'white',
        borderColor: '#e9e7e7',  // Sağdan, soldan ve üstten border rengi
        borderWidth: 1,        // Sağdan, soldan ve üstten border kalınlığı
        borderStyle: 'solid',  // Sağdan, soldan ve üstten border stil

        marginTop: -1,         // Sağdan, soldan ve üstten border kalınlığı için ayar
        marginRight: -1,       // Sağdan, soldan ve üstten border kalınlığı için ayar
        marginLeft: -1,
        zIndex: 2

    },

    means: {
        padding: 10,
        backgroundColor: '#e9e7e7',
        borderRadius: 10,
        marginBottom: 10,
    },
    formContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
    },
    picker: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
    },
    flatList: {
        flex: 1,
    },
    listItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 10,
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
        height: 100,
        marginRight: 0,
        borderRadius: 10,
    },
    chatInfo: {
        flex: 1,
    },

});

export default AddGroupFormComponent;
