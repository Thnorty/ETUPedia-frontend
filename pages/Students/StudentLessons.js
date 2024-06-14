import {useTranslation} from "react-i18next";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const StudentLessons = (props) => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [filteredLessonList, setFilteredLessonList] = useState([]);

  useEffect(() => {
    setFilteredLessonList(
      props.lesson_sections.filter(lesson_section =>
        lesson_section.lesson_code.toString().toLowerCase().includes(search.toLowerCase()) ||
        lesson_section.lesson_name.toString().toLowerCase().includes(search.toLowerCase()) ||
        lesson_section.lesson_section_number.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, props.lesson_sections]);

  const LessonItem = memo(({ item, navigation }) => (
    <View>
      {/*<TouchableOpacity style={styles.item} onPress={() => props.navigation.navigate("StudentsListIndex", {*/}
      {/*  screen: "StudentDetailIndex",*/}
      {/*  params: { studentId: item.id, studentName: `${item.name} ${item.surname}` }*/}
      {/*})}>*/}
      {/*  <Text>{item.name} {item.surname}</Text>*/}
      {/*</TouchableOpacity>*/}
      <TouchableOpacity style={styles.item}>
        <Text style={styles.mainText}>{item.lesson_code} {item.lesson_name}</Text>
        <Text style={styles.smallText}>{t("section")}: {item.lesson_section_number}</Text>
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
        data={filteredLessonList}
        renderItem={({ item }) => <LessonItem item={item} navigation={props.navigation} />}
        keyExtractor={item => item.lesson_code}
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
  mainText: {
    fontSize: 16,
    color: "#000",
  },
  smallText: {
    fontSize: 12,
    color: "#666",
  },
});

export default StudentLessons;
