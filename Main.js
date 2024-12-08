import {useTranslation} from "react-i18next";
import "intl-pluralrules";
import "./utils/i18n";
import {useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import LoginIndex from './pages/Login/Index';
import HomeIndex from './pages/Home/Index';
import PostsIndex from './pages/Forums/Index';
import TeachersIndex from './pages/Teachers/Index';
import LessonsIndex from './pages/Lessons/Index';
import StudentsIndex from './pages/Students/Index';
import {CommonActions, NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import {localStorage} from "./utils/LocalStorage";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import backend from "./utils/Backend";
import Loading from "./components/Loading";
import {useTheme} from "./utils/Theme";
import {Image, StyleSheet, View} from 'react-native';
import etupediaIcon from "./assets/etupedia.png";
import {Player} from '@lordicon/react';

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

  const homeIconRef = useRef();
  const forumIconRef = useRef();
  const teachersIconRef = useRef();
  const lessonsIconRef = useRef();
  const studentsIconRef = useRef();

  const HOME_ICON = require("./assets/lordicon_animations/wired-outline-63-home-hover-partial-roll.json");
  const FORUM_ICON = require("./assets/lordicon_animations/wired-outline-143-paperplane-send-hover-wave.json");
  const TEACHERS_ICON = require("./assets/lordicon_animations/wired-outline-688-speaker-lecturer-male-hover-pinch.json");
  const LESSONS_ICON = require("./assets/lordicon_animations/wired-outline-779-books-hover-hit.json");
  const STUDENTS_ICON = require("./assets/lordicon_animations/wired-outline-406-study-graduation-hover-pinch.json");

  const Stack = createNativeStackNavigator();
  const Tab = AnimatedTabBarNavigator();

  const screenOptions = useMemo(() => ({
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderColor: "transparent",
      paddingBottom: 10,
      paddingTop: 10,
      height: 70
    },
    tabBarIndicatorStyle: {backgroundColor: theme.colors.primary},
    headerStyle: {backgroundColor: theme.colors.background},
    headerShadowVisible: false,
    headerTintColor: theme.colors.primaryText,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.secondaryText,
    contentStyle: {backgroundColor: theme.colors.background},
    cardStyle: {backgroundColor: theme.colors.background},
    animation: 'fade_from_bottom',
  }), [theme]);

  const tabBarOptions = useMemo(() => ({
    activeTintColor: theme.colors.primaryText,
    inactiveTintColor: theme.colors.secondaryText,
    activeBackgroundColor: theme.colors.surface,
    tabStyle: {
      backgroundColor: theme.colors.surface,
    },
  }), [theme]);

  const getStudentInfo = (studentId, navigation) => {
    setLoadingError(false);
    const payload = {
      student_id: studentId,
    };
    backend.post("api/get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
        if (navigation) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: "Home"}],
            })
          );
        }
        else {
          setInitialRouteName("Home");
        }
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

  const load = () => {
    localStorage.load({key: 'studentId'})
      .then((value) => {
        getStudentInfo(value, null);
      })
      .catch(() => {
        setInitialRouteName("LoginIndex");
      });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {initialRouteName?
          <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{headerShown: false, ...screenOptions}}>
            <Stack.Screen name="LoginIndex">
              {(props) => <LoginIndex {...props} getStudentInfo={getStudentInfo}/>}
            </Stack.Screen>
            <Stack.Screen name="Home">
              {() => (
                <Tab.Navigator initialRouteName="HomeIndex" screenOptions={screenOptions} tabBarOptions={tabBarOptions} appearance={{floating: true}}>
                  <Tab.Screen name="HomeIndex"
                              options={{
                                title: t("home"), headerShown: false, tabBarIcon: ({color, size}) => (
                                    <View style={[styles.navbarIconContainer, {backgroundColor: theme.colors.surface}]}>
                                      <Player icon={HOME_ICON} size={size*1.5} ref={homeIconRef}
                                              colors={`primary:${theme.colors.primaryText},secondary:${theme.colors.accent}`}
                                      />
                                    </View>
                                )
                              }}
                  >
                    {(props) => <HomeIndex {...props}
                                           screenOptions={screenOptions}
                                           studentInfo={studentInfo}
                                           setStudentInfo={setStudentInfo}
                                           colorScheme={colorScheme}
                                           setColorScheme={setColorScheme}
                                           iconRef={homeIconRef}
                    />}
                  </Tab.Screen>
                  <Tab.Screen name="ForumIndex"
                              options={{
                                title: t("forums"), headerShown: false, tabBarIcon: ({color, size}) => (
                                    <View style={[styles.navbarIconContainer, {backgroundColor: theme.colors.surface}]}>
                                      <Player icon={FORUM_ICON} size={size*1.5} ref={forumIconRef}
                                              colors={`primary:${theme.colors.primaryText},secondary:${theme.colors.accent}`}
                                      />
                                    </View>
                                )
                              }}
                  >
                    {(props) => <PostsIndex {...props} screenOptions={screenOptions} iconRef={forumIconRef} />}
                  </Tab.Screen>
                  <Tab.Screen name="TeacherListIndex"
                              options={{
                                title: t("teachers"), headerShown: false, tabBarIcon: ({color, size}) => (
                                    <View style={[styles.navbarIconContainer, {backgroundColor: theme.colors.surface}]}>
                                      <Player icon={TEACHERS_ICON} size={size*1.5} ref={teachersIconRef}
                                              colors={`primary:${theme.colors.primaryText},secondary:${theme.colors.accent}`}
                                      />
                                    </View>
                                )
                              }}
                  >
                    {(props) => <TeachersIndex {...props} screenOptions={screenOptions} iconRef={teachersIconRef} />}
                  </Tab.Screen>
                  <Tab.Screen name="LessonListIndex"
                              options={{
                                title: t("lessons"), headerShown: false, tabBarIcon: ({color, size}) => (
                                    <View style={[styles.navbarIconContainer, {backgroundColor: theme.colors.surface}]}>
                                      <Player icon={LESSONS_ICON} size={size*1.5} ref={lessonsIconRef}
                                              colors={`primary:${theme.colors.primaryText},secondary:${theme.colors.accent}`}
                                      />
                                    </View>
                                )
                              }}
                  >
                    {(props) => <LessonsIndex {...props} screenOptions={screenOptions} iconRef={lessonsIconRef} />}
                  </Tab.Screen>
                  <Tab.Screen name="StudentListIndex"
                              options={{
                                title: t("students"), headerShown: false, tabBarIcon: ({color, size}) => (
                                    <View style={[styles.navbarIconContainer, {backgroundColor: theme.colors.surface}]}>
                                      <Player icon={STUDENTS_ICON} size={size*1.5} ref={studentsIconRef}
                                              colors={`primary:${theme.colors.primaryText},secondary:${theme.colors.accent}`}
                                      />
                                    </View>
                                )
                              }}
                  >
                    {(props) => <StudentsIndex {...props} screenOptions={screenOptions} iconRef={studentsIconRef} />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        :
          <Loading loadingError={loadingError} onRetry={load}
                   topElement={<Image source={etupediaIcon} style={styles.image} />}
                   activeOpacity={0.97} />
        }
        <ExpoStatusBar style={theme.dark ? "light" : "dark"} />
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
  navbarIconContainer: {
    borderRadius: 100,
    padding: 4,
    marginVertical: -4,
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
