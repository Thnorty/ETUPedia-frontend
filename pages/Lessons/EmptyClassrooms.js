import backend from '../../utils/Backend';
import {useTheme} from '../../utils/Theme';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SearchBar from '../../components/SearchBar';
import {useNavigation} from '@react-navigation/native';
import HeaderButton from '../../components/HeaderButton';

const EmptyClassrooms = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [emptyClassrooms, setEmptyClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [search, setSearch] = useState('');
  const [yValues, setYValues] = useState(new Array(98).fill(0));
  const [targetIndex, setTargetIndex] = useState(null);

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => t(day));
  const timeSlots = [
    "8:30 - 9:20", "9:30 - 10:20", "10:30 - 11:20", "11:30 - 12:20",
    "12:30 - 13:20", "13:30 - 14:20", "14:30 - 15:20", "15:30 - 16:20",
    "16:30 - 17:20", "17:30 - 18:20", "18:30 - 19:20", "19:30 - 20:20",
    "20:30 - 21:20", "21:30 - 22:20"
  ];

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    setLoadingError(null);
    backend.post("api/get-empty-classrooms/").then((response) => {
      setEmptyClassrooms(response.data);
    }).catch((error) => {
      setLoadingError(error);
    }).finally(() => {
      setLoading(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    load();
    setRefreshing(false);
  };

  const groupClassrooms = (classrooms) => {
    return classrooms.reduce((acc, room) => {
        const building =
            room.includes('Amfi') ? t('amphitheater') :
            room.startsWith('MTFS') ? t('facultyOfArchitectureAndDesignBuilding') :
            room.startsWith('TM') ? 'TM' :
            room.startsWith('ST') ? 'ST' :
            room.startsWith('Y') ? 'YDB' :
            t('other');
      if (!acc[building]) acc[building] = [];
      acc[building].push(room);
      return acc;
    }, {});
  };

  const filteredClassrooms = emptyClassrooms.map(dayClassrooms =>
      dayClassrooms.filter(room => room.toLowerCase().includes(search.toLowerCase()))
  );

  const navigateToCurrentDayAndHour = () => {
    const currentDayIndex = new Date().getDay() - 1;
    const currentHour = new Date().getHours();
    const currentTimeSlotIndex = timeSlots.findIndex(slot => {
      const [startHour] = slot.split(' - ')[0].split(':');
      return parseInt(startHour) <= currentHour && currentHour < parseInt(startHour) + 1;
    });

    setSelectedDay(currentDayIndex);
    const index = currentDayIndex * timeSlots.length + currentTimeSlotIndex;
    setTargetIndex(index);
  };

  useEffect(() => {
    if (targetIndex !== null && yValues[targetIndex] !== 0) {
      scrollViewRef.current.scrollTo({y: yValues[targetIndex], animated: true});
      setTargetIndex(null);
    }
  }, [yValues, targetIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton onPress={navigateToCurrentDayAndHour} text={t("Go to current time")} />
      ),
    });
  }, [navigation, t, navigateToCurrentDayAndHour]);

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <ScrollView
        ref={scrollViewRef}
        style={[styles.container, {backgroundColor: theme.colors.background}]}
        contentContainerStyle={{paddingBottom: 100}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
    >
      <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={t("search...")}
          style={styles.searchBar}
      />
      {days.map((day, dayIndex) => (
        <View key={dayIndex} style={[styles.dayContainer, {backgroundColor: theme.colors.surface}]}>
          <TouchableOpacity
              onPress={() => setSelectedDay(selectedDay === dayIndex ? null : dayIndex)}
              style={styles.dayHeader}
          >
            <Text style={[styles.dayText, {color: theme.colors.primaryText}]}>
              {day}
            </Text>
            <Icon
                name={selectedDay === dayIndex ? 'expand-less' : 'expand-more'}
                size={24}
                color={theme.colors.primary}
            />
          </TouchableOpacity>
          {selectedDay === dayIndex &&
            timeSlots.map((timeSlot, timeIndex) => {
              const classrooms = filteredClassrooms[dayIndex * timeSlots.length + timeIndex] || [];
              const rooms = groupClassrooms(classrooms);
              return (
                <View key={timeIndex} onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  setYValues(prevYValues => {
                    const newYValues = [...prevYValues];
                    newYValues[dayIndex * timeSlots.length + timeIndex] = layout.y;
                    return newYValues;
                  });
                }} style={[styles.timeSlotContainer, {borderTopColor: theme.colors.border}]}>
                  <Text style={[styles.timeSlotText, {color: theme.colors.primaryText}]}>
                    {timeSlot}
                  </Text>
                  {classrooms.length === 0 ? (
                    <Text style={[styles.noClassroomsText, {color: theme.colors.secondaryText}]}>
                      {t("noEmptyClassroomsAvailable")}
                    </Text>
                  ) : (
                    Object.entries(rooms).map(([building, rooms]) => (
                      <View key={building} style={[styles.buildingSection, {backgroundColor: theme.colors.background}]}>
                        <Text style={[styles.buildingText, {color: theme.colors.primaryText}]}>
                          {building}
                        </Text>
                        <Text style={[styles.roomsText, {color: theme.colors.secondaryText}]}>
                          {rooms.join(' • ')}
                        </Text>
                      </View>
                    ))
                  )}
                </View>
              );
            })
          }
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
  },
  dayContainer: {
    marginVertical: 6,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timeSlotContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  timeSlotText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buildingSection: {
    marginTop: 8,
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  buildingText: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  roomsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noClassroomsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default EmptyClassrooms;
