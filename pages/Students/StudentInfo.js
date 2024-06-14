import {useTranslation} from "react-i18next";
import {StyleSheet, View, Text} from "react-native";

const StudentInfo = (props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t("studentID")}: {props.studentInfo.id}</Text>
      <Text>{t("department")}: {props.studentInfo.department}</Text>
      <Text>{t("email")}: {props.studentInfo.mail}</Text>
      <Text>{t("year")}: {props.studentInfo.year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default StudentInfo;
