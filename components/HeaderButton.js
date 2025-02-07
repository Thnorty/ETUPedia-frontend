import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../utils/Theme';

const HeaderButton = ({onPress, text, icon}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {icon && <View style={text ? {marginRight: 8} : {}}>{icon}</View>}
      {text && <Text style={[styles.text, {color: theme.colors.primaryText}]}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HeaderButton;
