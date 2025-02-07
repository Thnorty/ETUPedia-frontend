import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../utils/Theme';
import {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import backend from '../../utils/Backend';
import Alert from '../../components/Alert';

const InputStudentID = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [studentID, setStudentID] = useState("");
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [noValidEmailAlertOpen, setNoValidEmailAlertOpen] = useState(false);

  const handleSubmit = () => {
    const payload = {
      student_id: studentID
    };
    backend.post("api/id-of-not-found-student/", payload).then((response) => {
      const maskedMail = response.data.masked_mail;
      navigation.navigate("FillEmail", {maskedMail, studentID, email: route.params.email});
    }).catch((error) => {
      if (error.response.data.error === "Student has no mail") {
        console.error("Student not found");
        setNoValidEmailAlertOpen(true);
      }
      else {
        console.error(error);
        setIsErrorAlertOpen(true);
      }
    });
  }

  return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <Alert
            title={t("invalidStudentID")}
            message={t("invalidStudentIDMessage")}
            buttons={[{text: t("okay"), onPress: () => setIsErrorAlertOpen(false)}]}
            isOpen={isErrorAlertOpen}
            setIsOpen={setIsErrorAlertOpen}
        />
        <Alert
            title={t("noValidEmail")}
            message={t("noValidEmailMessage")}
            buttons={[{text: t("okay"), onPress: () => setNoValidEmailAlertOpen(false)}]}
            isOpen={noValidEmailAlertOpen}
            setIsOpen={setNoValidEmailAlertOpen}
        />
        <Text style={[styles.text, {color: theme.colors.primaryText}]}>
          {t("couldntFindEmail")} {t("inputStudentIDMessage")}
        </Text>
        <TextInput
            placeholder={t("studentID")}
            value={studentID}
            onChangeText={setStudentID}
            autoCapitalize={"none"}
            autoComplete={"off"}
            style={[styles.input, {borderColor: theme.colors.border, color: theme.colors.primaryText}]}
            placeholderTextColor={theme.colors.secondaryText}
        />
        <TouchableOpacity style={[styles.prevButton, {backgroundColor: theme.colors.accent}]} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={24} color={theme.colors.primaryTextInverted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.nextButton, {backgroundColor: theme.colors.accent}]} onPress={handleSubmit}>
          <FontAwesomeIcon icon={faArrowRight} size={24} color={theme.colors.primaryTextInverted} />
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
    width: 300,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  },
  prevButton: {
    position: 'absolute',
    left: 50,
    bottom: 50,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 50,
  },
  nextButton: {
    position: 'absolute',
    right: 50,
    bottom: 50,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 50,
  }
});

export default InputStudentID;
