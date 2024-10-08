import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import LessonInfo from "./LessonInfo";
import LessonSections from "./LessonSections";
import LessonStudents from "./LessonStudents";
import LessonTimetable from './LessonTimetable';
import {resetStartToTargetScreen} from "../../utils/NavigationUtils";

const LessonDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lessonInfo, setLessonInfo] = useState({
    lesson_code: "",
    lesson_name: "",
    lesson_section_count: "",
    student_count: "",
    students: [
      {
        id: "",
        name: "",
        surname: "",
        color: "",
        lesson_section_number: "",
      }
    ],
  });
  const [lessonSections, setLessonSections] = useState([
    {
      lesson_code: "",
      lesson_name: "",
      lesson_section_number: "",
      lesson_section_teacher: "",
      color: "",
      classrooms_and_times: [{
        classroom: "",
        time: "",
      }],
    }
  ]);
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
    resetStartToTargetScreen(navigation, "LessonList");
  }, [route.params]);

  const load = () => {
    setLoading(true);
    setLoadingError(false);
    navigation.setOptions({title: `${route.params.lessonCode} ${route.params.lessonName}`});

    const payload = {
      lesson_code: route.params.lessonCode,
    };
    Promise.all([
      backend.post("api/get-lesson-info/", payload),
      backend.post("api/get-sections-of-lesson/", payload)
    ]).then(([lessonInfoResponse, lessonSectionsResponse]) => {
      setLessonInfo(lessonInfoResponse.data);
      setLessonSections(lessonSectionsResponse.data);
      setLoading(false);
    }).catch((error) => {
      console.error(error);
      setLoadingError(true);
    });
  }

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="LessonInfo" options={{title: t("info")}}>
        {() => <LessonInfo lessonInfo={lessonInfo} />}
      </Tab.Screen>
      <Tab.Screen name="LessonSections" options={{title: t("sections")}}>
        {() => <LessonSections lessonSections={lessonSections} lessonInfo={lessonInfo} navigation={navigation}/>}
      </Tab.Screen>
      <Tab.Screen name="LessonStudents" options={{title: t("students")}}>
        {() => <LessonStudents lessonSections={lessonSections} students={lessonInfo.students} navigation={navigation} route={route}/>}
      </Tab.Screen>
      <Tab.Screen name="Timetable" options={{title: t("timetable")}}>
        {() => <LessonTimetable lessonSections={lessonSections} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default LessonDetail;
