import {useTranslation} from "react-i18next";
import {Dimensions, StatusBar, StyleSheet, Text, TextInput, View} from "react-native";
import Button from "../../components/Button";
import {useState} from 'react';
import Modal from "react-native-modal";

const CreatePostModal = ({ isOpen, setIsOpen, onSubmit }) => {
  const {t} = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const deviceHeight = StatusBar.currentHeight + Dimensions.get('window').height;

  const clearFields = () => {
    setTitle("");
    setContent("");
  };

  return (
    <Modal
      isVisible={isOpen}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationOutTiming={500}
      backdropOpacity={0.5}
      statusBarTranslucent={true}
      deviceHeight={deviceHeight}
      onBackdropPress={() => {
        setIsOpen(!isOpen);
        clearFields();
      }}
    >
      <View style={styles.modal}>
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
          <Button
            title={t("cancel")}
            style={styles.modalButton}
            textStyle={{color: "black"}}
            onPress={() => {
              setIsOpen(!isOpen);
              clearFields();
            }}
          />
          <Button
            title={t("submit")}
            style={styles.modalButton}
            textStyle={{color: "black"}}
            onPress={() => {
              onSubmit(title, content);
              clearFields();
            }}
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
  input: {
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
