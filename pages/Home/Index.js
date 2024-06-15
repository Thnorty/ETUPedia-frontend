import {useTranslation} from "react-i18next";
import {StyleSheet, Text, View} from "react-native";
import {Button} from "../../components/Components";
import {useEffect, useState} from "react";
import backend, {setAxiosToken} from "../../utils/Backend";
import Timetable from "../../components/Timetable";
import Loading from "../../components/Loading";
import {localStorage} from "../../utils/LocalStorage";

const Index = ({navigation}) => {
  const {t, i18n} = useTranslation();
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

  const getStudentInfo = (studentId) => {
    const payload = {
      student_id: studentId,
    };
    backend.post("api/get-student-info/", payload)
      .then((response) => {
        setStudentInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    localStorage.load({key: 'studentId'})
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
    localStorage.remove({key: 'studentId'}).then().catch((error) => console.error(error));
    localStorage.remove({key: 'token'})
      .then(() => {
        setAxiosToken("");
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
    i18n.changeLanguage(i18n.language === "en" ? "tr" : "en").then(() => {}).catch((error) => console.error(error));
    localStorage.save({key: 'language', data: i18n.language}).then().catch((error) => console.error(error));
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

  const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 23 || currentHour < 5) return t("goodNight");
    if (currentHour < 12) return t("goodMorning");
    if (currentHour < 18) return t("goodAfternoon");
    return t("goodEvening");
  }

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getCurrentGreeting()} {studentInfo.name}!</Text>
      <Timetable lessonSections={studentInfo.lesson_sections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoutButton: {
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "black",
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default Index;
