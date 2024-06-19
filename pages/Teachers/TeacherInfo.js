import {useTranslation} from "react-i18next";
import {StyleSheet, View, Text} from "react-native";

const TeacherInfo = (props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t("numberOfLessonsTaught")}: {props.teacherInfo.lesson_sections.length}</Text>
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

export default TeacherInfo;
