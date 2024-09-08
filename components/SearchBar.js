import {StyleSheet, TextInput, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {useTheme} from "../utils/Theme";

const SearchBar = ({ value, onChangeText, placeholder, style }) => {
  const theme = useTheme();

  return (
    <View style={[{backgroundColor: theme.colors.surface}, styles.searchBar, style]}>
      <Icon name="search" size={20} color={theme.colors.secondaryText} />
      <TextInput
        style={[styles.input, {color: theme.colors.primaryText}]}
        placeholderTextColor={theme.colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});

export default SearchBar;
