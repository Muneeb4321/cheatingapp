import { SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Login from './src/screen/Login';
import SignUp from './src/screen/SingUp';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashBord from './src/screen/DashBord';
import Setting from './src/screen/Setting';
import BotmTab from './src/Navigation/BotmTab';
import Message from './src/screen/Message';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* screenOptions={{ headerShown: false }} */}
    <Stack.Navigator >
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="SignUp" component={SignUp}/>
      <Stack.Screen name="DashBord" component={DashBord}/>
      <Stack.Screen name="Setting" component={Setting}/>
      <Stack.Screen name="BotmTab" component={BotmTab}/>
      <Stack.Screen name="Message" component={Message}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}


const styles = StyleSheet.create({})