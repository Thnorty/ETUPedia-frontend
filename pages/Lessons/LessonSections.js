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
        section.section_teacher.toLowerCase().includes(search.toLowerCase()) ||
        section.section_number.toString().toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_code.toLowerCase().includes(search.toLowerCase()) ||
        props.lessonInfo.lesson_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [theme, search, props.students]);

  const SectionItem = memo(({ item }) => (
    <View>
      <TouchableOpacity style={[styles.item, {borderColor: theme.colors.border}]}>
        <Text style={{color: theme.colors.primaryText}}>{item.section_number} - {item.section_teacher}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar placeholder={t("search...")} value={search} onChangeText={setSearch} />
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
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
  },
});

export default LessonSections;
