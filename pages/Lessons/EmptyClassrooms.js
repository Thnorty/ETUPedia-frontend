import backend from '../../utils/Backend';
import {useTheme} from '../../utils/Theme';
import {View, Text, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import Loading from '../../components/Loading';

const EmptyClassrooms = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const [emptyClassrooms, setEmptyClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => t(day));
  const timeSlots = [
    "8:30 - 9:20", "9:30 - 10:20", "10:30 - 11:20", "11:30 - 12:20",
    "12:30 - 13:20", "13:30 - 14:20", "14:30 - 15:20", "15:30 - 16:20",
    "16:30 - 17:20", "17:30 - 18:20", "18:30 - 19:20", "19:30 - 20:20",
    "20:30 - 21:20", "21:30 - 22:20"
  ];

  const getTimeString = (time) => {
    const day = time % days.length;
    const hour = Math.floor(time / days.length);
    return `${days[day]} ${timeSlots[hour]}`;
  };

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
  }

  const onRefresh = () => {
    setRefreshing(true);
    load();
    setRefreshing(false);
  }

  const groupClassrooms = (classrooms, time) => {
    return {
      timeString: getTimeString(time),
      rooms: classrooms.reduce((acc, room) => {
        const building = room.includes('Amfi') ? t('amphitheater') :
            room.startsWith('TM') ? 'TM' :
            room.startsWith('ST') ? 'ST' :
            room.startsWith('Y') ? 'YDB' : t('other');
        if (!acc[building]) acc[building] = [];
        acc[building].push(room);
        return acc;
      }, {})
    };
  };

  if (loading) return <Loading loadingError={loadingError} onRetry={load} />;

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
        />
      }
    >
      {emptyClassrooms.map((classrooms, time) => {
        const {timeString, rooms} = groupClassrooms(classrooms, time);
        return (
          <View
              key={time}
              style={[styles.timeSlotContainer, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border
              }]}
          >
            <Text style={[styles.timeSlotText, {
              color: theme.colors.primaryText
            }]}>
              {timeString}
            </Text>
            {Object.entries(rooms).map(([building, rooms]) => (
                <View key={building}>
                  <Text style={[
                    styles.buildingText,
                    {color: theme.colors.primaryText}
                  ]}>
                    {building}
                  </Text>
                  <Text style={[
                    styles.roomsText,
                    {color: theme.colors.secondaryText}
                  ]}>
                    {rooms.join(', ')}
                  </Text>
                </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  timeSlotContainer: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 5,
    borderWidth: 1,
  },
  timeSlotText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buildingText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  roomsText: {
    fontSize: 14,
    marginTop: 4,
  }
});

export default EmptyClassrooms;
