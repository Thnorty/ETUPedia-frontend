import {StyleSheet, Text, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {useTheme} from "../utils/Theme";

const InfoCard = ({icon, label, value}) => {
  const theme = useTheme();
  return (
    <View style={[styles.card, {backgroundColor: theme.colors.surface}]}>
      <View style={styles.infoRow}>
        <FontAwesomeIcon icon={icon} size={20} color={theme.colors.primaryText} />
        <Text style={[styles.label, {color: theme.colors.primaryText}]}>{label}:</Text>
        <Text style={[styles.value, {color: theme.colors.secondaryText}]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 10,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    marginLeft: 5,
    flex: 2,
  },
});

export default InfoCard;
