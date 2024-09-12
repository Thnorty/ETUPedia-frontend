import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useState, useEffect} from "react";
import {FlashList} from "@shopify/flash-list";
import {Shadow} from "react-native-shadow-2";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";
import ProfileIcon from "../../components/ProfileIcon";

const LessonStudents = (props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);

  useEffect(() => {
    setFilteredStudentList(
      props.students.filter(student =>
        `${student.name} ${student.surname}`.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [theme, search, props.students]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={[styles.item, {borderColor: theme.colors.border}]} onPress={() => props.navigation.navigate("StudentListIndex", {
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
      <SearchBar placeholder={t("search...")} value={search} onChangeText={setSearch} />
      <FlashList
        data={filteredStudentList}
        renderItem={({ item }) => <StudentItem item={item} navigation={props.navigation} />}
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
  profileIcon: {
    marginRight: 10,
  }
});

export default LessonStudents;
