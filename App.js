import {useState} from "react";
import {StatusBar} from 'expo-status-bar';
import {StyleSheet} from 'react-native';
import LoginIndex from './pages/Login/Index';
import HomeIndex from './pages/Home/Index';
import StudentsListIndex from './pages/StudentList/Index';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [initialRouteName, setInitialRouteName] = useState("");

  AsyncStorage.getItem('studentId')
    .then((value) => {
      if (value !== null)
        setInitialRouteName("HomeIndex");
      else
        setInitialRouteName("LoginIndex");
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <NavigationContainer>
      {initialRouteName &&
        <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginIndex" component={LoginIndex} />
          <Stack.Screen name="Home">
            {() => (
              <Tab.Navigator initialRouteName="HomeIndex">
                <Tab.Screen name="HomeIndex" component={HomeIndex} />
                <Tab.Screen name="StudentsListIndex" component={StudentsListIndex} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      }
      <StatusBar style="dark" />
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
