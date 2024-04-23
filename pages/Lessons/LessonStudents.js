import {useTranslation} from "react-i18next";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const LessonStudents = (props) => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);

  useEffect(() => {
    setFilteredStudentList(
      props.students.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, props.students]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate("StudentsListIndex", {
        screen: "StudentDetailIndex",
        params: { studentId: item.id, studentName: `${item.name} ${item.surname}` }
      })}>
        <Text>{item.name} {item.surname}</Text>
      </TouchableOpacity>
    </View>
  ));

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
        renderItem={({ item }) => <StudentItem item={item} navigation={props.navigation} />}
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

export default LessonStudents;
