import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import Timetable from "../../components/Timetable";

const TeacherTimetable = (props) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <Timetable lessonSections={props.lessonSections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TeacherTimetable;
