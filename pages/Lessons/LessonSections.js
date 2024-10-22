import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";

const LessonSections = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredSectionList, setFilteredSectionList] = useState([]);

  useEffect(() => {
    setFilteredSectionList(
      props.lessonSections.filter(section =>
        section.lesson_section_teacher.toLowerCase().includes(search.toLowerCase()) ||
        section.lesson_section_number.toString().toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_code.toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [theme, search, props.students]);

  const SectionItem = memo(({ item }) => (
    <View>
      <TouchableOpacity style={[styles.item, {backgroundColor:theme.colors.surface}]}>
        <Text style={{color: theme.colors.primaryText}}>{item.lesson_section_number} - {item.lesson_section_teacher}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar placeholder={t("search...")} value={search} onChangeText={setSearch} />
      <FlashList
        contentContainerStyle={{paddingBottom: 100}}
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
  },
  item: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
});

export default LessonSections;
