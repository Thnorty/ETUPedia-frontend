import {useTranslation} from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../../components/Button";
import {useEffect, useRef, useState} from 'react';
import Modal from "../../components/Modal";
import backend from "../../utils/Backend";
import {Picker} from "@react-native-picker/picker";

const CreatePostModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const {t} = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopicOrder, setSelectedTopicOrder] = useState(0);
  const [errors, setErrors] = useState([]);
  const pickerRef = useRef();

  useEffect(() => {
    backend.get("posts/get-topics/")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const closeModal = () => {
    setIsOpen(false);
  }

  const clearFields = () => {
    setSelectedTopicOrder(0);
    setTitle("");
    setContent("");
    setErrors([]);
  };

  const handleSubmit = () => {
    let errors = [];
    if (!selectedTopicOrder)
      errors.push(t("topic") + " " + t("required").toLowerCase() + ".");
    if (!title)
      errors.push(t("title") + " " + t("required").toLowerCase() + ".");
    if (!content)
      errors.push(t("content") + " " + t("required").toLowerCase() + ".");

    setErrors(errors);
    if (errors.length) return;

    onSubmit(selectedTopicOrder-1, title, content);
    closeModal();
  }

  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={() => closeModal()}
      onModalHide={() => clearFields()}
    >
      <View style={styles.modal}>
        <Text style={styles.modalTitle}>{t("createPost")}</Text>
        <TouchableOpacity style={styles.topicPicker} onPress={() => pickerRef.current.focus()} activeOpacity={1}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedTopicOrder}
            onValueChange={(itemValue, itemIndex) => setSelectedTopicOrder(itemValue)}
            style={styles.picker} enabled={false} dropdownIconColor={"black"}
          >
            <Picker.Item label={t("selectTopic")} value={0} style={{fontSize: 14, color: "#686868"}} enabled={false} />
            {topics.map((topic) => (
              <Picker.Item key={topic.order+1} label={t(topic.name)} value={topic.order+1} style={{fontSize: 14, color: "black"}} />
            ))}
          </Picker>
        </TouchableOpacity>
        <TextInput
          style={styles.titleInput}
          placeholder={t("title")}
          maxLength={100}
          value={title}
          onChangeText={setTitle}
        />
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
  topicPicker: {
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    position: 'absolute',
    top: -6,
    left: -8,
    right: 0,
    bottom: 0,
  },
  titleInput: {
    height: 40,
    width: "100%",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
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

export default CreatePostModal;
