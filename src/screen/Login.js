import React, { useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BotmTab from '../Navigation/BotmTab';
import DashBord from './DashBord';
import messaging from '@react-native-firebase/messaging';


export default function LoginScreen() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    // Get the device token
    const getDeviceToken = async () => {
      const token = await messaging().getToken();
      console.log('Device FCM Token:>>>>>>>>', token);
    };

    getDeviceToken();

    // Listen to whether the token changes
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('FCM Token Refreshed:', token);
    });

    return unsubscribe; // Unsubscribe when the component unmounts
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password');
      return;
    }
  
    firestore()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          Alert.alert('User Not Found', 'No user found with the given email');
        } else {
          let userFound = false;
          querySnapshot.forEach(documentSnapshot => {
            const userData = documentSnapshot.data();
            if (userData.password === password) {
              userFound = true;
              console.log('User Data:', userData);
              saveUserDataAndNavigate(userData.email, userData.password, userData.userid);
              // Alert.alert('Login Successful', 'Welcome back!');
              
              // Navigate to the next screen or dashboard
              // navigation.navigate('Dashboard');
            }
          });
          if (!userFound) {
            Alert.alert('Incorrect Password', 'The password you entered is incorrect');
          }
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      });
  };
  const saveUserDataAndNavigate = async (email, password, userid) => {
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);
      await AsyncStorage.setItem('userId', userid);
      console.log('User data saved to AsyncStorage');
      navigation.navigate('BotmTab')
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
      Alert.alert('Error', 'Failed to save user data. Please try again later.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate('SignUp') }} style={styles.signupButton}>
          <Text>or Signup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    top: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
  },
  signupButton: {
    alignItems: 'center',
    marginTop: 50,
  },
});
