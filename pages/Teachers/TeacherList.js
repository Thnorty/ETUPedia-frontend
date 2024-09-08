import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";

const TeacherList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [teacherList, setTeacherList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredTeacherList, setFilteredTeacherList] = useState([]);

  useEffect(() => {
    backend.get("api/get-teachers/")
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
  }, [theme, search, teacherList]);

  const TeacherItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={[styles.item, {borderBottomColor: theme.colors.border}]} onPress={() => navigation.navigate("TeacherDetailIndex", {
        teacherName: item.name
      })}>
        <Text style={[{color: theme.colors.primaryText}]}>{item.name} {item.surname}</Text>
      </TouchableOpacity>
    </View>
  ));

  if (loading) return <Loading />

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} />
      <FlashList
        data={filteredTeacherList}
        renderItem={({ item }) => <TeacherItem item={item} navigation={navigation} />}
        estimatedItemSize={40}
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
});

export default TeacherList;
