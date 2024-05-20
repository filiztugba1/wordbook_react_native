import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Image,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { TextInput} from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import { langList,LanguageFind} from './apiService';
const AddItemForm = ({ route ,crudApi}) => {
  const [formData, setFormData] = useState({
    facebook:{err:false,val:''},
    foreign_language_id:{err:false,val:''},
    gmail:{err:false,val:''},
    mail:{err:false,val:''},
    main_language_id:{err:false,val:''},
    name:{err:false,val:''},
    password:{err:false,val:''},
    phone:{err:false,val:''},
    surname:{err:false,val:''},
    user_image:"",
    user_image_back:"",
    user_name:{err:false,val:''},
    user_id:0,
  });

const [langData, setlanguage] = React.useState([]);
const [error, setError] = useState('');
const [mailerror, setmailerror] = useState('');
useEffect(() => {
    const fetchlang = async () => {
        const langs = await langList();
        setlanguage(langs);
        setFormData({
            facebook:{err:false,val:route.facebook},
            foreign_language_id:{err:false,val:route.foreign_language_id},
            gmail:{err:false,val:route.gmail},
            mail:{err:false,val:route.mail},
            main_language_id:{err:false,val:route.main_language_id},
            name:{err:false,val:route.name},
            password:{err:false,val:route.password},
            phone:{err:false,val:route.phone},
            surname:{err:false,val:route.surname},
            user_image:route.user_image,
            user_image_back:route.user_image_back,
            user_name:{err:false,val:route.user_name},
            user_id:route.user_id,
        });
    };
    fetchlang(); 
  }, []); 

  const handleAddItem = () => {



    // const data={
    //   group:+formData.wg_id,
    //   sub_group:+formData.wg_sub_id,
    //   words:[{
    //     create_date:"2024-03-13",
    //     foreign_language_id:0,
    //     update_date:"2024-03-13",
    //     w_id:0,
    //     w_image:formData.w_image,
    //     w_is_success:false,
    //     w_name:formData.w_name,
    //     wg_id:0,
    //     word_example_model:fexp,
    //     word_means_model:fmean,
    //     irregular_verbs_model:firr,
    //     explanation:formData.explanation
    //   }]
    // };
    const data= {
        user_id: formData.user_id,
        user_name:formData.user_name.val,
        name: formData.name.val,
        surname: formData.surname.val,
        mail: formData.mail.val,
        mail_code: null,
        gmail: formData.gmail.val,
        password: null,
        facebook:formData.facebook.val,
        access_token:null,
        reflesh_token:null,
        user_image: formData.user_image,
        user_image_back: formData.user_image_back,
        phone: formData.phone.val,
        main_language_id: formData.main_language_id.val,
        foreign_language_id: formData.foreign_language_id.val,
        update_date: null,
        create_date: null,
        mail_onay: null,
        mainlanguage: null,
        foreignlanguage: null,
        wordGroups: null,
        meansType: null,
        daily: null,
        grammerNote: null
    }
     crudApi({data:data});
 
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData((prevData) => ({
        ...prevData,
        user_image: result.uri,
      }));
    }
  };
  const pickImageBack = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setFormData((prevData) => ({
        ...prevData,
        user_image_back: result.uri,
      }));
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: { ...prevData[name], val: value }, // Doğru obje içindeki isimlendirme
    }));
  };

  const handleInputErr = (name, error) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: { ...prevData[name], err: error }, // Doğru obje içindeki isimlendirme
    }));
  };

  const isValidEmail = (email) => {
    // Düzenli ifade ile e-posta formatını kontrol et
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
  
  const handleEmailChange = (text) => {
    
    handleInputChange('mailonay',false);
    handleInputErr('mailonay',false);
    // E-posta adresinin geçerli olup olmadığını kontrol et
    if (!isValidEmail(text) && text!='') {
      // E-posta adresi geçerli değilse hata mesajı göster
      setmailerror(LanguageFind("please_enter_a_valid_e_mail_address"));
    } else {
      setmailerror('');
      handleInputChange('mail', text);
      setUsername(text);
    }
  };
  return (
<>

<View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20 }]}>
  
<Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("name")}</b> <span style={formData.name.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind("name")}
        placeholderTextColor="#003f5c"
        name="name"
        value={formData.name.val}
        onChangeText={text => handleInputChange('name', text)}
      />

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("sur_name")}</b> <span style={formData.surname.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind("sur_name")}
        placeholderTextColor="#003f5c"
        name="surname"
        value={formData.surname.val}
        onChangeText={text => handleInputChange('surname', text)}
      />

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("email_address")}</b> <span style={formData.mail.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind("email_address")}
        placeholderTextColor="#003f5c"
        name="mail"
        value={formData.mail.val}
        onChangeText={handleEmailChange}
      />
      <Text style={styles.mailerror}>{mailerror}</Text>


      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("phone_number")}</b> <span style={formData.phone.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind("phone_number")}
        placeholderTextColor="#003f5c"
        name="phone"
        value={formData.phone.val}
        onChangeText={text => handleInputChange('phone', text)}
      />

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("main_language")}</b> <span style={formData.main_language_id.err ? styles.error : null}>*</span></Text>
      <View style={{ width: '100%' }}>
        <SelectList
          setSelected={(val) => handleInputChange('main_language_id', val)}
          data={langData}
          save="key"
          name="main_language_id"
          value={formData.main_language_id.val}
          boxStyles={[{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'white' }]}
          dropdownStyles={[{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'white' }]}
          defaultOption={langData.find(item => +item.key === +formData.main_language_id.val)}
        />
      </View>

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("foreign_language")}</b> <span style={formData.foreign_language_id.err ? styles.error : null}>*</span></Text>
      <View style={{ width: '100%' }}>
        <SelectList
          setSelected={(val) =>  handleInputChange('foreign_language_id', val)}
          data={langData}
          save="key"
          name="foreign_language_id"
          value={formData.foreign_language_id.val}
          boxStyles={[{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'white' }]}
          dropdownStyles={[{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 5, backgroundColor: 'white' }]}
          defaultOption={langData.find(item => +item.key === +formData.foreign_language_id.val)}
        />
      </View>

     <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind("user_name")}</b> <span style={formData.user_name.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind("user_name")}
        placeholderTextColor="#003f5c"
        name="user_name"
        value={formData.user_name.val}
        onChangeText={text => handleInputChange('user_name', text)}
      />

<Text style={styles.label}><b>{LanguageFind("profile_url")}:</b></Text>
      <View style={[styles.means, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
        <>
        {formData.user_image && <Image source={{ uri: formData.user_image }} style={{ width: 150, height: 150,marginBottom:10 }} />}
        <Button title={LanguageFind("add_image")} onPress={pickImage} />
        </>
      </View>

      <Text style={styles.label}><b>{LanguageFind("profile_back_url")}:</b></Text>
      <View style={[styles.means, { flex: 1, alignItems: 'center', justifyContent: 'center' }]}>
        <>
        {formData.user_image_back && <Image source={{ uri: formData.user_image_back }} style={{ width: 150, height: 150,marginBottom:10 }} />}
        <Button title={LanguageFind("add_image")} onPress={pickImageBack} />
        </>
      </View>

    </View>
     <TouchableOpacity onPress={handleAddItem} style={[styles.addButton, { backgroundColor: 'blue', color: 'white' }]}>
     <Text style={[styles.buttonText, { color: 'white' }]}><b>{LanguageFind("profile_update")}</b></Text>
   </TouchableOpacity></>
  );
};



const ProfileUpdate = ({route,closeModal,crudApi}) => {

  return (
    <ScrollView style={{ flexGrow: 1,width:"95%",marginTop:"10px"}}>
      
        <View style={[styles.formContainer, { borderTopColor: '#e9e7e7', borderTopWidth: 1, borderStyle: 'solid', zIndex: 1,borderRadius:0,padding:10,paddingTop:20,borderRadius:10 }] }>
        <View style={{flexDirection: 'row'}}>
        <Text style={{padding:0,width: "100%",margin: 0,fontSize:20}}>{<b>{LanguageFind("profile_update")}</b>}</Text>
          <TouchableOpacity onPress={() => closeModal()} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                <Text>X</Text>
              </TouchableOpacity>
        </View>

        <AddItemForm route={route} closeModal={closeModal} crudApi={crudApi}/>
         
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
    width:'100%'
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
    // padding: 10,
    // borderRadius: 10,
    marginBottom: 10,
    paddingBottom:20
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    zIndex: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 10,
    paddingBottom:20
  },
  activeTabButton: {
    backgroundColor: 'white',
    borderColor: '#e9e7e7',  // Sağdan, soldan ve üstten border rengi
    borderBottomColor: '#fff',  // Sağdan, soldan ve üstten border rengi
    borderWidth: 1,        // Sağdan, soldan ve üstten border kalınlığı
    borderStyle: 'solid',  // Sağdan, soldan ve üstten border stil
    
    marginTop: -1,         // Sağdan, soldan ve üstten border kalınlığı için ayar
    marginRight: -1,       // Sağdan, soldan ve üstten border kalınlığı için ayar
    marginLeft: -1,
    zIndex: 2,
    paddingBottom:20

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
    fontSize: 16,
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

export default ProfileUpdate;
