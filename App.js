import {useTranslation} from "react-i18next";
import "intl-pluralrules";
import "./utils/i18n";
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
  const {t} = useTranslation();
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
                <Tab.Screen name="HomeIndex" component={HomeIndex} options={{title: t("home")}} />
                <Tab.Screen name="TeacherListIndex" component={TeacherListIndex} options={{title: t("teacherList")}} />
                <Tab.Screen name="LessonListIndex" component={LessonListIndex} options={{title: t("lessonList")}} />
                <Tab.Screen name="StudentsListIndex" component={StudentsListIndex} options={{title: t("studentList")}} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      }
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
