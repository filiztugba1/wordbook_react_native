import React, { useState,useEffect  } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Örnek olarak FontAwesome ikon setini kullanabilirsiniz, istediğiniz ikon setini seçebilirsiniz
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import { Image, ScrollView } from 'react-native';
import {LanguageFind} from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const chats = [
//     {
//         id: 13, en: 'about', means: [
//             { mean: 'hemen hemen', type: 'zf.', id: 1 },
//             { mean: 'aşağı yukarı', type: 'zf.', id: 2 },
//             { mean: 'yaklaşık', type: 'zf.', id: 3 },
//         ],
//         examples: [{ name: 'it is about', id: 1 }, { name: 'she is about', id: 2 }]
//         , image: 'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/ae4816cade1a5b7f29787d0b89610132c72c7747041481c6619b9cc3302c0101._RI_TTW_.jpg'
//     },
//     {
//         id: 14, en: 'above', means: [
//             { mean: 'üzerine', type: 'zf.', id: 4 },
//             { mean: 'yukarısında', type: 'zf.', id: 5 },
//             { mean: 'yukarıda', type: 'zf.', id: 6 },
//         ],
//         examples: [{ name: 'it is above', id: 3 }, { name: 'she is above', id: 4 }]
//         , image: 'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/ae4816cade1a5b7f29787d0b89610132c72c7747041481c6619b9cc3302c0101._RI_TTW_.jpg'
//     },

//     {
//         id: 15, en: 'action', means: [
//             { mean: 'çalışma', type: 'i.', id: 7 },
//             { mean: 'davranış', type: 'i.', id: 8 },
//             { mean: 'aksiyon', type: 'i.', id: 9 },
//         ],
//         examples: [{ name: 'it is action', id: 5 }, { name: 'she is action', id: 6 }]
//         , image: 'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/ae4816cade1a5b7f29787d0b89610132c72c7747041481c6619b9cc3302c0101._RI_TTW_.jpg'
//     },
//     {
//         id: 16, en: 'above', means: [
//             { mean: 'üzerine', type: 'zf.', id: 10 },
//             { mean: 'yukarısında', type: 'zf.', id: 11 },
//             { mean: 'yukarıda', type: 'zf.', id: 12 },
//         ],
//         examples: [{ name: 'it is above', id: 7 }, { name: 'she is above', id: 8 }]
//         , image: ''
//     },


//     // ... Diğer sohbetler
// ];
const MultipleAnswerScreen = ({ onItemLongPress, onItemPress, isMultiSelectMode, selectedItems, type = 0 }) => {
    

    

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

const MultipleAnswer = ({ item, onItemLongPress, onItemPress, selectedItems = null, type = 0, handlePrevCard = null, handleTick = null, handleNextCard = null, chats = null }) => {
    // Rasgele seçilen bir kelimenin Türkçe anlamını bulma fonksiyonu
    const getRandomMeaning = () => {
        const randomIndex = Math.floor(Math.random() * chats.length);
        if (chats[randomIndex].w_name === item.w_name) {
            getRandomMeaning();
        }
        
        return chats[randomIndex].wordMeans.map(mean => mean.wm_name).join(', '); // Burada sadece ilk anlamı alıyoruz, dilerseniz farklı bir anlamı da seçebilirsiniz.
    };

    // Rasgele şıkları oluşturma
    const generateRandomOptions = () => {
        console.log(item);
        const correctMeaning = item.wordMeans.map(mean => mean.wm_name).join(', '); // Doğru cevap
        const min = 0;
        const max = 5; // Bu değer max değerine dahil olmayacak, yani 4'e kadar olan sayıları içerecek.

        const randomNumber = Math.floor(Math.random() * (max - min) + min);

        const options = [
            { option: 'A', meaning: randomNumber == 0 ? correctMeaning : getRandomMeaning(),isCorrect:randomNumber == 0?true:false,isSelect:false }, // Doğru cevap
            { option: 'B', meaning: randomNumber == 1 ? correctMeaning : getRandomMeaning(),isCorrect:randomNumber == 1?true:false,isSelect:false }, // 
            { option: 'C', meaning: randomNumber == 2 ? correctMeaning : getRandomMeaning(),isCorrect:randomNumber == 2?true:false,isSelect:false}, // 
            { option: 'D', meaning: randomNumber == 3 ? correctMeaning : getRandomMeaning(),isCorrect:randomNumber == 3?true:false,isSelect:false }, // 
            { option: 'E', meaning: randomNumber == 4 ? correctMeaning : getRandomMeaning(),isCorrect:randomNumber == 4?true:false,isSelect:false }, // 
            // Daha fazla şık ekleyebilirsiniz
        ];

        // Şıkları karıştırma
        return options;
    };

    const handleSelect = (index) => {
        // Yeni bir randomOptions array'i oluşturun
        const updatedRandomOptions = randomOptions.map((option, i) => {
            // Tıklanan öğeyi işaretleyin, diğer öğeleri olduğu gibi bırakın
            if (i === index) {
                return { ...option, isSelect: true };
            } else {
                return option;
            }
        });
        const cor=updatedRandomOptions[index].isCorrect===true;
        if(cor)
        {
            setTimeout(handlePrevCard, 1000);
        }
        // Güncellenmiş randomOptions state'ini ayarlayın
        setRandomOptions(updatedRandomOptions);
    };
    
    const [randomOptions, setRandomOptions] = useState([]);
    useEffect(() => {
       const randomOptionsx = generateRandomOptions();
       setRandomOptions(randomOptionsx);
    
      }, []); 

    return (
        <>
            <View
                style={[
                    styles.listItem,
                    {
                        marginVertical: 5,
                        marginHorizontal: 10,
                        backgroundColor: selectedItems != null && selectedItems.includes(item.w_id) ? '#ddd' : '#fff',
                        width: '95%'
                    },
                ]}
            >
                {type === 1 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
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
                        {/* <FontAwesome name="check-circle" size={30} color="green" /> */}
                        <Text style={{color:"green"}}>{LanguageFind("learned")}</Text>
                    </TouchableOpacity>

                        <TouchableOpacity onPress={handleNextCard}>
                            <FontAwesome name="caret-right" size={30} color="gray" />
                        </TouchableOpacity>
                    </View>
                ) : ''}
                   {item.w_image != '' ? <Image source={{ uri: item.w_image }} style={styles.avatar} /> :
                    <View style={styles.avatar}>
                        <View style={styles.imagePlaceholder}>
                            <FontAwesome name="image" size={50} color="#888" />
                            <Text>{LanguageFind("no_picture")}</Text>
                        </View>
                    </View>
                    } 

                {type === 1 ? (
                    <View style={styles.wordCard}>
                        <>
                            <View style={styles.wordDetails}>
                                <Text style={[styles.wordText, { fontSize: 25 }]}>{item.w_name}</Text>
                            </View>
                            <FontAwesome name="volume-high" size={24} color="#888" style={styles.soundIcon} onPress={() => speak(item.w_name)} /> </>
                    </View>
                ) : ''}

                <View style={styles.listItemContent}>

                    <View style={styles.chatInfo}>
                        {type === 0 ? <View style={styles.wordCard}>
                            <>
                                <View style={styles.wordDetails}>
                                    <Text style={styles.wordText}>{item.w_name}</Text>
                                </View>
                                <FontAwesome name="volume-high" size={24} color="#888" style={styles.soundIcon} onPress={() => speak(item.w_name)} /> </>
                        </View> : ''}
                        <View style={[styles.wordCard, { marginTop: 4, textAlign: "center" }]}>
                            <View >
                                <Text style={{ textAlign: "left", marginTop: 4, marginBottom: 4, marginLeft: 10 }}>{LanguageFind("which_of_the_following_means")}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                {randomOptions.map((option, index) => (
                    <TouchableOpacity onPress={()=>handleSelect(index)} style={option.isCorrect===true && option.isSelect===true?[styles.correctSelect]:(option.isCorrect===false && option.isSelect===true?[styles.wrongSelect]:[styles.nonSelectView])}>
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', marginVertical: 4}}>
                            <Text style={{ marginRight: 8, fontWeight: 'bold' }}>{option.option}:</Text>
                            <Text>{option.meaning}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};
    return (<ScrollView
        style={{
            flex: 1,
        }}
        contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
        }}
        {...panResponder.panHandlers}
    >
        {/* Diğer içerikler buraya gelecek */}
        {chats.length!==null && chats.length!==0?<MultipleAnswer
            key={chats[currentCardIndex]}
            item={chats[currentCardIndex]}
            onItemLongPress={() => onItemLongPress(chats[currentCardIndex])}
            onItemPress={() => onItemPress(chats[currentCardIndex])}
            type={1}
            handlePrevCard={handlePrevCard}
            handleTick={handleTick}
            handleNextCard={handleNextCard}
            chats={chats}
        />:null}

        {/* İlk tablo */}
        {/* <table style={{ borderCollapse: 'collapse', marginBottom: 10 }}>
            <tbody>
                {Array.from({ length: Math.ceil(chats.length / 10) }, (_, groupIndex) => (
                    <tr key={groupIndex}>
                        {chats.slice(groupIndex * 10, (groupIndex + 1) * 10).map((option, index) => (
                            <td key={index}>
                                <div style={{
                                    width: '25px',
                                    height: '25px',
                                    border: index + groupIndex * 10 === currentCardIndex ? '1px solid #000' : '1px solid #ddd',
                                    padding: '8px',
                                    background: 'white',
                                    boxSizing: 'border-box',
                                }}>
                                     İçeriği buraya ekleyin 
                                </div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table> */}


    </ScrollView> );
};

const styles = StyleSheet.create({
    nonSelectView:{ borderRadius:8,paddingBottom:2,paddingTop:2,paddingLeft:6,paddingRight:6,marginBottom:1},
    wrongSelect:{ backgroundColor:"red",color:"white",borderRadius:8,paddingBottom:2,paddingTop:2,paddingLeft:6,paddingRight:6,backgroundColor: "#ffb0b0",marginBottom:1 },
    correctSelect:{backgroundColor:"green",color:"white",borderRadius:8,paddingBottom:2,paddingTop:2,paddingLeft:6,paddingRight:6,backgroundColor: "#c2ffb0",marginBottom:1 },
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

export default MultipleAnswerScreen;
