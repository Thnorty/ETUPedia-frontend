import {View, Text, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Timetable from "../Home/Timetable";
import Loading from "../../components/Loading";

const TeacherDetail = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({
    name: "",
    lesson_sections: [{
      lesson_code: "",
      lesson_name: "",
      lesson_section_number: "",
      classrooms_and_times: [{
        classroom: "",
        time: "",
      }],
    }],
  });

  useEffect(() => {
    navigation.setOptions({title: route.params.teacherName});
    const payload = {
      teacher_name: route.params.teacherName,
    };
    backend.post("api/get-teacher-info/", payload)
      .then((response) => {
        setTeacherInfo(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <Text>{teacherInfo.name}</Text>
      <Timetable lessonSections={teacherInfo.lesson_sections} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TeacherDetail;
