import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Message from './Message';

export default function Dashboard() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  // const id =  AsyncStorage.getItem('userId');
  // console.log('id',id)

  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        id = await AsyncStorage.getItem('userId');
        console.log('id',id)
        // Retrieve current user email from AsyncStorage
        const userEmail = await AsyncStorage.getItem('userEmail');
        setCurrentUserEmail(userEmail);

        // Retrieve user data from Firestore
        const userDataRef = await firestore().collection('users').get();
        const userDataArray = userDataRef.docs.map(doc => doc.data());

        // Filter out the current user's data
        const filteredUserData = userDataArray.filter(user => user.email !== userEmail);

        setUserData(filteredUserData);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    retrieveUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chating App</Text>
      <FlatList
        data={userData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=> navigation.navigate('Message',{data: item, id:id})} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            {/* <Text style={styles.itemText}>Phone: {item.mobile}</Text> */}
       
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    paddingVertical: 10, // Added padding to increase height
    borderColor: 'rgba(0, 0, 0, 0.1)', // Faded border color
    borderBottomWidth: 1, // Faded border thickness
    color:'purple'
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
