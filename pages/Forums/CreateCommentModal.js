import {useTranslation} from "react-i18next";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from 'react';
import Modal from "../../components/Modal";
import {useTheme} from "../../utils/Theme";
import backend from "../../utils/Backend";

const CreateCommentModal = ({ isOpen, setIsOpen, handleLoad, forumID }) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  const closeModal = () => {
    setIsOpen(false);
  }

  const clearFields = () => {
    setContent("");
    setErrors([]);
  };

  const handleCreate = (content) => {
    backend.post("posts/create-comment/", {
      forum_id: forumID,
      content: content
    }).then(() => {
      handleLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleSubmit = () => {
    let errors = [];
    if (!content)
      errors.push(t("content") + " " + t("required").toLowerCase() + ".");

    setErrors(errors);
    if (errors.length) return;

    handleCreate(content);
    closeModal();
  }

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => closeModal()}
      onModalHide={() => clearFields()}
    >
      <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.modalTitle, {color: theme.colors.primaryText}]}>{t("writeComment")}</Text>
        <TextInput
          style={[styles.contentInput, {color: theme.colors.primaryText, borderColor: theme.colors.border}]}
          placeholderTextColor={theme.colors.secondaryText}
          placeholder={t("content")}
          maxLength={500}
          multiline={true}
          value={content}
          onChangeText={setContent}
        />
        {errors.length > 0 &&
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={[styles.errorText, {color: theme.colors.error}]}>{error}</Text>
            ))}
          </View>
        }
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={closeModal} style={styles.bottomButton}>
            <Text style={{color: theme.colors.error}}>{t("cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.bottomButton}>
            <Text style={{color: theme.colors.primary}}>{t("submit")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modal: {
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentInput: {
    height: 100,
    width: "100%",
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
    fontSize: 14,
    marginBottom: 5,
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

export default CreateCommentModal;
