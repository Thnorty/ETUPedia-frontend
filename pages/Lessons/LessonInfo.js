import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import {useTheme} from "../../utils/Theme";
import InfoCard from "../../components/InfoCard";
import {faBook, faCode, faUserGraduate} from "@fortawesome/free-solid-svg-icons";

const LessonInfo = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <InfoCard icon={faBook} label={t("lessonName")} value={props.lessonInfo.lesson_name} />
      <InfoCard icon={faCode} label={t("lessonCode")} value={props.lessonInfo.lesson_code} />
      <InfoCard icon={faUserGraduate} label={t('studentCount')} value={props.lessonInfo.student_count} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LessonInfo;
