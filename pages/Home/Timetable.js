import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

const Timetable = ({ lessonSections }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const timetable = Array(7).fill().map(() => Array(14).fill().map(() => []));  // Populate the timetable with the lesson sections
  lessonSections.forEach((lessonSection) => {
    lessonSection.classrooms_and_times.forEach((classroomAndTime) => {
      const day = classroomAndTime.time % 7;
      const hour = Math.floor(classroomAndTime.time / 7);
      timetable[day][hour].push(lessonSection.lesson_code);
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
              {day.map((lessons, lessonsIndex) => (
                <View key={lessonsIndex} style={styles.lessonCell}>
                  {lessons.map((lesson, lessonIndex) => (
                    <Text key={lessonIndex} style={styles.lesson}>
                      {lesson}
                    </Text>
                  ))}
                </View>
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
  lessonCell: {
    padding: 2,
    borderWidth: 1,
    borderColor: "black",
    width: scale(40),
    height: verticalScale(35),
  },
  lesson: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default Timetable;
