import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {memo, useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import SearchBar from "../../components/SearchBar";
import {useTheme} from "../../utils/Theme";
import ProfileIcon from "../../components/ProfileIcon";

const StudentList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  const load = () => {
    setLoadingError(false);
    backend.get("api/get-students/")
      .then((response) => {
        setStudentList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingError(true);
      });
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setFilteredStudentList(
      studentList.filter(student =>
        `${student.name} ${student.surname} ${student.id}`.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [theme, search, studentList]);

  const StudentItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={[styles.item, {backgroundColor:theme.colors.surface}]} onPress={() => navigation.navigate("StudentDetailIndex", {
        studentId: item.id,
        studentName: `${item.name} ${item.surname}`,
      })}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ProfileIcon user={item} size={40} fontSize={14} style={styles.profileIcon} />
          <Text style={[{color: theme.colors.primaryText}]}>{item.name} {item.surname}</Text>
        </View>
      </TouchableOpacity>
    </View>
  ));

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} />
      <FlashList
        data={filteredStudentList}
        renderItem={({ item }) => <StudentItem item={item} navigation={navigation} />}
        estimatedItemSize={60}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});

export default StudentList;
