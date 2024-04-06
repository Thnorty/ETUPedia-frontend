import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import api from "../../utils/api";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../../components/Loading";

const TeacherList = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [teacherList, setTeacherList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTeacherList, setFilteredTeacherList] = useState([]);

  useEffect(() => {
    api.get("get-teachers/")
      .then((response) => {
        setTeacherList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredTeacherList(
      teacherList.filter(teacher =>
        `${teacher.name} ${teacher.surname}`.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, teacherList]);

  const TeacherItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("TeacherDetailIndex", {teacherName: item.name})}>
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
        data={filteredTeacherList}
        renderItem={({ item }) => <TeacherItem item={item} navigation={navigation} />}
        keyExtractor={item => item.name.toString()}
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
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default TeacherList;
