import {StyleSheet, View} from "react-native";
import Timetable from "../../components/Timetable";
import {useTheme} from "../../utils/Theme";

const LessonTimetable = (props) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Timetable lessonSections={props.lessonSections} style={styles.timetable} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  timetable: {
    paddingBottom: 90,
  },
});

export default LessonTimetable;
