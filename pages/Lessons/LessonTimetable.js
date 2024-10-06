import {StyleSheet, View} from "react-native";
import Timetable from "../../components/Timetable";
import {useTheme} from "../../utils/Theme";

const LessonTimetable = (props) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Timetable lessonSections={props.lessonSections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default LessonTimetable;
