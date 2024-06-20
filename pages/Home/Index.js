import {useTranslation} from "react-i18next";
import {languages} from "../../utils/i18n";
import {Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Button from "../../components/Button";
import Modal from "react-native-modal";
import {useEffect, useState} from "react";
import backend, {setAxiosToken} from "../../utils/Backend";
import Timetable from "../../components/Timetable";
import {localStorage} from "../../utils/LocalStorage";
import {useActionSheet} from "@expo/react-native-action-sheet";
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import {Shadow} from "react-native-shadow-2";

const Index = (props) => {
  const {t, i18n} = useTranslation();
  const {showActionSheetWithOptions} = useActionSheet();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState("");

  const deviceHeight = StatusBar.currentHeight + Dimensions.get('window').height;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={styles.topBar}>
          <Shadow distance={5}>
            <TouchableOpacity onPress={showSettingsOptions} style={[styles.optionsButton, {backgroundColor: props.studentInfo.color || "white"}]}>
              <Text
                style={[styles.optionsText, {color: props.studentInfo.color ? (props.studentInfo.color.charAt(1).toLowerCase() > 'd' ? 'black' : 'white') : 'black'}]}
              >
                {props.studentInfo.name.slice(0, 1)+props.studentInfo.surname.slice(0, 1)}
              </Text>
            </TouchableOpacity>
          </Shadow>
        </View>
      ),
    });
  }, [i18n.language, props.studentInfo]);

  const changeProfileColor = (color) => {
    props.setStudentInfo({...props.studentInfo, color: color})
    const payload = {
      student_id: props.studentInfo.id,
      color: color,
    };
    backend.post("api/change-profile-color/", payload)
      .then(() => {
        props.setStudentInfo({...props.studentInfo, color: color});
      })
      .catch((error) => {
        console.error(error);
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

  const logOut = () => {
    localStorage.remove({key: 'studentId'}).then().catch((error) => console.error(error));
    localStorage.remove({key: 'token'})
      .then(() => {
        setAxiosToken("");
        props.navigation.reset({
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
      t("changeProfileColor"),
      t("changeLanguage"),
      t("logOut"),
    ];
    const cancelButtonIndex = options.length;
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          setColorPickerVisible(true);
          break;
        case 1:
          showLanguageOptions();
          break;
        case 2:
          logOut();
          break;
        default:
          break;
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

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getCurrentGreeting()} {props.studentInfo.name}!</Text>
      <Timetable lessonSections={props.studentInfo.lesson_sections} />
      <Modal
        isVisible={colorPickerVisible}
        onBackdropPress={() => setColorPickerVisible(false)}
        backdropOpacity={0.5}
        animationOutTiming={500}
        statusBarTranslucent={true}
        deviceHeight={deviceHeight}
      >
        <View style={styles.modal}>
          <ColorPicker value={props.studentInfo.color} onComplete={({hex}) => setColorPickerColor(hex)}>
            <Preview style={{marginVertical: 10}} />
            <Panel1 style={{marginVertical: 10}} thumbShape={"ring"} />
            <HueSlider style={{marginVertical: 10}} thumbSize={25} thumbShape={"pill"} />
          </ColorPicker>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Button title={t("cancel")} style={styles.modalButton} textStyle={{color: "black"}} onPress={() => {
              setColorPickerVisible(false);
            }} />
            <Button title={t("apply")} style={styles.modalButton} textStyle={{color: "black"}} onPress={() => {
              setColorPickerVisible(false);
              changeProfileColor(colorPickerColor);
            }} />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#9e9e9e',
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
  modal: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalButton: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#e1dede',
    borderColor: '#9e9e9e',
    borderWidth: 1.5,
  },
});

export default Index;
