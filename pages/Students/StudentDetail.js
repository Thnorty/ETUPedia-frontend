import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import StudentInfo from "./StudentInfo";
import StudentLessonSections from "./StudentLessonSections";
import StudentTimetable from "./StudentTimetable";

const StudentDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    name: "",
    surname: "",
    department: "",
    mail: "",
    year: "",
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
    navigation.setOptions({title: route.params.studentName});

    const payload = {
      student_id: route.params.studentId,
    };
    backend.post("api/get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [route.params.studentId, route.params.studentName]);

  if (loading) return <Loading />

  return (
    <Tab.Navigator>
      <Tab.Screen name="StudentInfo" options={{title: t("info")}}>
        {() => <StudentInfo studentInfo={studentInfo} />}
      </Tab.Screen>
      <Tab.Screen name="StudentLessons" options={{title: t("lessons")}}>
        {() => <StudentLessonSections lesson_sections={studentInfo.lesson_sections} navigation={navigation} route={route}/>}
      </Tab.Screen>
      <Tab.Screen name="TimeTable" options={{title: t("timetable")}}>
        {() => <StudentTimetable lessonSections={studentInfo.lesson_sections} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default StudentDetail;
