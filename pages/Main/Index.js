import {StyleSheet, Text, View} from "react-native";
import {Button} from "../../components/Components";
import {useEffect, useState} from "react";
import api from "../../utils/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timetable from "./Timetable";

const Index = ({navigation}) => {
  const [studentId, setStudentId] = useState("");

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

  const getStudentInfo = (studentId) => {
    const payload = {
      student_id: studentId,
    };
    api.post("get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    AsyncStorage.getItem('studentId')
      .then((value) => {
        if (value !== null) {
          setStudentId(value);
          getStudentInfo(value);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    navigation.setOptions({
      headerRight: () => (
        <Button title="Log Out" onPress={logout} style={styles.logoutButton} textStyle={styles.logoutText} />
      ),
    });
  }, []);

  const logout = () => {
    AsyncStorage.removeItem('studentId')
      .then(() => {
        setStudentId("");
        setStudentInfo({
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginIndex' }],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text>Student ID: {studentId}</Text>
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
  logoutButton: {
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "black",
  },
});

export default Index;
