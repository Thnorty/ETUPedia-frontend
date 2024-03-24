import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useEffect, useState} from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";

const StudentList = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    api.get("get-students/")
      .then((response) => {
        setStudentList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("StudentDetailIndex", {studentId: item.id})}>
        <Text>{item.name} {item.surname}</Text>
      </TouchableOpacity>
    </View>
  ));

  const renderItem = ({ item }) => (
    <StudentItem item={item} navigation={navigation} />
  );

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={studentList}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    borderWidth: 1,
  },
});

export default StudentList;
