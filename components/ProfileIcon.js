import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Shadow} from "react-native-shadow-2";
import {useTheme} from "../utils/Theme";
import {getTextColor} from "../utils/colorUtils";

const ProfileIcon = ({ user, onPress, size, fontSize, style }) => {
  const theme = useTheme();
  const isDisabled = !onPress;
  const backgroundColor = user.color || "white";
  const textColor = getTextColor(backgroundColor);

  return (
    <View style={[styles.container, style]}>
      <Shadow distance={5}>
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
      </Shadow>
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
    borderWidth: 1.5,
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
