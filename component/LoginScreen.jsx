import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { login,LanguageFind } from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({ navigation, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async ()  => {
    try {
      const loginform = { username: username, password };
      if(username!=='' && password!=='')
      {
        const user = await login(loginform);
        setUserData(user);
        if(user!=='' && user!==undefined)
        {
          AsyncStorage.setItem('AccessToken',user.accessToken);
          onLogin();
        }
        else
        {
          setError(LanguageFind("username_or_password_is_wrong"));
        }
      }else{
        setError(LanguageFind("username_and_password_cannot_be_blank"));
      }
      
      
    } catch (error) {
      setError(LanguageFind("username_or_password_is_wrong"));
    }

    // if (username === 'demo' && password === 'demo') {
    //   onLogin(); // Oturum açma işlemi başarılı olduğunda onLogin fonksiyonunu çağır
    // } else {
    //   setError('Kullanıcı adı veya şifre hatalı.');
    // }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp'); // SignUp ekranını çağır
  };
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword'); // SignUp ekranını çağır
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Wordbook</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder={LanguageFind("user_name")}
          placeholderTextColor="#003f5c"
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder={LanguageFind("password")}
          placeholderTextColor="#003f5c"
          onChangeText={text => setPassword(text)}
        />
      </View>
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text>{LanguageFind("forgot_password")}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>{LanguageFind("login")}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
        <Text style={styles.loginText}>{LanguageFind("sign_up")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#1877f2',
    marginBottom: 40,
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
    height: 50,
    color: '#003f5c',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
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
