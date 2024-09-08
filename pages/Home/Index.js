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
import {useTheme} from "../../utils/Theme";
import ProfileIcon from "../../components/ProfileIcon";

const Index = (props) => {
  const {t, i18n} = useTranslation();
  const theme = useTheme();
  const {showActionSheetWithOptions} = useActionSheet();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState("");

  const deviceHeight = StatusBar.currentHeight + Dimensions.get('window').height;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <View style={[styles.topBar]}>
          <ProfileIcon user={props.studentInfo} onPress={showSettingsOptions} size={40} fontSize={14} style={styles.profileIcon} />
        </View>
      ),
    });
  }, [theme, i18n.language, props.studentInfo]);

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

  const showThemeOptions = () => {
    const options = [t("dark"), t("light")];
    const cancelButtonIndex = options.length;
    const tintColor = theme.colors.primaryText;
    const title = t("changeTheme");
    const disabledButtonIndices = [theme.dark ? 0 : 1];
    const titleTextStyle = {color: theme.colors.secondaryText};
    const containerStyle = {backgroundColor: theme.colors.surface};
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      tintColor,
      title,
      disabledButtonIndices,
      titleTextStyle,
      containerStyle,
    }, (buttonIndex) => {
      if (buttonIndex !== cancelButtonIndex) {
        props.setIsDarkTheme(buttonIndex === 0);
      }
    });
  }

  const showLanguageOptions = () => {
    const options = languages.map(language => t(language.code));
    const cancelButtonIndex = options.length
    const tintColor = theme.colors.primaryText;
    const title = t("selectLanguage");
    const disabledButtonIndices = [languages.findIndex(lang => lang.code === i18n.language)];
    const titleTextStyle = {color: theme.colors.secondaryText};
    const containerStyle = {backgroundColor: theme.colors.surface};
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      tintColor,
      title,
      disabledButtonIndices,
      titleTextStyle,
      containerStyle,
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
      t("changeTheme"),
      t("changeLanguage"),
      t("logOut"),
    ];
    const cancelButtonIndex = options.length;
    const tintColor = theme.colors.primaryText;
    const title = t("settings");
    const destructiveButtonIndex = 3;
    const titleTextStyle = {color: theme.colors.secondaryText};
    const containerStyle = {backgroundColor: theme.colors.surface};
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      tintColor,
      title,
      destructiveButtonIndex,
      titleTextStyle,
      containerStyle,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          setColorPickerVisible(true);
          break;
        case 1:
          showThemeOptions();
          break;
        case 2:
          showLanguageOptions();
          break;
        case 3:
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.greeting, { color: theme.colors.primaryText }]}>{getCurrentGreeting()} {props.studentInfo.name}!</Text>
      <Timetable lessonSections={props.studentInfo.lesson_sections} style={styles.timetable} />
      <Modal
        isVisible={colorPickerVisible}
        onBackdropPress={() => setColorPickerVisible(false)}
        backdropOpacity={0.5}
        animationOutTiming={500}
        statusBarTranslucent={true}
        deviceHeight={deviceHeight}
      >
        <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
          <ColorPicker value={props.studentInfo.color} onComplete={({hex}) => setColorPickerColor(hex)}>
            <Preview style={{marginVertical: 10}} />
            <Panel1 style={{marginVertical: 10}} thumbShape={"ring"} />
            <HueSlider style={{marginVertical: 10}} thumbSize={25} thumbShape={"pill"} />
          </ColorPicker>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Button title={t("cancel")} style={[styles.modalButton, {backgroundColor: "transparent"}]} onPress={() => {
              setColorPickerVisible(false);
            }} />
            <Button title={t("apply")} style={styles.modalButton} onPress={() => {
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
  timetable: {
    marginBottom: 10,
  },
  modal: {
    padding: 10,
    borderRadius: 10,
  },
  modalButton: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1.5,
  },
});

export default Index;
