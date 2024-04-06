import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {memo, useEffect, useState} from "react";
import api from "../../utils/api";
import Loading from "../../components/Loading";
import Icon from "react-native-vector-icons/FontAwesome";

const StudentList = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);

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

  useEffect(() => {
    setFilteredStudentList(
      studentList.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, studentList]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("StudentDetailIndex", {studentId: item.id})}>
        <Text>{item.name} {item.surname}</Text>
      </TouchableOpacity>
    </View>
  ));

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
  input: {
    marginLeft: 10,
    flex: 1,
  },
});

export default StudentList;
