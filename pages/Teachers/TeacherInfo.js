import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import {useTheme} from "../../utils/Theme";
import InfoCard from "../../components/InfoCard";
import {faUser, faChalkboardUser} from "@fortawesome/free-solid-svg-icons";

const TeacherInfo = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <InfoCard icon={faUser} label={t("name")} value={props.teacherInfo.name} />
      <InfoCard icon={faChalkboardUser} label={t("numberOfLessonsTaught")} value={props.teacherInfo.lesson_sections.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TeacherInfo;
