import {useTranslation} from "react-i18next";
import {View, Text} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/backend";
import Loading from "../../components/Loading";

const LessonDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lessonInfo, setLessonInfo] = useState({
    lesson_name: "",
    lesson_code: "",
    student_count: "",
  });

  useEffect(() => {
    navigation.setOptions({title: `${route.params.lessonCode} ${route.params.lessonName}`});

    const payload = {
      lesson_code: route.params.lessonCode,
    };
    backend.post("api/get-lesson-info/", payload)
      .then((response) => {
        setLessonInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (loading) return <Loading />

  return (
    <View>
      <Text>{lessonInfo.lesson_name}</Text>
      <Text>{t("lessonCode")}: {lessonInfo.lesson_code}</Text>
      <Text>{t("studentCount")}: {lessonInfo.student_count}</Text>
    </View>
  );
}

export default LessonDetail;
