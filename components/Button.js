import {StyleSheet, TouchableOpacity, Text} from "react-native";
import {useTheme} from "../utils/Theme";

const Button = ({title, onPress, style, textStyle}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[{backgroundColor: theme.colors.primary, borderColor: theme.colors.border}, styles.button, style]}>
      <Text style={[{color: theme.colors.primaryText}, styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default Button;
