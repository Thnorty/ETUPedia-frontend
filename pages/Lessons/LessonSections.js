import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {FlashList} from "@shopify/flash-list";

const LessonSections = (props) => {
  const {t} = useTranslation();
  const [search, setSearch] = useState('');
  const [filteredSectionList, setFilteredSectionList] = useState([]);

  useEffect(() => {
    setFilteredSectionList(
      props.lessonSections.filter(section =>
        section.section_teacher.toLowerCase().includes(search.toLowerCase()) ||
        section.section_number.toString().toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_code.toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, props.students]);

  const SectionItem = memo(({ item }) => (
    <View>
      <TouchableOpacity style={styles.item}>
        <Text>{item.section_number} - {item.section_teacher}</Text>
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
      <FlashList
        data={filteredSectionList}
        renderItem={({ item }) => <SectionItem item={item} />}
        estimatedItemSize={40}
      />
    </View>
  )
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

export default LessonSections;
