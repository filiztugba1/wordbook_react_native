import React, { useState,useEffect  } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, PanResponder,TextInput,Button } from 'react-native';
import { Image, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // FontAwesome eklenen kütüphanenin ismi
import AddItemFormComponent from './AddItemFormComponent'; // AddItem component'ının olduğu dosya yolu
// import WorkItem from './WorkItem'; // AddItem component'ının olduğu dosya yolu
import Tts from 'react-native-tts';
import { words,wordGroups,meansType,wordsAdd,wordUpdate,wordDelete,LanguageFind} from './apiService';

import { useNavigation } from '@react-navigation/native';
import * as XLSX from "xlsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
const speak = (text) => {
    Tts.speak(text, { androidParams: { KEY_PARAM_PAN: -1 } });
};


// const exportExcel = () => {
//     const data = [
//         { name: 'John', age: 30, city: 'New York' },
//         { name: 'Jane', age: 25, city: 'Los Angeles' },
//         { name: 'Bob', age: 35, city: 'Chicago' },
//     ];

//     exportToExcel(data, 'myExcelFile').then(filePath => {
//         if (filePath) {
//             // Burada filePath'i bir web sunucusuna yükleyerek veya paylaşma bağlantısı oluşturarak kullanıcıya sunabilirsiniz.
//             console.log('Excel dosyasının yolunu paylaşın:', filePath);
//         } else {
//             console.log('Excel dosyası oluşturulamadı.');
//         }
//     });
// };

const exportExcel = () => {
    // const data = [
    //     { name: 'John', age: 30, city: 'New York' },
    //     { name: 'Jane', age: 25, city: 'Los Angeles' },
    //     { name: 'Bob', age: 35, city: 'Chicago' },
    // ];

    let data=[];

    let iscart=AsyncStorage.getItem('carts');
           
    const chats=JSON.parse(iscart);
    let meanLen=0;
    let expLen=0;
    let irrLen=0;
    chats.forEach(ex => {
        meanLen=ex.wordMeans.length>meanLen?ex.wordMeans.length:meanLen;
        expLen=ex.wordExample.length>expLen?ex.wordExample.length:expLen;
        irrLen=ex.irregularVerbs.length>irrLen?ex.irregularVerbs.length:irrLen;
    });

    let i=0;
    chats.forEach(ex => {
        data[i]=[];
        data[i]['en']=ex.w_name;
        let Meandef=0;
        for(let len=0;len<ex.wordMeans.length;len++)
        {
            data[i]['tr_'+len]=ex.wordMeans[len].wm_name+' ['+ex.wordMeans[len].meantype.mt_short_name+']';
            Meandef=len+1;
        }

        for(let len=Meandef;len<meanLen;len++)
        {
            data[i]['tr_'+len]="";
        }

        let Expdef=0;
        for(let len=0;len<ex.wordExample.length;len++)
        {
            
            data[i]['exp_'+len]=ex.wordExample[len].we_name;
            Expdef=len+1;
        }

        for(let len=Expdef;len<expLen;len++)
        {
            data[i]['exp_'+len]="";
        }

        let Irrdef=0;
        for(let len=0;len<ex.irregularVerbs.length;len++)
        {
            data[i]['irr_'+len]=ex.irregularVerbs[len].we_name;
            Irrdef=len+1;
        }
        for(let len=Irrdef;len<irrLen;len++)
        {
            data[i]['irr_'+len]="";
        }
        i++;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    XLSX.writeFile(workbook, 'wordbook.xlsx');
};
const ChatItem = ({ item, onItemLongPress, onItemPress, selectedItems = null,onDeleteModal,onUpdateModal,showModal,params,closeModal}) => {
    const navigation = useNavigation();
    const adverbs = item.wordMeans.filter(x => x.meantype.mt_short_name === 'zf.');
    const verbs = item.wordMeans.filter(x => x.meantype.mt_short_name === 'f.');
    const cumle = item.wordMeans.filter(x => x.meantype.mt_short_name === 'c.');
    const adjectives = item.wordMeans.filter(x => x.meantype.mt_short_name === 's.');
    const pronouns = item.wordMeans.filter(x => x.meantype.mt_short_name === 'zm.');
    const nouns = item.wordMeans.filter(x => x.meantype.mt_short_name === 'i.');
    const edat = item.wordMeans.filter(x => x.meantype.mt_short_name=== 'ed.');
    const baglac = item.wordMeans.filter(x => x.meantype.mt_short_name === 'bağ.');
 
    return (
        <>

            <View
            key={item.w_id}
                style={[
                    styles.listItem,
                    {
                        marginVertical: 5,
                        marginHorizontal: 10,
                        backgroundColor: selectedItems != null && selectedItems.includes(item.w_id) ? '#ddd' : '#fff',
                        width: '95%'
                    },
                ]}
                onLongPress={() => onItemLongPress(item.w_id)}
                onPress={() => onItemPress(item.w_id)}
            >
                 {item.w_image != '' ? <Image source={{ uri: item.w_image }} style={styles.avatar} /> :null
                    }


                {/* {item.w_image != '' ? <Image source={{ uri: item.w_image }} style={styles.avatar} /> :
                    <View style={styles.avatar}>
                        <View style={styles.imagePlaceholder}>
                            <Icon name="image" size={50} color="#888" />
                            <Text>Resim Yok</Text>
                        </View>
                    </View>
                    } */}

                <View style={styles.listItemContent}>

                    <View style={styles.chatInfo}>
                    <View style={styles.wordCard}>
                                <>
                                    <View style={styles.wordDetails}>
                                        <Text style={styles.wordText}>{item.w_name}</Text>
                                    </View>
                                    <FontAwesome name="volume-high" size={24} color="#888" style={styles.soundIcon} onPress={() => speak(item.w_name)} /> </>
                            </View>
                        {adverbs.length != 0 ? <View style={styles.wordCard}>
                            <View style={styles.wordMains}>
                                <Text style={styles.wordMain}>{LanguageFind("adverbs")} : </Text>
                                <Text style={styles.wordMain}>
                                    {adverbs.map((m, index) =>
                                        <Text key={m.wm_id+'adv'}>{m.wm_name}{index < adverbs.length - 1 ? ',' : ''}</Text>
                                    )}
                                </Text>
                            </View>
                        </View> : <></>}

                        {nouns.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("noun")} : </Text>
                                    <Text style={styles.wordMain}>
                                        {nouns.map((m, index) =>
                                            <Text key={m.wm_id+'noun'}>{m.wm_name}{index < nouns.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                        {adjectives.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("adjective")} : </Text>
                                    <Text style={styles.wordMain}>
                                        {adjectives.map((m, index) =>
                                            <Text key={m.wm_id+'adj'}>{m.wm_name}{index < adjectives.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}


                        {pronouns.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("pronoun")} : </Text>
                                    <Text style={styles.wordMain}>
                                        {pronouns.map((m, index) =>
                                            <Text key={m.wm_id+'pro'}>{m.wm_name}{index < pronouns.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                        {verbs.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("verb")} : </Text>
                                    <Text style={styles.wordMain} >
                                        {verbs.map((m, index) =>
                                            <Text key={m.wm_id+'verb'}>{m.wm_name}{index < verbs.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}
                        
                        {cumle.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("sentence")} : </Text>
                                    <Text style={styles.wordMain} >
                                        {cumle.map((m, index) =>
                                            <Text key={m.wm_id+'sentence'}>{m.wm_name}{index < verbs.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                         {edat.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("preposition")} : </Text>
                                    <Text style={styles.wordMain} >
                                        {edat.map((m, index) =>
                                            <Text key={m.wm_id+'sentence'}>{m.wm_name}{index < edat.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                        {baglac.length != 0 ?
                            <View style={styles.wordCard}>
                                <View style={styles.wordMains}>
                                    <Text style={styles.wordMain}>{LanguageFind("conjunction")} : </Text>
                                    <Text style={styles.wordMain} >
                                        {baglac.map((m, index) =>
                                            <Text key={m.wm_id+'sentence'}>{m.wm_name}{index < baglac.length - 1 ? ',' : ''}</Text>
                                        )}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                            {item.wordExample.length !== 0 ? (
                                <View style={[styles.wordMains, { backgroundColor: '#b4e0ff', borderRadius: 5, marginTop: 4, padding: 10 }]}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5, width: '100%' }}>{LanguageFind("examples")} :</Text>
                                    <ScrollView style={{ maxHeight: 150 }}>
                                        {item.wordExample.map((m, index) => (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }} key={m.we_id + 'exp'}>
                                                <Text>
                                                <FontAwesome name="circle" size={10} color="#000" style={{ marginRight: 5 }} /> {/* Nokta ikonu */}
                                                <Text style={[styles.exampleSentence, { marginBottom: 5 }]}>{m.we_name}</Text>
                                                </Text>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            ) : null}


                        <View style={{flexDirection: 'row',marginTop: 20,}}>
                        <View style={styles.buttonContainer}>
                        <button 
                            style={{backgroundColor:"rgb(255 244 232)",transitionDuration:"0s",border: "1px dotted rgb(196 183 161)",color: "rgb(163 106 4)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => onUpdateModal(item)}>{LanguageFind("update")}</button>
                        </View>
                        <View style={styles.buttonContainer}>
                        <button 
                            style={{backgroundColor:"rgb(255 232 232)",transitionDuration:"0s",border: "1px dotted rgb(196 161 161)",color: "rgb(134 0 0)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => onDeleteModal(item)}>{LanguageFind("delete")}</button>
                        </View> 

                        </View>

                    </View>
                </View>
               
            </View>
            
        </>
    );
};
  
const CartsScreen = ({ onItemLongPress, onItemPress, isMultiSelectMode, selectedItems, type = 0 }) => {
    const [chats, setchats] = useState([]);
    const [scharts, setschats] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [params, setParams] = useState({params:null});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [Item, setItem] = useState();
    const [groupData, setgroupData] = React.useState([]);
    const [typeData, setmeanTypesData] = React.useState([]);

    const onDeleteModal = (item) => {
        console.log(item);
        setItem(item);
        setShowDeleteModal(true);
    };
    const onUpdateModal = (item) => {
        setParams({params:{item:item}})
        // setParams({params:undefined})
        setShowModal(true);
    };

    const onCreateModal = () => {
        setParams({params:undefined})
        setShowModal(true);
    };

    const closeModal=()=>
    {
        setShowModal(false);
    }

    const closeDeleteModal=()=>
    {
        setShowDeleteModal(false);
    }

    const handeleDelete=(item)=>
    {
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

    const crudApi=(item)=>{
        console.log("ekleme yapılacak",item);
        if(item.type===0)
        {
            const fetchwordsAdd= async () => {
                await wordsAdd(item.data).then((x) => {
                    ///// ekleme başarılı dönmesi gerekiyor
                    alert("ekleme başarılı");
                    const fetchData = async () => {
                      const chats = await words();
                      AsyncStorage.setItem('carts',JSON.stringify(chats));
                      setchats(chats);
                      setschats(chats);
                  };
              
                  fetchData(); // API isteğini gönder
                  }).catch(err => console.log(err));
              };
              fetchwordsAdd();
        }
        else
        {
            const fetchwordsUpdate= async () => {
                await wordUpdate(item.data).then((x) => {
                    ///// ekleme başarılı dönmesi gerekiyor
                    alert("güncelle başarılı");
                    const fetchData = async () => {
                      const chats = await words();
                      AsyncStorage.setItem('carts',JSON.stringify(chats));
                      setchats(chats);
                      setschats(chats);
                  };
              
                  fetchData(); // API isteğini gönder
                  }).catch(err => console.log(err));
              };
              fetchwordsUpdate();
        }
        
       
    } 
    
    useEffect(() => {
        const fetchData = async () => {
            let iscart=AsyncStorage.getItem('carts');
           
            if(iscart==undefined || iscart==null)
            {
                const chats = await words();
                AsyncStorage.setItem('carts',JSON.stringify(chats));
                setchats(chats);
                setschats(chats);
            }
            else
            {
                const chats=JSON.parse(iscart);
                setchats(chats);
                setschats(chats);
            }
            
            
        };
    
       

        const fetchgroupData = async () => {

            let wordGroupsl=AsyncStorage.getItem('wordGroups');
           
            if(wordGroupsl==undefined || wordGroupsl==null)
            {
                const wordGroupsx = await wordGroups();
                AsyncStorage.setItem('wordGroups',JSON.stringify(wordGroupsx));
                setgroupData(wordGroupsx);
            }
            else
            {
                const wordGroupsx=JSON.parse(wordGroupsl);
                setgroupData(wordGroupsx);
            }
        };
        const fetchmeansTypeData = async () => {
            let wordMeansm=AsyncStorage.getItem('wordMeans');
           
            if(wordMeansm==undefined || wordMeansm==null)
            {
                const wordMeansx = await meansType();
                AsyncStorage.setItem('wordMeans',JSON.stringify(wordMeansx));
                setgroupData(wordMeansx);
            }
            else
            {
                const wordMeansx=JSON.parse(wordMeansm);
                setgroupData(wordMeansx);
            }
        };
        fetchgroupData(); 
        fetchmeansTypeData(); 
        fetchData(); // API isteğini gönder

      }, []); // Boş bağımlılık dizisi, sadece bileşen yüklendiğinde çalışmasını sağlar
    
      const onSearch = (text) => {
        const filteredWords = chats.filter(word => 
            word.w_name.toLowerCase().includes(text.toLowerCase()) ||  // Kelime adında arama yapma
            word.wordMeans.some(mean => mean.wm_name.toLowerCase().includes(text.toLowerCase()))
          );
        setschats(filteredWords);
      };

    
    return (
        <View style={styles.container}>
               <View style={{flexDirection: 'row'}}>
                        <View style={[styles.buttonContainer,{padding: "4px"}]}>
                            <button 
                            style={{backgroundColor:"rgb(232 255 234)",transitionDuration:"0s",border: "1px dotted rgb(161, 196, 165)",color: "#1f8600",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => onCreateModal()}>{LanguageFind("new_word")}</button>
                        </View>
                        <View style={[styles.buttonContainer,{padding: "4px"}]}>
                        <button 
                            style={{backgroundColor:"rgb(232 241 255)",transitionDuration:"0s",border: "1px dotted rgb(161 169 196)",color: "rgb(0 10 134)",borderRadius: "8px",padding: "9px 0",
                            fontWeight: "bold"}} 
                            onClick={() => exportExcel()}>{LanguageFind("export_words")}</button>
                        </View>

                </View> 
            <View style={{
                paddingTop: 3,
                paddingBottom: 14,
                paddingLeft: 9,
                paddingRight: 9,
                borderRadius: 10,
            }}>
            <View style={[
                    {
                        appearance: "none",
                        borderRadius: "0px",
                        border: "0px solid black",
                        boxSizing: "border-box",
                        font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        margin: "0px",
                        resize: "none",
                        width: "100%",
                        borderRadius: "9px",
                        background: "#fff",
                        border: "1px solid #d5d5d5",
                    }]}>
                <TextInput
                style={styles.inputText}
                placeholder={LanguageFind("search")}
                placeholderTextColor="#003f5c"
                onChangeText={text => onSearch(text)}
                paddingLeft={10} // Placeholder'ın sol tarafına padding eklemek için
        underlineColorAndroid="transparent" // Çerçeveyi kaldırmak için
                />
            </View>
            </View>
          

            <FlatList
                data={scharts}
                renderItem={({ item }) => (
                    <ChatItem
                        item={item}
                        onItemLongPress={() => onItemLongPress(item.id)}
                        onItemPress={() => onItemPress(item.id)}
                        selectedItems={selectedItems}
                        closeModal={closeModal}
                        onDeleteModal={onDeleteModal}
                        onUpdateModal={onUpdateModal}
                        showModal={showModal}
                        params={params}
                    />
                )}
                style={styles.flatList}
            /> 
 <Modal visible={showModal} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <AddItemFormComponent route={params} crudApi={crudApi} closeModal={closeModal} groupData={groupData} typeData={typeData}/>
                </View>
            </Modal>

            <Modal visible={showDeleteModal} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <ScrollView style={{ flexGrow: 1,width:"95%",marginTop:"10px"}}>
      
                    <View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20,borderRadius:10,background: "#fff" }] }>
                    <View style={{flexDirection: 'row',borderBottom:"1px solid #e2e2e2",marginBottom:23}}>
                    <Text style={{padding:0,width: "100%",margin: 0,fontSize:20}}><b>{Item!==undefined && Item!==null?Item.w_name:null} {LanguageFind("delete")}</b></Text>
                        <TouchableOpacity onPress={() => closeDeleteModal()} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                            <Text>X</Text>
                            </TouchableOpacity>
                    </View>
                    <View><Text> {LanguageFind("are_you_sure_you_want_to_delete")}</Text></View>
                        
                    <View style={{flexDirection: 'row',marginTop: 20,}}>
                        
                        <View style={styles.buttonContainer}>
                            <Button title="Sil" color="red"  onPress={() =>handeleDelete(Item)} />
                        </View> 
                        <View style={styles.buttonContainer}>
                            <Button title="Kapat" color="#000" onPress={() => closeDeleteModal()} />
                        </View>
                        </View>

                    </View>
                    
                </ScrollView>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1, // Eşit genişlikte iki düğme sağlamak için
        marginHorizontal: 5, // Düğmeler arasında yatay boşluk
      },
    inputView: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
      },
      inputText: {
        height: 40,
        color: '#003f5c',
        padding:7
      },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    addItemButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    addItemText: {
        fontSize: 15,
        fontWeight: 'bold',
    },

    addItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    flatList: {
        flex: 1,
        zIndex: 4
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
        height: 200,
        marginRight: 0,
        borderRadius: 10,
    },
    chatInfo: {
        flex: 1,
    },

    // Yeni eklenen stiller
    wordCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    wordMains: {
        flexDirection: 'row', // Yazıları yatayda sıralamak için
        flexWrap: 'wrap',
        // marginLeft: 10,
        width:'100%'
      },
      wordMain: {
        marginRight: 5,       // Yazılar arasına boşluk bırakmak için
      },

    wordDetails: {
        flex: 1,
        // marginLeft: 10,
    },

    wordText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    soundIcon: {
        marginLeft: 5,
    },
    wordType: {
        fontSize: 14,
        color: '#888',

    },
    exampleSentence: {
        marginTop: 4,
        fontSize: 14,
        color: '#555',
        wordWrap:"break-word"
    },

    // ... (diğer stiller)
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 8,
    },
    addItemButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'center',
        zIndex: 8,
    },
    addItemText: {
        fontSize: 15,
        fontWeight: 'bold',
        zIndex: 8,
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
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        zIndex: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        zIndex: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 70, // Butonun altında çıkması için gerekli değeri ayarlayabilirsiniz.
        right: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        padding: 5,
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd', // veya başka bir arkaplan rengi
        borderRadius: 10,
    },
});

export default CartsScreen;
