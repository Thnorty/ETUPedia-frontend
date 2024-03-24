import {View, Text, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import api from "../../utils/api";
import Timetable from "../Home/Timetable";
import Loading from "../../components/Loading";

const StudentDetail = ({navigation, route}) => {
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
      const payload = {
        student_id: route.params.studentId,
      };
      api.post("get-student-info/", payload)
        .then((response) => {
          setStudentInfo(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <View style={styles.container}>
      <Text>Student ID: {studentInfo.id}</Text>
      <Text>Hello, {studentInfo.name} {studentInfo.surname}</Text>
      <Text>Department: {studentInfo.department}</Text>
      <Text>Mail: {studentInfo.mail}</Text>
      <Text>Year: {studentInfo.year}</Text>
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
