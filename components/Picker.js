import {StyleSheet, TouchableOpacity, View} from "react-native";
import Modal from "./Modal";
import {Text} from "react-native";
import {useState} from "react";
import {useTheme} from "../utils/Theme";
import Icon from "react-native-vector-icons/FontAwesome";

const Picker = ({ placeholder, options, value, onChange, buttonStyle, placeholderStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  return (
    <View>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={() => setIsOpen(true)}>
        <Text style={[styles.buttonText, !value && placeholderStyle, value && {color: theme.colors.primaryText}]}>{value || placeholder}</Text>
        <Icon name="caret-down" size={20} color={theme.colors.secondaryText} />
      </TouchableOpacity>
      <Modal isVisible={isOpen} onBackdropPress={() => setIsOpen(false)}>
        <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.modalTitle, {color: theme.colors.secondaryText}]}>{placeholder}</Text>
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => {
              onChange(option);
              setIsOpen(false);
            }}
            >
              <Text style={[styles.option, {color: theme.colors.primaryText}]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: 100,
  },
  buttonText: {
    flex: 1,
  },
  modal: {
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  option: {
    fontSize: 16,
    marginTop: 15,
  }
});

export default Picker;
