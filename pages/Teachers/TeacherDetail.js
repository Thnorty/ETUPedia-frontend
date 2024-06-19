import {View, Text, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Timetable from "../../components/Timetable";
import Loading from "../../components/Loading";
import {useTranslation} from "react-i18next";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import TeacherTimetable from "./TeacherTimetable";
import TeacherLessonSections from "./TeacherLessonSections";
import TeacherInfo from "./TeacherInfo";

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

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    setLoading(true);
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
      });
  }, [route.params.teacherName]);

  if (loading) return <Loading />

  return (
    <Tab.Navigator>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TeacherDetail;
