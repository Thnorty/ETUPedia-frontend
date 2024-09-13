import {View, Text, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {useTranslation} from "react-i18next";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import TeacherTimetable from "./TeacherTimetable";
import TeacherLessonSections from "./TeacherLessonSections";
import TeacherInfo from "./TeacherInfo";
import {resetStartToTargetScreen} from "../../utils/NavigationUtils";

const TeacherDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({
    name: "",
    lesson_sections: [{
      lesson_code: "",
      lesson_name: "",
      lesson_section_number: "",
      color: "",
      classrooms_and_times: [{
        classroom: "",
        time: "",
      }],
    }],
  });
  const [loadingError, setLoadingError] = useState(false);

  const screenOptions = {
    ...route.params.screenOptions,
    tabBarStyle: {
      ...route.params.screenOptions.tabBarStyle,
      paddingBottom: undefined,
      paddingTop: undefined,
      height: undefined,
    },
  }

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    load();
    resetStartToTargetScreen(navigation, "TeacherList");
  }, [route.params]);

  const load = () => {
    setLoading(true);
    setLoadingError(false);
    navigation.setOptions({title: route.params.teacherName});

    const payload = {
      teacher_name: route.params.teacherName,
    };
    backend.post("api/get-teacher-info/", payload)
      .then((response) => {
        setTeacherInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingError(true);
      });
  }

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="TeacherInfo" options={{title: t("info")}}>
        {() => <TeacherInfo teacherInfo={teacherInfo} />}
      </Tab.Screen>
      <Tab.Screen name="TeacherLessons" options={{title: t("lessons")}}>
        {() => <TeacherLessonSections lesson_sections={teacherInfo.lesson_sections} navigation={navigation} route={route}/>}
      </Tab.Screen>
      <Tab.Screen name="TimeTable" options={{title: t("timetable")}}>
        {() => <TeacherTimetable lessonSections={teacherInfo.lesson_sections} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default TeacherDetail;
