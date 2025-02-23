import {useTranslation} from "react-i18next";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {memo, useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import SearchBar from "../../components/SearchBar";
import {useTheme} from "../../utils/Theme";
import ProfileIcon from "../../components/ProfileIcon";
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faStar as faStarSolid} from "@fortawesome/free-solid-svg-icons";
import {faStar as faStarRegular} from "@fortawesome/free-regular-svg-icons";
import {customFilter} from '../../utils/SearchUtils';

const StudentList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudentList, setFilteredStudentList] = useState([]);
  const [loadingError, setLoadingError] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const load = () => {
    setLoadingError(false);
    const payload = {
      is_favorites: showOnlyFavorites
    };
    backend.post("api/get-students/", payload)
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
  }, [showOnlyFavorites]);

  useEffect(() => {
    setFilteredStudentList(
      studentList.filter(student =>
        customFilter(`${student.name} ${student.surname} ${student.id}`, search)
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

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.searchRow}>
        <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder={t("search...")}
            style={styles.searchBar}
        />
        <TouchableOpacity
            style={[styles.favoriteButton, {backgroundColor: theme.colors.surface}]}
            onPress={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
              setLoading(true);
            }}
        >
          <FontAwesomeIcon
              icon={showOnlyFavorites ? faStarSolid : faStarRegular}
              size={24}
              color={showOnlyFavorites ? "#FFD700" : "#808080"}
          />
        </TouchableOpacity>
      </View>

      {loading ? (
          <Loading loadingError={loadingError} onRetry={load} />
      ) : (
          <FlashList
              contentContainerStyle={{paddingBottom: 100}}
              data={filteredStudentList}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, {color: theme.colors.secondaryText}]}>
                    {showOnlyFavorites
                        ? t("noFavoriteStudentsFound")
                        : t("noStudentsFound")}
                  </Text>
                </View>
              }
              renderItem={({ item, index }) =>
                  <>
                    {index === 0 && (
                        <View style={styles.countContainer}>
                          <View style={styles.line} />
                          <Text style={[styles.countText, {color: theme.colors.secondaryText}]}>{filteredStudentList.length}</Text>
                          <View style={styles.line} />
                        </View>
                    )}
                    <StudentItem item={item} navigation={navigation} />
                  </>
              }
              estimatedItemSize={60}
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
  },
  favoriteButton: {
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    marginRight: 10,
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

export default StudentList;
