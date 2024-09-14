import {t} from "i18next";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Modal from "../../components/Modal";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useTheme} from "../../utils/Theme";
import Alert from "../../components/Alert";

export const showCommentOptions = (showActionSheetWithOptions, theme, handleEdit, handleDelete) => {
  showActionSheetWithOptions(
    {
      options: [t("editComment"), t("deleteComment")],
      icons: [
        <FontAwesomeIcon icon={faPen} size={20} color={theme.colors.secondaryText} />,
        <FontAwesomeIcon icon={faTrash} size={20} color={theme.colors.error} />,
      ],
      destructiveColor: theme.colors.error,
      destructiveButtonIndex: 1,
      cancelButtonIndex: 2,
      tintColor: theme.colors.primaryText,
      title: t("commentOptions"),
      titleTextStyle: {color: theme.colors.secondaryText},
      containerStyle: {backgroundColor: theme.colors.surface},
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          handleEdit();
          break;
        case 1:
          handleDelete();
          break;
      }
    }
  );
}

export const EditCommentModal = ({isOpen, setIsOpen, selectedComment, handleRefresh}) => {
  const theme = useTheme();
  const [content, setContent] = useState(selectedComment ? selectedComment.content : '');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setContent(selectedComment ? selectedComment.content : '');
  }, [selectedComment]);

  const closeModal = () => {
    setIsOpen(false);
  }

  const clearFields = () => {
    setContent(selectedComment ? selectedComment.content : '');
    setErrors([]);
  }

  const handleSave = () => {
    backend.post("posts/edit-comment/", {
      comment_id: selectedComment.id,
      content: content,
    }).then(() => {
      handleRefresh();
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

    handleSave();
    closeModal();
  }

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => closeModal()}
      onModalHide={() => clearFields()}
    >
      <View style={[styles.modal, {backgroundColor: theme.colors.surface}]}>
        <Text style={[styles.modalTitle, {color: theme.colors.primaryText}]}>{t("editComment")}</Text>
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
            <Text style={{color: theme.colors.primary}}>{t("save")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export const DeleteCommentAlert = ({isOpen, setIsOpen, selectedComment, handleRefresh}) => {
  const theme = useTheme();

  const deleteComment = () => {
    backend.post("posts/delete-comment/", {
      comment_id: selectedComment.id,
    }).then(() => {
      handleRefresh();
    }).catch((error) => {
      console.error(error);
    });
  }

  const buttons = [
    {
      text: t("cancel"),
      onPress: () => setIsOpen(false),
    },
    {
      text: t("delete"),
      onPress: () => {
        setIsOpen(false);
        deleteComment();
      },
      style: {color: theme.colors.error},
    },
  ];

  return (
    <Alert
      title={t("deleteComment")}
      message={t("deleteCommentConfirmation")}
      buttons={buttons}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}

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
