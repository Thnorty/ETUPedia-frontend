import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import StudentInfo from "./StudentInfo";
import StudentLessonSections from "./StudentLessonSections";
import StudentTimetable from "./StudentTimetable";
import {resetStartToTargetScreen} from "../../utils/NavigationUtils";
import HeaderButton from '../../components/HeaderButton';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faStar as faStarSolid} from "@fortawesome/free-solid-svg-icons";
import {faStar as faStarRegular} from "@fortawesome/free-regular-svg-icons";

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
    is_favorite: false,
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
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          onPress={toggleFavorite}
          icon={
            <FontAwesomeIcon
              icon={studentInfo.is_favorite ? faStarSolid : faStarRegular}
              size={24}
              color={studentInfo.is_favorite ? "#FFD700" : "#808080"}
            />
          }
        />
      ),
    });
  }, [route.params, navigation, t, studentInfo.is_favorite]);

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

  const toggleFavorite = () => {
    const endpoint = studentInfo.is_favorite ? "api/remove-favorite-student/" : "api/favorite-student/";
    const payload = {
      student_id: route.params.studentId,
    };

    backend.post(endpoint, payload)
      .then(() => {
        setStudentInfo((prev) => {
          return {
            ...prev,
            is_favorite: !prev.is_favorite,
          };
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
