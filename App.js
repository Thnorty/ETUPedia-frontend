import {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, } from 'react-native';
import LoginIndex from './pages/Login/Index';
import MainIndex from './pages/Main/Index';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const [initialRouteName, setInitialRouteName] = useState("");

  AsyncStorage.getItem('studentId')
    .then((value) => {
      if (value !== null)
        setInitialRouteName("MainIndex");
      else
        setInitialRouteName("LoginIndex");
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <NavigationContainer>
      {initialRouteName &&
        <Stack.Navigator initialRouteName={initialRouteName}>
          <Stack.Screen name="LoginIndex" component={LoginIndex}/>
          <Stack.Screen name="MainIndex" component={MainIndex}/>
        </Stack.Navigator>
      }
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
