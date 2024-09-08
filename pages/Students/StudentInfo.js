import {useTranslation} from "react-i18next";
import {StyleSheet, View, Text} from "react-native";
import {useTheme} from "../../utils/Theme";

const StudentInfo = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[{color: theme.colors.primaryText}]}>{t("studentID")}: {props.studentInfo.id}</Text>
      <Text style={[{color: theme.colors.primaryText}]}>{t("department")}: {props.studentInfo.department}</Text>
      <Text style={[{color: theme.colors.primaryText}]}>{t("email")}: {props.studentInfo.mail}</Text>
      <Text style={[{color: theme.colors.primaryText}]}>{t("year")}: {props.studentInfo.year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default StudentInfo;
