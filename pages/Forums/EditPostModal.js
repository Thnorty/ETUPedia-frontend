import {useTheme} from "../../utils/Theme";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Modal from "../../components/Modal";
import {TextInput, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import Picker from "../../components/Picker";
import {useTranslation} from "react-i18next";

const EditPostModal = ({ post, topics, isOpen, setIsOpen, handleRefresh, setLoading }) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [selectedTopicOrder, setSelectedTopicOrder] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setSelectedTopicOrder(post ? post.topic.order : null);
    setTitle(post ? post.title : '');
    setContent(post ? post.content : '');
  }, [post]);

  const closeModal = () => {
    setIsOpen(false);
  }

  const clearFields = () => {
    setSelectedTopicOrder(post ? post.topic.order : null);
    setTitle(post ? post.title : '');
    setContent(post ? post.content : '');
    setErrors([]);
  }

  const handleSave = () => {
    backend.post("posts/edit-post/", {
      post_id: post.id,
      topic_order: selectedTopicOrder,
      title: title,
      content: content,
    }).then(() => {
      setLoading(true);
      handleRefresh();
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleSubmit = () => {
    let errors = [];
    if (selectedTopicOrder === null)
      errors.push(t("topic") + " " + t("required").toLowerCase() + ".");
    if (!title)
      errors.push(t("title") + " " + t("required").toLowerCase() + ".");
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
        <Text style={[styles.modalTitle, {color: theme.colors.primaryText}]}>{t("editPost")}</Text>
        <Picker
          buttonStyle={[styles.picker, {borderColor: theme.colors.border}]}
          placeholderStyle={{color: theme.colors.secondaryText}}
          options={topics.map(topic => topic.name)}
          value={topics[selectedTopicOrder]?.name}
          onChange={(selectedName) => {
            const selectedTopic = topics.find(topic => topic.name === selectedName);
            setSelectedTopicOrder(selectedTopic ? selectedTopic.order : null);
          }}
          placeholder={t("topic")}
        />
        <TextInput
          style={[styles.titleInput, {color: theme.colors.primaryText, borderColor: theme.colors.border}]}
          placeholderTextColor={theme.colors.secondaryText}
          placeholder={t("title")}
          maxLength={100}
          value={title}
          onChangeText={setTitle}
        />
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
  picker: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  titleInput: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
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

export default EditPostModal;