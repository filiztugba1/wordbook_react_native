import React, { useState,useEffect  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { Image, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // FontAwesome eklenen kütüphanenin ismi
import AsyncStorage from '@react-native-async-storage/async-storage';
// import WorkItem from './WorkItem'; // AddItem component'ının olduğu dosya yolu
import { words,UpdateWordStatus,LanguageFind} from './apiService';
const BasicReview = ({ onItemLongPress, onItemPress, isMultiSelectMode, selectedItems, type = 0 }) => {
    const [isPageType, setisPageType] = useState(0);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);


    const [chats, setchats] = useState([]);
    const [scharts, setschats] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            let iscart=AsyncStorage.getItem('carts');
           
            if(iscart==undefined || iscart==null)
            {
                const chats = await words();
                AsyncStorage.setItem('carts',JSON.stringify(chats));
                const allCart=chats.filter(x=>x.w_is_success===false);
                setchats(allCart);
            }
            else
            {
                const chats=JSON.parse(iscart);
                const allCart=chats.filter(x=>x.w_is_success===false);
                setchats(allCart);
            }
           
        };
        fetchData(); // API isteğini gönder
    
      }, []); // Boş bağımlılık dizisi, sadece bileşen yüklendiğinde çalışmasını sağlar
    
    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 50 && gestureState.vx > 0.5) {
                    // Sağa kaydırma ve hız kontrolü
                    handleNextCard();
                } else if (gestureState.dx < -50 && gestureState.vx < -0.5) {
                    // Sola kaydırma ve hız kontrolü
                    handlePrevCard();
                }
            },
            onPanResponderRelease: () => {
                // Eğer gerekirse, dokunmatikten elini çektiğinizde başka bir şey yapabilirsiniz.
            },
        })
    ).current;
    const handleNextCard = () => {
        if (currentCardIndex < chats.length - 1) {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        } else {
            // Eğer son kartsa başa dön
            setCurrentCardIndex(0);
        }
    };


    const handleTick = () => {
       
        const fetchUpdate = async () => {
            const fdata={
                status:true,
                w_id:chats[currentCardIndex].w_id
            }
            await UpdateWordStatus(fdata).then((x) => {
                let iscart=AsyncStorage.getItem('carts');
                const allchatsx=JSON.parse(iscart);
                const index=allchatsx.findIndex(x=>x.w_id===fdata.w_id);
                allchatsx[index].w_is_success=true;
                AsyncStorage.setItem('carts',JSON.stringify(allchatsx));

                
                chats[currentCardIndex].w_is_success=true;
                const allCart=chats.filter(x=>x.w_is_success===false);
                setchats(allCart);
    
        }).catch(err => console.log(err));
       
        }
        fetchUpdate(); 

        //////////// apiye de gönderilip güncellenmesi gerekir  //////// 
    };

    const handlePrevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex((prevIndex) => prevIndex - 1);
        } else {
            // Eğer ilk kartsa sona git
            setCurrentCardIndex(chats.length - 1);
        }
    };

    const [gameCompleted, setGameCompleted] = useState(false);

  const handleGameComplete = () => {
    setGameCompleted(true);
  };

  const ChatItem = ({ item, onItemLongPress, onItemPress, selectedItems = null, type = 0, handlePrevCard = null, handleTick = null, handleNextCard = null }) => {
    const adverbs = item.wordMeans.filter(x => x.meantype.mt_short_name === 'zf.');
    const verbs = item.wordMeans.filter(x => x.meantype.mt_short_name === 'f.');
    const cumle = item.wordMeans.filter(x => x.meantype.mt_short_name === 'c.');
    const adjectives = item.wordMeans.filter(x => x.meantype.mt_short_name === 's.');
    const pronouns = item.wordMeans.filter(x => x.meantype.mt_short_name === 'zm.');
    const nouns = item.wordMeans.filter(x => x.meantype.mt_short_name === 'i.');
    const edat = item.wordMeans.filter(x => x.meantype.mt_short_name=== 'ed.');
    const baglac = item.wordMeans.filter(x => x.meantype.mt_short_name === 'bağ.');

    // ...

    return (
        <>

            <TouchableOpacity
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
                {type === 1 ? <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',  // Yatayda ve dikeyde ortalamak için eklenen stil
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        marginBottom: 5,
                        borderColor: '#e0e0e0',
                        backgroundColor: '#f5f5f5',
                        borderWidth: 1,
                        padding: 5,
                        borderRadius: 5
                    }}
                >
                    <TouchableOpacity onPress={handlePrevCard}>
                        <FontAwesome name="caret-left" size={30} color="gray" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleTick}>
                        {/* <Icon name="check-circle" size={30} color="green" /> */}
                        <Text style={{color:"green"}}>{LanguageFind("learned")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNextCard}>
                        <FontAwesome name="caret-right" size={30} color="gray" />
                    </TouchableOpacity>
                </View> : ''}

                {
                    type == 1 ? <View style={styles.wordCard}>
                        <>
                            <View style={styles.wordDetails}>
                                <Text style={[styles.wordText, { fontSize: 25 }]}>{item.w_name}</Text>
                            </View>
                            <FontAwesome name="volume-high" size={24} color="#888" style={styles.soundIcon} onPress={() => speak(item.w_name)} /> </>
                    </View> : ''
                }
                   {item.w_image != '' ? <Image source={{ uri: item.w_image }} style={styles.avatar} /> :
                    <View style={styles.avatar}>
                        <View style={styles.imagePlaceholder}>
                            <FontAwesome name="image" size={50} color="#888" />
                            <Text>{LanguageFind("no_picture")}</Text>
                        </View>
                    </View>
                    } 

                <View style={styles.listItemContent}>

                    <View style={styles.chatInfo}>
                        {/* İngilizce kelime kartı */}
                        {/* <View style={styles.wordCard}>
                                <>
                                    <View style={styles.wordDetails}>
                                        <Text style={styles.wordText}>{item.w_name}</Text>
                                    </View>
                                    <FontAwesome name="volume-high" size={24} color="#888" style={styles.soundIcon} onPress={() => speak(item.w_name)} /> </>
                            </View> */}
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
                    </View>
                </View>
            </TouchableOpacity>
        </>
    );
};
    return (<View
        style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        {...panResponder.panHandlers}
    >

        {chats.length!==null && chats.length!==0?<ChatItem
            key={chats[currentCardIndex]}
            item={chats[currentCardIndex]}
            onItemLongPress={() => onItemLongPress(chats[currentCardIndex])}
            onItemPress={() => onItemPress(chats[currentCardIndex])}
            type={1}
            // selectedItems={selectedItems}
            handlePrevCard={handlePrevCard}
            handleTick={handleTick}
            handleNextCard={handleNextCard}
        /> :null} 

            

    </View>);
};

const styles = StyleSheet.create({
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
        marginLeft: 10,
    },
    wordMain: {
        marginRight: 5,       // Yazılar arasına boşluk bırakmak için
    },

    wordDetails: {
        flex: 1,
        marginLeft: 10,
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

export default BasicReview;
