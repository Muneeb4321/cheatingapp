import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat, Actions, Send } from 'react-native-gifted-chat';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function Message() {
  const route = useRoute();
  const userId = route.params.id;
  const recipientId = route.params.data.userid;

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(`${userId}_${recipientId}`)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: firebaseData.text,
            createdAt: firebaseData.createdAt.toDate ? firebaseData.createdAt.toDate() : new Date(),
            user: {
              _id: firebaseData.user?._id || 'unknown',
              name: firebaseData.user?.name || 'Unknown',
              // avatar field removed
            },
            image: firebaseData.image || null,
          };

          return data;
        });

        setMessages(allMessages);
      });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      _id: firestore().collection('chats').doc().id,
      text: msg.text,
      user: {
        _id: userId,
        name: 'My Name',
        // avatar field removed
      },
      sendBy: userId,
      sendTo: recipientId,
      createdAt: new Date(),
      image: msg.image || null,
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

    firestore()
      .collection('chats')
      .doc(`${userId}_${recipientId}`)
      .collection('messages')
      .add(myMsg);

    firestore()
      .collection('chats')
      .doc(`${recipientId}_${userId}`)
      .collection('messages')
      .add(myMsg);
  }, []);

  const uploadImage = async (uri) => {
    if (!uri) return null;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = uri.replace('file://', '');
    const storageRef = storage().ref(`images/${filename}`);
    const task = storageRef.putFile(uploadUri);

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({}, async response => {
      if (response.didCancel || response.error) {
        console.log('User cancelled image picker');
      } else {
        const { uri } = response.assets[0];
        const imageUrl = await uploadImage(uri);
        if (imageUrl) {
          const newMessage = {
            _id: firestore().collection('chats').doc().id,
            text: '',
            user: {
              _id: userId,
              name: 'My Name',
              // avatar field removed
            },
            sendBy: userId,
            sendTo: recipientId,
            createdAt: new Date(),
            image: imageUrl,
          };
          onSend([newMessage]);
        }
      }
    });
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      options={{
        ['Choose From Library']: handleImagePick,
      }}
      icon={() => (
        <View style={{ padding: 5 }}>
          <Text style={{ color: 'blue' }}>+</Text>
        </View>
      )}
      onSend={args => console.log(args)}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Text style={{ color: 'blue', fontSize: 16 }}>Send</Text>
      </View>
    </Send>
  );

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: userId,
        }}
        renderActions={renderActions}
        renderSend={renderSend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
});
