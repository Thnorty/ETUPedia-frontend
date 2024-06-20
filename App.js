import {useTranslation} from "react-i18next";
import "intl-pluralrules";
import "./utils/i18n";
import {useEffect, useState} from "react";
import {StatusBar} from 'expo-status-bar';
import LoginIndex from './pages/Login/Index';
import HomeIndex from './pages/Home/Index';
import PostsIndex from './pages/Posts/Index';
import TeachersIndex from './pages/Teachers/Index';
import LessonsIndex from './pages/Lessons/Index';
import StudentsIndex from './pages/Students/Index';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/FontAwesome";
import {localStorage} from "./utils/LocalStorage";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import backend from "./utils/Backend";
import Loading from "./components/Loading";

export default function App() {
  const {t} = useTranslation();
  const [initialRouteName, setInitialRouteName] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    name: "",
    surname: "",
    department: "",
    mail: "",
    year: "",
    color: "",
    lesson_sections: [{
      lesson_code: "",
      lesson_name: "",
      lesson_section_number: "",
      classrooms_and_times: [{
        classroom: "",
        time: "",
      }],
    }],
  });
  const [loading, setLoading] = useState(true);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const getStudentInfo = (studentId, navigation) => {
    const payload = {
      student_id: studentId,
    };
    backend.post("api/get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
        setLoading(false);
        if (navigation)
          navigation.navigate("Home");
        else
          setInitialRouteName("Home");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.remove({key: 'studentId'})
            .then(() => {
              setInitialRouteName("LoginIndex")
            })
            .catch((error) => {
              console.error(error);
            });
        }
        console.error(error);
      });
  };

  useEffect(() => {
    localStorage.load({key: 'studentId'})
      .then((value) => {
        getStudentInfo(value, null);
      })
      .catch((error) => {
        setInitialRouteName("LoginIndex");
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {initialRouteName &&
          <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false}}>
            <Stack.Screen name="LoginIndex">
              {(props) => <LoginIndex {...props} getStudentInfo={getStudentInfo} />}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {() => (
                <Tab.Navigator initialRouteName="HomeIndex">
                  <Tab.Screen name="HomeIndex"
                    options={{title: t("home"), tabBarIcon: ({color, size}) => (
                      <Icon name="home" color={color} size={size} />
                    )}}
                  >
                    {(props) => <HomeIndex {...props} studentInfo={studentInfo} setStudentInfo={setStudentInfo} />}
                  </Tab.Screen>
                  <Tab.Screen name="PostListIndex" component={PostsIndex}
                    options={{title: t("posts"), tabBarIcon: ({color, size}) => (
                      <Icon name="list" color={color} size={size} />
                    )}} />
                  <Tab.Screen name="TeacherListIndex" component={TeachersIndex}
                    options={{title: t("teachers"), headerShown: false, tabBarIcon: ({color, size}) => (
                      <Icon name="user" color={color} size={size} />
                    )}} />
                  <Tab.Screen name="LessonListIndex" component={LessonsIndex}
                    options={{title: t("lessons"), headerShown: false, tabBarIcon: ({color, size}) => (
                      <Icon name="book" color={color} size={size} />
                    )}} />
                  <Tab.Screen name="StudentsListIndex" component={StudentsIndex}
                    options={{title: t("students"), headerShown: false, tabBarIcon: ({color, size}) => (
                      <Icon name="users" color={color} size={size} />
                    )}} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        }
        <StatusBar style="dark" />
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
