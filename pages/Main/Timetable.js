import {View, Text, StyleSheet, ScrollView} from 'react-native';

const Timetable = ({ lessonSections }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const timetable = Array(7).fill().map(() => Array(14).fill(""));  // Populate the timetable with the lesson sections
  lessonSections.forEach((lessonSection) => {
    lessonSection.classrooms_and_times.forEach((classroomAndTime) => {
      const day = classroomAndTime.time % 7;
      const hour = Math.floor(classroomAndTime.time / 7);
      timetable[day][hour] = `${lessonSection.lesson_code}`;
    });
  });

  return (
    <ScrollView>
      <View style={styles.timetable}>
        {timetable.map((day, dayIndex) => (
          <View key={dayIndex}>
            <Text style={styles.lesson}>
              {days[dayIndex]}
            </Text>
            <View style={styles.day}>
              {day.map((lesson, lessonIndex) => (
                <Text key={lessonIndex} style={styles.lesson}>
                  {lesson}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  timetable: {
    flex: 1,
    flexDirection: "row",
  },
  lesson: {
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "black",
    width: 50,
    height: 50,
    minWidth: "8%",
  },
});

export default Timetable;
