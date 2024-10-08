import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import StudentInfo from "./StudentInfo";
import StudentLessonSections from "./StudentLessonSections";
import StudentTimetable from "./StudentTimetable";
import {resetStartToTargetScreen} from "../../utils/NavigationUtils";

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
    resetStartToTargetScreen(navigation, "StudentList");
  }, [route.params]);

  const load = () => {
    setLoading(true);
    setLoadingError(false);
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
        setLoadingError(true);
      });
  }

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="StudentInfo" options={{title: t("info")}}>
        {() => <StudentInfo studentInfo={studentInfo} />}
      </Tab.Screen>
      <Tab.Screen name="StudentLessons" options={{title: t("lessons")}}>
        {() => <StudentLessonSections lesson_sections={studentInfo.lesson_sections} navigation={navigation} route={route}/>}
      </Tab.Screen>
      <Tab.Screen name="Timetable" options={{title: t("timetable")}}>
        {() => <StudentTimetable lessonSections={studentInfo.lesson_sections} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default StudentDetail;
