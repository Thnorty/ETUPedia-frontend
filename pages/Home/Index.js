import {useTranslation} from "react-i18next";
import {languages} from "../../utils/i18n";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useEffect, useState} from "react";
import backend, {setAxiosToken} from "../../utils/Backend";
import Timetable from "../../components/Timetable";
import Loading from "../../components/Loading";
import {localStorage} from "../../utils/LocalStorage";
import {useActionSheet} from "@expo/react-native-action-sheet";

const Index = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();
  const [loading, setLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState({
    id: "",
    name: "",
    surname: "",
    department: "",
    mail: "",
    year: "",
    color: "",
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
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        loading ? null :
        <View style={styles.topBar}>
          <TouchableOpacity onPress={showSettingsOptions} style={[styles.optionsButton, {backgroundColor: studentInfo.color}]}>
            <Text style={styles.optionsText}>{studentInfo.name.slice(0, 1)+studentInfo.surname.slice(0, 1)}</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [i18n.language, studentInfo, loading]);

  const logOut = () => {
    localStorage.remove({key: 'studentId'}).then().catch((error) => console.error(error));
    localStorage.remove({key: 'token'})
      .then(() => {
        setAxiosToken("");
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginIndex' }],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const showSettingsOptions = () => {
    const options = [
      t("changeLanguage"),
      t("logOut"),
    ];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          showLanguageOptions();
          break;
        case 1:
          logOut();
          break;
        default:
          break;
      }
    });
  }

  const showLanguageOptions = () => {
    const options = languages.map(language => t(language.code));
    const cancelButtonIndex = languages.length;
    const title = t("selectLanguage");
    const disabledButtonIndices = [languages.findIndex(lang => lang.code === i18n.language)];
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      title,
      disabledButtonIndices,
    }, (buttonIndex) => {
      if (buttonIndex !== cancelButtonIndex) {
        i18n.changeLanguage(languages[buttonIndex].code).then().catch(e => console.error(e));
        localStorage.save({
          key: 'language',
          data: languages[buttonIndex].code,
        }).then().catch(e => console.error(e));
      }
    });
  }

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
  topBar: {
    display: "flex",
    flexDirection: "row",
    paddingRight: 10,
    alignItems: "center",
  },
  optionsButton: {
    borderRadius: 100,
    backgroundColor: '#fba023',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#9e9e9e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    width: 40,
    height: 40,
  },
  optionsText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  greeting: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default Index;
