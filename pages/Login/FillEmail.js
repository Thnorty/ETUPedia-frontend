import {StyleSheet, Text, TextInput, View, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../utils/Theme';
import {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faCheck} from '@fortawesome/free-solid-svg-icons';
import backend from '../../utils/Backend';
import Alert from '../../components/Alert';

const FillEmail = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [studentMailOther, setStudentMailOther] = useState("");
  const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);

  const handleSubmit = () => {
    const payload = {
      student_id: route.params.studentID,
      student_mail_other: studentMailOther.trim(),
      student_mail_etu: route.params.email,
    };
    backend.post("api/verify-email-of-not-found-student/", payload).then((response) => {
      setIsSuccessAlertOpen(true);
    }).catch((error) => {
      setIsErrorAlertOpen(true);
    });
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Alert
          title={t("invalidStudentEmail")}
          message={t("invalidStudentEmailMessage")}
          buttons={[{text: t("okay"), onPress: () => setIsErrorAlertOpen(false)}]}
          isOpen={isErrorAlertOpen}
          setIsOpen={setIsErrorAlertOpen}
      />
      <Alert
          title={t("successStudentEmailCheck")}
          message={t("successStudentEmailCheckMessage")}
          buttons={[{text: t("okay"), onPress: () => {
              setIsErrorAlertOpen(false);
              navigation.navigate("LoginPage");
            }}]}
          isOpen={isSuccessAlertOpen}
          setIsOpen={setIsSuccessAlertOpen}
      />
      <Text style={[styles.text, {color: theme.colors.primaryText}]}>
        {t("inputFullEmailMessage")}:
      </Text>
      <Text style={[styles.maskedMailText, {color: theme.colors.primaryText}]}>
        {route.params.maskedMail}
      </Text>
      <TextInput
          placeholder={t("email")}
          value={studentMailOther}
          onChangeText={setStudentMailOther}
          autoCapitalize={"none"}
          autoComplete={"off"}
          style={[styles.input, {borderColor: theme.colors.border, color: theme.colors.primaryText}]}
          placeholderTextColor={theme.colors.secondaryText}
      />
      <TouchableOpacity style={[styles.prevButton, {backgroundColor: theme.colors.accent}]} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faArrowLeft} size={24} color={theme.colors.primaryTextInverted} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.nextButton, {backgroundColor: theme.colors.accent}]} onPress={handleSubmit}>
        <FontAwesomeIcon icon={faCheck} size={24} color={theme.colors.primaryTextInverted} />
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
  logo: {
    position: 'absolute',
    top: 80,
    width: 140,
    height: 140,
    marginBottom: 40,
    borderRadius: 16,
  },
  text: {
    marginBottom: 10,
    textAlign: 'center',
    width: 300,
    fontSize: 16,
    fontWeight: 'bold',
  },
  maskedMailText: {
    marginBottom: 30,
    textAlign: 'center',
    width: 300,
    fontSize: 16,
    fontWeight: '900'
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

export default FillEmail;
