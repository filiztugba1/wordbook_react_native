import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Modal } from 'react-native';
import { TextInput } from 'react-native-paper';
import { onayKodGonder,changePassword,LanguageFind} from './apiService';
const ForgotPasswordScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mailerror, setmailerror] = useState('');
  const [langData, setlangData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = React.useState({
    user_id:0,
    user_name:{err:false,val:'fcurukcu'},
    name:{err:false,val:'filiz'},
    surname:{err:false,val:'çürükcü'},
    mail:{err:false,val:'fcurukcu@gmail.com'},
    password:{err:false,val:'123456'},
    password2:{err:false,val:'123456'},
    phone:{err:false,val:'5534444072'},
    main_language_id:{err:false,val:'1'},
    foreign_language_id:{err:false,val:'3'},
    mail_onay:{err:false,val:false},
    mail_onay_kodu:{err:false,val:''},
  });
  useEffect(() => {
    const fetchlang = async () => {
        const langs = await langList();
        setlangData(langs);
    };
    fetchlang(); 
  }, []); 

  

  const handleLogin = () => {
    navigation.navigate('Login'); // SignUp ekranını çağır
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
      setmailerror(LanguageFind('please_enter_a_valid_e_mail_address'));
    } else {
      setmailerror('');
      handleInputChange('mail', text);
      setUsername(text);
    }
  };

  const handleSignUp = () => {
   
    let isrequired=false;


    if(formData.mail.val=='')
    {
      handleInputErr('mail',true)
      isrequired=true;
    }
    else{
      handleInputErr('mail',false)
    }
    
    if(formData.password.val=='')
    {
      handleInputErr('password',true)
      isrequired=true;
    }
    else{
      handleInputErr('password',false)
    }

    if(formData.password2.val=='')
    {
      handleInputErr('password2',true)
      isrequired=true;
    }
    else{
      handleInputErr('password2',false)
    }

    if(isrequired)
    {
      setError(LanguageFind('please_fill_in_the_required_fields'));
      return 0;
    }
    else if(formData.password.val !==formData.password2.val)
    {
      setError(LanguageFind('password_fields_do_not_match'));
      return 0;
    }
    else if(formData.password.val.length<6 || formData.password.val.length>10)
    {
      setError(LanguageFind('the_password_must_consist_of_at_least_6_and_at_most_10_characters'));
      return 0;
    }
    else
    {
      setError('');
    }

      const fetchonayKod= async () => {
        await onayKodGonder({
            onay_kodu:'',
            mail:formData.mail.val,
            password:''
        }).then((x) => {
            setShowModal(true);
          }).catch(err => console.log(err));
      };
      fetchonayKod(); 
    
  };


  const handleonayla=()=>{
    if(formData.mail_onay_kodu.val=='') //// mail onaylama işlemi yapılacak
    {
      setError(LanguageFind('you_must_enter_the_confirmation_code_sent_to_your_email'));
      return 0;
    }
    const change_password= async () => {
      await changePassword({
        onay_kodu:formData.mail_onay_kodu.val,
        mail:formData.mail.val,
        password:formData.password.val
      }).then((x) => {
        alert(LanguageFind('your_membership_process_has_been_completed_successfully_please_be_directed_to_the_login_page'));
        handleLogin();
        }).catch(err => console.log(err));
    };
    change_password(); 
  }
  return (
    <>
    <View style={styles.container}>
      <Text style={styles.title}>Wordbook</Text>
      <Text style={[styles.subtitle, { marginTop: 10 }]}><b>{LanguageFind('change_password')}</b></Text>
   

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind('email_address')}</b> <span style={formData.mail.err ? styles.error : null}>*</span></Text>
      <TextInput
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind('email_address')}
        placeholderTextColor="#003f5c"
        name="mail"
        value={formData.mail.val}
        onChangeText={handleEmailChange}
      />
      <Text style={styles.mailerror}>{mailerror}</Text>

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind('password')}</b> <span style={formData.password.err ? styles.error : null}>*</span></Text>
      <TextInput
        secureTextEntry
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind('password')}
        placeholderTextColor="#003f5c"
        name="password"
        value={formData.password.val}
        onChangeText={text => handleInputChange('password', text)}
      />

      <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind('password_again')}</b> <span style={formData.password2.err ? styles.error : null}>*</span></Text>
      <TextInput
        secureTextEntry
        style={[styles.input, { backgroundColor: 'white' }]}
        placeholder={LanguageFind('password_again')}
        placeholderTextColor="#003f5c"
        name="password2"
        value={formData.password2.val}
        onChangeText={text => handleInputChange('password2', text)}
      /> 

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
        <Text style={styles.loginText}>{LanguageFind('change')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>{LanguageFind('login')}</Text>
      </TouchableOpacity>
    

    <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%' }}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
              <Text>X</Text>
            </TouchableOpacity>
            <Text style={[styles.label, { marginTop: 10 }]}>{LanguageFind('you_must_enter_the_confirmation_code_sent_to_your_email')}</Text>
            <Text style={[styles.label, { marginTop: 10 }]}><b>{LanguageFind('confirmation_code')}</b> <span style={formData.password2.err ? styles.error : null}>*</span></Text>
            <TextInput
              secureTextEntry
              style={[styles.input, { backgroundColor: 'white', width: '100%' }]}
              placeholder={LanguageFind('confirmation_code')}
              placeholderTextColor="#003f5c"
              name="mail_onay_kodu"
              onChangeText={text => handleInputChange('mail_onay_kodu', text)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.loginBtn, { width: '100%' }]} onPress={handleonayla}>
                <Text style={styles.loginText}>{LanguageFind('approve')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>

   
    </>

  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#1877f2',
    marginBottom: 20,
    marginTop: 40,
  },
  error:{
    color:'red'
  },
  subtitle: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "left",
    width: '80%'
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%'
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  mailerror: {
    color: 'red',
    width: '80%'
  },

  
  loginBtn: {
    width: '80%',
    backgroundColor: '#1877f2',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: 'white',
  },
});
