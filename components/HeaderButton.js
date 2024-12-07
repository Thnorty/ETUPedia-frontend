import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useTheme} from '../utils/Theme';

const HeaderButton = ({onPress, text}) => {
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
        <Text style={[styles.text, {color: theme.colors.primaryText}]}>
          {text}
        </Text>
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
