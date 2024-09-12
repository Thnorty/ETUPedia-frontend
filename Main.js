import {useTranslation} from "react-i18next";
import "intl-pluralrules";
import "./utils/i18n";
import {useEffect, useState} from "react";
import {StatusBar} from 'expo-status-bar';
import LoginIndex from './pages/Login/Index';
import HomeIndex from './pages/Home/Index';
import PostsIndex from './pages/Forums/Index';
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
import {useTheme} from "./utils/Theme";
import {Image, StyleSheet} from "react-native";
import etupediaIcon from "./assets/etupedia.png";

const Main = ({colorScheme, setColorScheme}) => {
  const {t} = useTranslation();
  const theme = useTheme();
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
  const [loadingError, setLoadingError] = useState(false);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const screenOptions = {
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderColor: "transparent",
      paddingBottom: 10,
      paddingTop: 10,
      height: 70
    },
    headerStyle: {backgroundColor: theme.colors.background},
    headerShadowVisible: false,
    headerTintColor: theme.colors.primaryText,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.secondaryText,
    contentStyle: {backgroundColor: theme.colors.background},
    animation: 'fade_from_bottom',
  };

  const getStudentInfo = (studentId, navigation) => {
    setLoadingError(false);
    const payload = {
      student_id: studentId,
    };
    backend.post("api/get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
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
        setLoadingError(true);
        console.error(error);
      });
  };

  useEffect(() => {
    localStorage.load({key: 'studentId'})
      .then((value) => {
        getStudentInfo(value, null);
      })
      .catch(() => {
        setInitialRouteName("LoginIndex");
      });
  }, []);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {initialRouteName ?
          <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false, ...screenOptions}}>
            <Stack.Screen name="LoginIndex">
              {(props) => <LoginIndex {...props} getStudentInfo={getStudentInfo} />}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {() => (
                <Tab.Navigator initialRouteName="HomeIndex" screenOptions={screenOptions}>
                  <Tab.Screen name="HomeIndex"
                              options={{title: t("home"), tabBarIcon: ({color, size}) => (
                                  <Icon name="home" color={color} size={size} />
                                )}}
                  >
                    {(props) => <HomeIndex {...props}
                                           studentInfo={studentInfo}
                                           setStudentInfo={setStudentInfo}
                                           colorScheme={colorScheme}
                                           setColorScheme={setColorScheme}
                    />}
                  </Tab.Screen>
                  <Tab.Screen name="ForumIndex"
                              options={{title: t("forums"), headerShown: false, tabBarIcon: ({color, size}) => (
                                  <Icon name="list" color={color} size={size} />
                                )}}
                  >
                    {(props) => <PostsIndex {...props} screenOptions={screenOptions} />}
                  </Tab.Screen>
                  <Tab.Screen name="TeacherListIndex"
                              options={{title: t("teachers"), headerShown: false, tabBarIcon: ({color, size}) => (
                                  <Icon name="user" color={color} size={size} />
                                )}}
                  >
                    {(props) => <TeachersIndex {...props} screenOptions={screenOptions} />}
                  </Tab.Screen>
                  <Tab.Screen name="LessonListIndex"
                              options={{title: t("lessons"), headerShown: false, tabBarIcon: ({color, size}) => (
                                  <Icon name="book" color={color} size={size} />
                                )}}
                  >
                    {(props) => <LessonsIndex {...props} screenOptions={screenOptions} />}
                  </Tab.Screen>
                  <Tab.Screen name="StudentListIndex"
                              options={{title: t("students"), headerShown: false, tabBarIcon: ({color, size}) => (
                                  <Icon name="users" color={color} size={size} />
                                )}}
                  >
                    {(props) => <StudentsIndex {...props} screenOptions={screenOptions} />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        :
            <Loading loadingError={loadingError} onRetry={() => getStudentInfo(localStorage.load({key: 'studentId'}))}
                     topElement={<Image source={etupediaIcon} style={styles.image} />}
            />
        }
        <StatusBar style={theme.dark ? "light" : "dark"} />
      </NavigationContainer>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 40,
    borderRadius: 16,
    position: "absolute",
    top: "25%",
  },
});

export default Main;
