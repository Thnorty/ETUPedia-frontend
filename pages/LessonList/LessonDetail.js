import {View, Text} from "react-native";
import {useEffect, useState} from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";

const LessonDetail = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [lessonInfo, setLessonInfo] = useState({
    lesson_name: "",
    lesson_code: "",
    student_count: "",
  });

  useEffect(() => {
    const payload = {
      lesson_code: route.params.lessonCode,
    };
    api.post("get-lesson-info/", payload)
      .then((response) => {
        setLessonInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  if (loading) return <Loading />

  return (
    <View>
      <Text>{lessonInfo.lesson_name}</Text>
      <Text>Lesson Code: {lessonInfo.lesson_code}</Text>
      <Text>Student Count: {lessonInfo.student_count}</Text>
    </View>
  );
}

export default LessonDetail;
