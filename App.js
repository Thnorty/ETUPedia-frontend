import {useState} from "react";
import {StatusBar} from 'expo-status-bar';
import LoginIndex from './pages/Login/Index';
import HomeIndex from './pages/Home/Index';
import TeacherListIndex from './pages/TeacherList/Index';
import LessonListIndex from './pages/LessonList/Index';
import StudentsListIndex from './pages/StudentList/Index';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Storage from "react-native-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const [initialRouteName, setInitialRouteName] = useState("");
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24
  });

  storage.load({key: 'studentId'})
    .then(() => {
      setInitialRouteName("Home");
    })
    .catch(() => {
      setInitialRouteName("LoginIndex");
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
                <Tab.Screen name="TeacherListIndex" component={TeacherListIndex} />
                <Tab.Screen name="LessonListIndex" component={LessonListIndex} />
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
