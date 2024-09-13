import {useTheme} from "../utils/Theme";
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import Modal from "./Modal";


const Alert = ({title, message, buttons, isOpen, setIsOpen}) => {
  const theme = useTheme();

  return (
    <Modal isVisible={isOpen} onBackdropPress={() => setIsOpen(false)}>
      <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.title, {color: theme.colors.primaryText}]}>{title}</Text>
        <Text style={[styles.message, {color: theme.colors.secondaryText}]}>{message}</Text>
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity key={index} onPress={() => {
              setIsOpen(false);
              button.onPress();
            }}>
              <Text style={[styles.button, {color: theme.colors.primaryText}, button.style]}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    marginTop: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    padding: 10,
    marginLeft: 10,
  },
});

export default Alert;
