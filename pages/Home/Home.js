import {useTranslation} from "react-i18next";
import {languages} from "../../utils/i18n";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "../../components/Modal";
import {useEffect, useState} from "react";
import backend, {setAxiosToken} from "../../utils/Backend";
import Timetable from "../../components/Timetable";
import {localStorage} from "../../utils/LocalStorage";
import {useActionSheet} from "@expo/react-native-action-sheet";
import ColorPicker, { Panel1, Preview, HueSlider } from 'reanimated-color-picker';
import {useTheme} from "../../utils/Theme";
import ProfileIcon from "../../components/ProfileIcon";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faDroplet, faBrush, faGlobe, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";

const Home = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const theme = useTheme();
  const {showActionSheetWithOptions} = useActionSheet();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[styles.topBar]}>
          <ProfileIcon user={route.params.studentInfo} onPress={showSettingsOptions} size={40} fontSize={14} style={styles.profileIcon} />
        </View>
      ),
    });
  }, [theme, i18n.language, route.params.studentInfo]);

  const changeProfileColor = (color) => {
    route.params.setStudentInfo({...route.params.studentInfo, color: color})
    const payload = {
      color: color,
    };
    backend.post("api/change-profile-color/", payload)
    .then(() => {
      route.params.setStudentInfo({...route.params.studentInfo, color: color});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const showThemeOptions = () => {
    const colorSchemes = ["light", "dark", "systemDefault"];
    const options = colorSchemes.map(colorScheme => t(colorScheme));
    const cancelButtonIndex = options.length;
    const tintColor = theme.colors.primaryText;
    const title = t("changeTheme");
    const disabledButtonIndices = [colorSchemes.findIndex(colorScheme => colorScheme === route.params.colorScheme)];
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
        route.params.setColorScheme(colorSchemes[buttonIndex]);
        localStorage.save({
          key: 'colorScheme',
          data: colorSchemes[buttonIndex],
        }).then().catch(e => console.error(e));
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
      t("changeProfileColor"),
      t("changeTheme"),
      t("changeLanguage"),
      t("logOut"),
    ];
    const icons = [
      <FontAwesomeIcon icon={faDroplet} size={20} color={theme.colors.secondaryText} />,
      <FontAwesomeIcon icon={faBrush} size={20} color={theme.colors.secondaryText} />,
      <FontAwesomeIcon icon={faGlobe} size={20} color={theme.colors.secondaryText} />,
      <FontAwesomeIcon icon={faRightFromBracket} size={20} color={theme.colors.error} />,
    ];
    const cancelButtonIndex = options.length;
    const tintColor = theme.colors.primaryText;
    const title = t("settings");
    const titleTextStyle = {color: theme.colors.secondaryText};
    const destructiveColor = theme.colors.error;
    const destructiveButtonIndex = 3;
    const containerStyle = {backgroundColor: theme.colors.surface};
    showActionSheetWithOptions({
      options,
      icons,
      cancelButtonIndex,
      tintColor,
      title,
      titleTextStyle,
      destructiveColor,
      destructiveButtonIndex,
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
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.greeting, {color: theme.colors.primaryText}]}>{getCurrentGreeting()} {route.params.studentInfo.name}!</Text>
      <Timetable lessonSections={route.params.studentInfo.lesson_sections} style={styles.timetable} />
      <Modal
          isVisible={colorPickerVisible}
          onBackdropPress={() => setColorPickerVisible(false)}
      >
        <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
          <ColorPicker value={route.params.studentInfo.color} onComplete={({hex}) => setColorPickerColor(hex)}>
            <Preview style={{marginVertical: 10}} />
            <Panel1 style={{marginVertical: 10}} thumbShape={"ring"} />
            <HueSlider style={{marginVertical: 10}} thumbSize={25} thumbShape={"pill"} />
          </ColorPicker>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={{marginRight: 10}} onPress={() => {
              setColorPickerVisible(false);
            }}>
              <Text style={{color: theme.colors.error}}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setColorPickerVisible(false);
              changeProfileColor(colorPickerColor);
            }}>
              <Text style={{color: theme.colors.primary}}>{t("submit")}</Text>
            </TouchableOpacity>
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
    paddingBottom: 100,
  },
  modal: {
    borderRadius: 10,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10,
  },
});

export default Home;
