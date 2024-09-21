import {StyleSheet, View} from "react-native";
import {useTranslation} from "react-i18next";
import {useTheme} from "../../utils/Theme";
import {faUser, faIdBadge, faBuilding, faEnvelope, faGraduationCap} from "@fortawesome/free-solid-svg-icons";
import InfoCard from "../../components/InfoCard";

const StudentInfo = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <InfoCard icon={faUser} label={t("name")} value={props.studentInfo.name + " " + props.studentInfo.surname} />
      <InfoCard icon={faIdBadge} label={t("studentID")} value={props.studentInfo.id} />
      <InfoCard icon={faBuilding} label={t("department")} value={props.studentInfo.department} />
      <InfoCard icon={faEnvelope} label={t("email")} value={props.studentInfo.mail} />
      <InfoCard icon={faGraduationCap} label={t("year")} value={props.studentInfo.year !== -1 ? props.studentInfo.year : t("graduated")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StudentInfo;
