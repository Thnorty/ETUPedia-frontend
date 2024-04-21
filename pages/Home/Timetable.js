import {useTranslation} from "react-i18next";
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';

const Timetable = ({ lessonSections }) => {
  const {t} = useTranslation();
  const days = ["", "mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => t(day));
  const timeSlots = [["8.30-9.20"], ["9.30-10.20"], ["10.30-11.20"], ["11.30-12.20"], ["12.30-13.20"], ["13.30-14.20"], ["14.30-15.20"], ["15.30-16.20"], ["16.30-17.20"], ["17.30-18.20"], ["18.30-19.20"], ["19.30-20.20"], ["20.30-21.20"], ["21.30-22.20"]];

  const timetable = Array(7).fill().map(() => Array(14).fill().map(() => []));  // Populate the timetable with the lesson sections
  lessonSections.forEach((lessonSection) => {
    lessonSection.classrooms_and_times.forEach((classroomAndTime) => {
      const day = classroomAndTime.time % 7;
      const hour = Math.floor(classroomAndTime.time / 7);
      timetable[day+1][hour].push(lessonSection.lesson_code);
    });
  });

  timetable[0] = timeSlots;

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
