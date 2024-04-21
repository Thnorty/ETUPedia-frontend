import {useTranslation} from "react-i18next";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {memo, useEffect, useState} from "react";
import backend from "../../utils/backend";
import Loading from "../../components/Loading";
import Icon from "react-native-vector-icons/FontAwesome";

const StudentList = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);

  useEffect(() => {
    backend.get("api/get-students/")
      .then((response) => {
        setStudentList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredStudentList(
      studentList.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, studentList]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("StudentDetailIndex", {
        studentId: item.id,
        studentName: `${item.name} ${item.surname}`,
      })}>
        <Text>{item.name} {item.surname}</Text>
      </TouchableOpacity>
    </View>
  ));

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder={t("search...")}
        />
      </View>
      <FlatList
        data={filteredStudentList}
        renderItem={({ item }) => <StudentItem item={item} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default StudentList;
