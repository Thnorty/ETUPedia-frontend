import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LessonInfo from "./LessonInfo";
import LessonStudents from "./LessonStudents";
import backend from "../../utils/backend";
import Loading from "../../components/Loading";
import LessonStudentNavigator from "./LessonStudents";

const LessonDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lessonInfo, setLessonInfo] = useState({
    lesson_code: "",
    lesson_name: "",
    student_count: "",
    students: [
      {
        id: "",
        name: "",
        surname: "",
      }
    ],
  });

  const Tab = createMaterialTopTabNavigator();

  useEffect(() => {
    navigation.setOptions({title: `${route.params.lessonCode} ${route.params.lessonName}`});

    const payload = {
      lesson_code: route.params.lessonCode,
    };
    backend.post("api/get-lesson-info/", payload)
      .then((response) => {
        setLessonInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (loading) return <Loading />

  return (
    <Tab.Navigator>
      <Tab.Screen name="LessonInfo" options={{title: t("info")}}>
        {() => <LessonInfo studentCount={lessonInfo.student_count} />}
      </Tab.Screen>
      <Tab.Screen name="LessonStudents" options={{title: t("students")}}>
        {() => <LessonStudentNavigator students={lessonInfo.students} navigation={navigation} route={route}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default LessonDetail;
