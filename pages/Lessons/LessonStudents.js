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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={[styles.profileButton, {backgroundColor: item.color}]}>
            <Text style={[styles.profileText, {color: item.color.charAt(1).toLowerCase() > 'd' ? 'black' : 'white'}]}>{item.name.slice(0, 1)+item.surname.slice(0, 1)}</Text>
          </View>
          <Text>{item.name} {item.surname}</Text>
        </View>
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
  profileButton: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#9e9e9e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  profileText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default LessonStudents;
