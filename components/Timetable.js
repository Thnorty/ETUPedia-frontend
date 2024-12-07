import {useTranslation} from "react-i18next";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale} from 'react-native-size-matters';
import {useTheme} from "../utils/Theme";
import {getTextColor} from "../utils/ColorUtils";
import {useNavigation} from "@react-navigation/native";

const Timetable = ({ lessonSections, style }) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const theme = useTheme();
  const day_count = 7;
  const hour_count = 14;
  const days = ["", "mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => t(day));
  const timeSlots = [
    ['8:30\n9:20'], ['9:30\n10:20'], ['10:30\n11:20'], ['11:30\n12:20'],
    ['12:30\n13:20'], ['13:30\n14:20'], ['14:30\n15:20'], ['15:30\n16:20'],
    ['16:30\n17:20'], ['17:30\n18:20'], ['18:30\n19:20'], ['19:30\n20:20'],
    ['20:30\n21:20'], ['21:30\n22:20'],
  ];

  const timetable = Array(day_count+1).fill().map(() => Array(hour_count).fill().map(() => []));
  lessonSections.forEach((lessonSection) => {
    lessonSection.classrooms_and_times.forEach((classroomAndTime) => {
      const day = classroomAndTime.time % day_count;
      const hour = Math.floor(classroomAndTime.time / day_count);
      timetable[day+1][hour].push({
        lessonCode: lessonSection.lesson_code,
        lessonName: lessonSection.lesson_name,
        lessonSectionNumber: lessonSection.lesson_section_number,
        classroom: classroomAndTime.classroom,
        color: lessonSection.color,
      })
    });
  });

  timetable[0] = timeSlots;

  return (
    <ScrollView>
      <View style={[styles.timetable, style]}>
        {timetable.map((day, dayIndex) => (
          <View key={dayIndex}>
            <View>
              <View style={[styles.outerCell, {backgroundColor: theme.colors.primary, borderColor: theme.colors.border}]}>
                <Text style={[styles.outerCellText, {color: theme.colors.primaryText}]}>
                  {days[dayIndex]}
                </Text>
              </View>
              <View>
                {day.map((lessons, lessonsIndex) => (
                  dayIndex === 0 ? (
                    <View key={lessonsIndex} style={[styles.outerCell, {backgroundColor: theme.colors.primary, borderColor: theme.colors.border}]}>
                      <Text style={[styles.outerCellText, {color: theme.colors.primaryText}]}>{lessons[0]}</Text>
                    </View>
                    ) : (
                      <View key={lessonsIndex} style={[styles.cell, {borderColor: theme.colors.border}]}>
                        {lessons.map((lesson, lessonIndex) => (
                          <TouchableOpacity key={lessonIndex} style={{flex: 1}} onPress={() => navigation.navigate("LessonListIndex", {
                            screen: "LessonDetailIndex",
                            params: { lessonCode: lesson.lessonCode, lessonName: lesson.lessonName }
                          })}>
                            <Text style={[styles.lesson, {backgroundColor: lesson.color, borderColor: theme.colors.border, color: getTextColor(lesson.color)}]}>
                              {lesson.lessonCode}{"\n"}{lesson.classroom}{"\n"}{t("section")} {lesson.lessonSectionNumber}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )
                ))}
              </View>
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
    minWidth: '100%',
    minHeight: '100%',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    padding: 2,
    borderWidth: 1,
    width: scale(40),
    height: 50,
  },
  outerCell: {
    flex: 1,
    borderWidth: 1,
    width: scale(40),
    height: 50,
  },
  outerCellText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13,
  },
  lesson: {
    flex: 1,
    borderWidth: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 8,
    borderRadius: 5,
  },
});

export default Timetable;
