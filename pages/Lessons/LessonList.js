import {useTranslation} from "react-i18next";
import backend from "../../utils/Backend";
import React, {memo, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";
import {customFilter} from '../../utils/SearchUtils';

const LessonList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [lessonList, setLessonList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredLessonList, setFilteredLessonList] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  const load = () => {
    setLoadingError(false);
    backend.get("api/get-lessons/")
      .then((response) => {
        setLessonList(response.data);
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
    setFilteredLessonList(
      lessonList.filter(lesson =>
        customFilter(`${lesson.name} ${lesson.lesson_code}`, search)
      )
    );
  }, [theme, search, lessonList]);

  const LessonItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={[styles.item, {backgroundColor:theme.colors.surface}]} onPress={() => navigation.navigate("LessonDetailIndex", {
        lessonCode: item.lesson_code,
        lessonName: item.name,
      })}>
        <Text style={[{color: theme.colors.primaryText}]}>{item.lesson_code} {item.name}</Text>
      </TouchableOpacity>
    </View>
  ));

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} />
      <FlashList
        contentContainerStyle={{paddingBottom: 100}}
        data={filteredLessonList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.colors.secondaryText}]}>
              {t('noLessonsFound')}
            </Text>
          </View>
        }
        renderItem={({ item, index }) =>
          <>
            {index === 0 && (
                <View style={styles.countContainer}>
                  <View style={styles.line} />
                  <Text style={[styles.countText, {color: theme.colors.secondaryText}]}>{filteredLessonList.length}</Text>
                  <View style={styles.line} />
                </View>
            )}
            <LessonItem item={item} navigation={navigation} />
          </>
        }
        estimatedItemSize={40}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  item: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
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

export default LessonList;
