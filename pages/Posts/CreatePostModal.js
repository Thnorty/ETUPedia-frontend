import {useTranslation} from "react-i18next";
import {Button, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {useState} from 'react';

const CreatePostModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const {t} = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const clearFields = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}
    >
      <TouchableWithoutFeedback onPress={() => {
        setIsOpen(false);
        clearFields();
      }}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>{t("createPost")}</Text>
              <TextInput
                style={styles.input}
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
              <View style={styles.buttonContainer}>
                <View style={styles.cancelButton}>
                  <Button
                    title={t("cancel")}
                    color={"#b1274e"}
                    onPress={() => {
                      setIsOpen(!isOpen);
                      clearFields();
                    }}
                  />
                </View>
                <Button
                  title={t("submit")}
                  onPress={() => {
                    onSubmit(title, content);
                    clearFields();
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  },
  contentInput: {
    height: 100,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  cancelButton: {
    marginRight: 10,
  }
});

export default CreatePostModal;
