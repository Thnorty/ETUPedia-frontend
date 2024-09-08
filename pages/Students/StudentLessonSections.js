import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";

const StudentLessonSections = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
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
      <TouchableOpacity style={[styles.item, {borderColor: theme.colors.border}]}>
        <Text style={[styles.mainText, {color: theme.colors.primaryText}]}>{item.lesson_code} {item.lesson_name}</Text>
        <Text style={[styles.smallText, {color: theme.colors.secondaryText}]}>{t("section")}: {item.lesson_section_number}</Text>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar placeholder={t("search")} value={search} onChangeText={setSearch} />
      <FlashList
        data={filteredLessonList}
        renderItem={({ item }) => <LessonItem item={item} navigation={props.navigation} />}
        estimatedItemSize={60}
      />
    </View>
  );
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
  mainText: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 12,
  },
});

export default StudentLessonSections;
