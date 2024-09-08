import {useTranslation} from "react-i18next";
import {StyleSheet, View, Text} from "react-native";
import {useTheme} from "../../utils/Theme";

const TeacherInfo = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[{color: theme.colors.primaryText}]}>{t("numberOfLessonsTaught")}: {props.teacherInfo.lesson_sections.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default TeacherInfo;
