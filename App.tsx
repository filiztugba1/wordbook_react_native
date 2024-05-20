/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState,useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import SignUpScreen from './component/SignUpScreen';
import WordBook from './component/WordBook';
import ForgotPasswordScreen from './component/ForgotPasswordScreen';
import { translateApi} from './component/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [translate, settranslate] = useState([]);


  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kullanıcının oturumunu açan fonksiyon
  const handleLogin = () => {
    // Kullanıcının oturumunu açma işlemleri burada gerçekleştirilir
    // Örneğin, kimlik doğrulama, kullanıcı bilgilerini kontrol etme vb.

    // Oturum başarılı ise isAuthenticated değerini true yap
    
    setIsAuthenticated(true);
  };


  // Kullanıcının oturumunu kapatan fonksiyon
  const handleLogout = () => {
    // Kullanıcının oturumunu kapatma işlemleri burada gerçekleştirilir
    // Örneğin, oturum bilgilerini temizleme, kullanıcıyı çıkış sayfasına yönlendirme vb.

    // Oturum kapatma işlemi yapıldıktan sonra isAuthenticated değerini false yap
    AsyncStorage.clear();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('AccessToken');
        if (accessToken !== null) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error retrieving access token:', error);
      }
    };

    fetchData(); // API isteğini gönder

    const translatee= async () => {
      const ds = await translateApi();
      await AsyncStorage.setItem('translate', JSON.stringify(ds));
      // settranslate(ds);
  };
  translatee(); 
  }, []); // Boş bağımlılık dizisi, sadece bileşen yüklendiğinde çalışmasını sağlar
// Kullanıcının cihazının dil ve bölge bilgilerini alın
AsyncStorage.clear();
  return (
    <NavigationContainer>
      {isAuthenticated ? (<WordBook onLogout={handleLogout} />):

            (<Stack.Navigator>
            {/* isAuthenticated durumuna göre ilgili ekranı göster */}
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {(props) => <SignUpScreen />}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword">
                {(props) => <ForgotPasswordScreen />}
              </Stack.Screen>
              
            
          </Stack.Navigator>)
      }

    </NavigationContainer>
  );
}


export default App;
