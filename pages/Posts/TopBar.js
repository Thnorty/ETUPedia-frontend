import {useTranslation} from "react-i18next";
import {StyleSheet, View, Button, Modal, TextInput, TouchableWithoutFeedback, Text} from "react-native";
import {useState} from 'react';
import CreatePostModal from "./CreatePostModal";
import backend from "../../utils/backend";

const TopBar = ({ setLoading, refreshPostList }) => {
  const {t} = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onPostCreate = (title, content) => {
    setIsOpen(false);
    backend.post("posts/create-post/", {
      title: title,
      content: content
    }).then((response) => {
      setLoading(true);
      refreshPostList();
    }).catch((error) => {
      console.error(error);
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title={t("createPost")}
        onPress={() => setIsOpen(true)}
        color={"#841584"}
      />
      <CreatePostModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onPostCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
});

export default TopBar;
