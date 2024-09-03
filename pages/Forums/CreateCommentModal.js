import {useTranslation} from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import Button from "../../components/Button";
import {useState} from 'react';
import Modal from "../../components/Modal";

const CreateCommentModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const {t} = useTranslation();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const closeModal = () => {
    setIsOpen(false);
  }

  const clearFields = () => {
    setContent("");
    setErrors([]);
  };

  const handleSubmit = () => {
    let errors = [];
    if (!content)
      errors.push(t("content") + " " + t("required").toLowerCase() + ".");

    setErrors(errors);
    if (errors.length) return;

    onSubmit(content);
    closeModal();
  }

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => closeModal()}
      onModalHide={() => clearFields()}
    >
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{t("writeComment")}</Text>
        <TextInput
          style={styles.contentInput}
          placeholder={t("content")}
          maxLength={500}
          multiline={true}
          value={content}
          onChangeText={setContent}
        />
        {errors.length > 0 &&
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>{error}</Text>
            ))}
          </View>
        }
        <View style={styles.buttonContainer}>
          <Button
            title={t("cancel")}
            style={styles.modalButton}
            textStyle={{color: "black"}}
            onPress={() => closeModal()}
          />
          <Button
            title={t("submit")}
            style={styles.modalButton}
            textStyle={{color: "black"}}
            onPress={() => handleSubmit()}
          />
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentInput: {
    height: 100,
    width: "100%",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
    textAlignVertical: 'top',
  },
  errorContainer: {
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#e1dede',
    borderColor: '#9e9e9e',
    borderWidth: 1.5,
  },
});

export default CreateCommentModal;
