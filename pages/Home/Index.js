import {useTranslation} from "react-i18next";
import {StyleSheet, Text, View} from "react-native";
import {Button} from "../../components/Components";
import {useEffect, useState} from "react";
import api from "../../utils/api";
import Storage from "react-native-storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timetable from "./Timetable";
import Loading from "../../components/Loading";

const Index = ({navigation}) => {
  const {t, i18n} = useTranslation();
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
    api.post("api/get-student-info/", payload)
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
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title={i18n.language.toUpperCase()} onPress={changeLanguage} style={styles.logoutButton} textStyle={styles.logoutText} />
          <Button title={t("logOut")} onPress={logout} style={styles.logoutButton} textStyle={styles.logoutText} />
        </View>
      ),
    });
  }, []);

  const logout = () => {
    storage.remove({key: 'studentId'}).then().catch((error) => console.error(error));
    storage.remove({key: 'token'})
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

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "tr" : "en").then(r => {});
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{display: "flex", flexDirection: "row"}}>
          <Button title={i18n.language.toUpperCase()} onPress={changeLanguage} style={styles.logoutButton} textStyle={styles.logoutText} />
          <Button title={t("logOut")} onPress={logout} style={styles.logoutButton} textStyle={styles.logoutText} />
        </View>
      ),
    });
  }, [i18n.language]);

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <Text>{t("studentID")}: {studentInfo.id}</Text>
      <Text>{t("hello")}, {studentInfo.name} {studentInfo.surname}</Text>
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
  logoutButton: {
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "black",
  },
});

export default Index;
