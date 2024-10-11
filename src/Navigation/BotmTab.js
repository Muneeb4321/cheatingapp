import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashBord from '../screen/DashBord';
import Setting from '../screen/Setting';


const Tab = createBottomTabNavigator();
export default function BotmTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="DashBord" component={DashBord} />
    <Tab.Screen name="Setting" component={Setting} />
  </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})