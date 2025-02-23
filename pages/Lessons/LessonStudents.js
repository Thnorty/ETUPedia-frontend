import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";
import ProfileIcon from "../../components/ProfileIcon";
import MultiSelect from '../../components/MultiSelect';
import {customFilter} from '../../utils/SearchUtils';

const LessonStudents = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  useEffect(() => {
    setFilteredStudentList(props.students.filter(student =>
      (selectedSections.length === 0 || selectedSections.includes(student.lesson_section_number)) &&
      (customFilter(`${student.name} ${student.surname} ${student.id}`, search))
    ));
  }, [theme, search, selectedSections, props.students]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={[styles.item, {backgroundColor:theme.colors.surface}]} onPress={() => navigation.navigate("StudentListIndex", {
        screen: "StudentDetailIndex",
        params: { studentId: item.id, studentName: `${item.name} ${item.surname}` }
      })}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ProfileIcon user={item} size={40} fontSize={14} style={styles.profileIcon} />
          <Text style={[{color: theme.colors.primaryText}]}>{item.name} {item.surname}</Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.topContainer}>
        <SearchBar style={styles.searchBar} placeholder={t("search...")} value={search} onChangeText={setSearch} />
        <MultiSelect placeholder={t("sections")} options={props.lessonSections.map(section => section.lesson_section_number)}
                     value={selectedSections} onChange={setSelectedSections} buttonStyle={[styles.multiSelect, {backgroundColor: theme.colors.surface}]} />
      </View>
      <FlashList
        contentContainerStyle={{paddingBottom: 100}}
        data={filteredStudentList}
        renderItem={({ item, index }) =>
          <>
            {index === 0 && (
                <View style={styles.countContainer}>
                  <View style={styles.line} />
                  <Text style={[styles.countText, {color: theme.colors.secondaryText}]}>{filteredStudentList.length}</Text>
                  <View style={styles.line} />
                </View>
            )}
            <StudentItem item={item} navigation={props.navigation} />
          </>
        }
        estimatedItemSize={60}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
  },
  searchBar: {
    flex: 1,
  },
  multiSelect: {
    flex: 1,
    borderRadius: 6,
    marginVertical: 10,
    width: 150,
    marginLeft: 0,
  },
  item: {
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  profileIcon: {
    marginRight: 10,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
});

export default LessonStudents;
