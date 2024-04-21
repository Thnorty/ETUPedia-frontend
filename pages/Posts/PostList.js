import {useTranslation} from "react-i18next";
import backend from "../../utils/backend";
import {memo, useEffect, useState} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../../components/Loading";

const PostList = ({navigation}) => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [postList, setPostList] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPostList, setFilteredPostList] = useState([]);

  useEffect(() => {
    backend.get("posts/get-posts/")
      .then((response) => {
        setPostList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredPostList(
      postList.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, postList]);

  const PostItem = memo(({ item, navigation }) => (
    <View>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate("PostDetailIndex", {postId: item.id})}>
        <Text>{item.author_name}</Text>
        <Text>{item.title}</Text>
        <Text>{item.content}</Text>
        <Text>{item.created_at}</Text>
      </TouchableOpacity>
    </View>
  ));

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder={t("search...")}
        />
      </View>
      <FlatList
        data={filteredPostList}
        renderItem={({ item }) => <PostItem item={item} navigation={navigation} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    backgroundColor: "#f9c2ff",
  },
});

export default PostList;
