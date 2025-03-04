import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useTheme} from "../utils/Theme";
import {getTextColor} from "../utils/ColorUtils";

const ProfileIcon = ({ user, onPress, size, fontSize, style }) => {
  const theme = useTheme();
  const isDisabled = !onPress;
  const backgroundColor = user.color;
  const textColor = getTextColor(backgroundColor);

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.profileButton,
          {
            backgroundColor: user.color || "white",
            borderColor: theme.colors.border,
            width: size,
            height: size,
          }
        ]}
        disabled={isDisabled}
      >
        <Text style={[styles.profileText, {color: textColor, fontSize: fontSize}]}>
          {user.name.slice(0, 1)+user.surname.slice(0, 1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    elevation: 5,
  },
  profileText: {
    textAlign: 'center',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default ProfileIcon;
