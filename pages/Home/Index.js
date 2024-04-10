import {StyleSheet, Text, View} from "react-native";
import {Button} from "../../components/Components";
import {useEffect, useState} from "react";
import api from "../../utils/api";
import Storage from "react-native-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timetable from "./Timetable";
import Loading from "../../components/Loading";

const Index = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24
  });
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
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    storage.load({key: 'studentId'})
      .then((value) => {
        getStudentInfo(value);
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

  if (loading) return <Loading />

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
  logoutButton: {
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "black",
  },
});

export default Index;
