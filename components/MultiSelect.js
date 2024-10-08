import {useTranslation} from "react-i18next";
import {StyleSheet, TouchableOpacity, View, Text, ScrollView} from "react-native";
import Modal from "./Modal";
import {useTheme} from "../utils/Theme";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {faSquare, faSquareCheck} from "@fortawesome/free-regular-svg-icons";

const MultiSelect = ({ placeholder, options, value, onChange, buttonStyle, placeholderStyle }) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(value || []);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleApply = () => {
    onChange(selectedOptions);
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedOptions(value || []);
  }

  return (
    <View>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={() => setIsOpen(true)}>
        <Text style={[styles.buttonText, !value && placeholderStyle, value && {color: theme.colors.primaryText}]}>
          {placeholder}{value.length > 0 ? ` (${value.length})` : ""}
        </Text>
        <FontAwesomeIcon icon={faCaretDown} size={20} color={theme.colors.secondaryText} />
      </TouchableOpacity>
      <Modal isVisible={isOpen} onBackdropPress={closeModal}>
        <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
          <Text style={[styles.modalTitle, {color: theme.colors.secondaryText}]}>{placeholder}</Text>
          <ScrollView>
            {options.map((option, index) => (
              <TouchableOpacity key={index} style={styles.optionContainer} onPress={() => toggleOption(option)}>
                <Text style={[styles.option, {color: theme.colors.primaryText}]}>{option}</Text>
                <FontAwesomeIcon icon={selectedOptions.includes(option) ? faSquareCheck : faSquare} size={20} color={theme.colors.primaryText} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={closeModal} style={styles.bottomButton}>
              <Text style={{color: theme.colors.error}}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApply} style={styles.bottomButton}>
              <Text style={{color: theme.colors.primary}}>{t("apply")}</Text>
            </TouchableOpacity>
          </View>
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
    elevation: 5,
    marginHorizontal: 10,
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
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  option: {
    fontSize: 16,
  },
  applyButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 10,
  },
  bottomButton: {
    padding: 10,
    marginLeft: 10,
  },
});

export default MultiSelect;
