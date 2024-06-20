import {useTranslation} from "react-i18next";
import backend from "../../utils/Backend";
import {memo, useEffect, useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Loading from "../../components/Loading";
import Icon from "react-native-vector-icons/FontAwesome";
import {FlashList} from "@shopify/flash-list";

const LessonList = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lessonList, setLessonList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredLessonList, setFilteredLessonList] = useState([]);

  useEffect(() => {
    backend.get("api/get-lessons/")
      .then((response) => {
        setLessonList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredLessonList(
      lessonList.filter(lesson =>
        lesson.name.toLowerCase().includes(search.toLowerCase()) ||
        lesson.lesson_code.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, lessonList]);

  const LessonItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("LessonDetailIndex", {
        lessonCode: item.lesson_code,
        lessonName: item.name,
      })}>
        <Text>{item.lesson_code} {item.name}</Text>
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
      <FlashList
        data={filteredLessonList}
        renderItem={({ item }) => <LessonItem item={item} navigation={navigation} />}
        estimatedItemSize={40}
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

export default LessonList;
