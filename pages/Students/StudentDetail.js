import {useTranslation} from "react-i18next";
import {View, Text, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Timetable from "../Home/Timetable";
import Loading from "../../components/Loading";

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
      classrooms_and_times: [{
        classroom: "",
        time: "",
      }],
    }],
  });

  useEffect(() => {
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
  }, []);

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <Text>{t("studentID")}: {studentInfo.id}</Text>
      <Text>{studentInfo.name} {studentInfo.surname}</Text>
      <Text>{t("department")}: {studentInfo.department}</Text>
      <Text>{t("email")}: {studentInfo.mail}</Text>
      <Text>{t("year")}: {studentInfo.year}</Text>
      <Timetable lessonSections={studentInfo.lesson_sections} />
    </View>
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

export default StudentDetail;
