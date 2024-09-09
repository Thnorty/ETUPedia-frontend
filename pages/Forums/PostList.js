import {useTranslation} from "react-i18next";
import backend from "../../utils/Backend";
import {memo, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View, RefreshControl} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import CreatePostModal from "./CreatePostModal";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";

const PostList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postList, setPostList] = useState([]);
  const [search, setSearch] = useState('');
  const [isPostCreateModalOpen, setIsPostCreateModalOpen] = useState(false);
  const [filteredPostList, setFilteredPostList] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    setFilteredPostList(
      postList.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [theme, search, postList]);

  const onPostCreate = (topicOrder, title, content) => {
    backend.post("posts/create-post/", {
      topic_order: topicOrder,
      title: title,
      content: content
    }).then(() => {
      setLoading(true);
      handleRefresh();
    }).catch((error) => {
      console.error(error);
    });
  }

  const likePost = (postID) => {
    const newPostList = postList.map(post => {
      if (post.id === postID) {
        post.likes += post.liked ? -1 : 1;
        post.liked = !post.liked;
      }
      return post;
    });
    setPostList(newPostList);

    const payload = {
      forum_id: postID,
    };
    backend.post("posts/like-post/", payload)
      .catch((error) => {
        console.error(error);
      });
  }

  const updatePostLikeStatus = (postID, liked) => {
    const newPostList = postList.map(post => {
      if (post.id === postID) {
        post.liked = liked;
        post.likes += liked ? 1 : -1;
      }
      return post;
    });
    setPostList(newPostList);
  }

  const handleRefresh = () => {
    setRefreshing(true);
    setLoadingError(false);
    backend.get("posts/get-posts/")
      .then((response) => {
        setPostList(response.data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingError(true);
        setRefreshing(false);
      });
  }

  const PostItem = memo(({ item, navigation }) => (
    <TouchableOpacity style={[styles.postContainer, {backgroundColor: theme.colors.surface}]} onPress={() => navigation.navigate("ForumDetailIndex", {
      forumTitle:item.title, forumID: item.id,
      handleRefreshPostList: handleRefresh,
      updatePostLikeStatus: updatePostLikeStatus,
    })}>
      <Text style={[styles.postTopic, {color: theme.colors.secondaryText}]}>{item.topic} • {item.author_name}</Text>
      <Text style={[styles.postTitle, {color: theme.colors.primaryText}]}>{item.title}</Text>
      <Text style={[styles.postContent, {color: theme.colors.primaryText}]}>{item.content}</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.likeButton} onPress={() => likePost(item.id)}>
          <Icon name={item.liked ? "heart": "heart-o"} size={20} color={item.liked ? "#c30000" : theme.colors.secondaryText} />
          <Text style={[styles.likeText, {color: theme.colors.secondaryText}]}>{item.likes}</Text>
        </TouchableOpacity>
        <Text style={[styles.postDate, {color: theme.colors.secondaryText}]}>{item.created_at}</Text>
      </View>
    </TouchableOpacity>
  ));

  if (loading) return <Loading loadingError={loadingError} onRetry={handleRefresh} />

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlashList
        data={filteredPostList}
        renderItem={({ item }) => <PostItem item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postsList}
        estimatedItemSize={100}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} />
        }
      />
      <TouchableOpacity style={[styles.createPostButton, {backgroundColor: theme.colors.primary}]} onPress={() => setIsPostCreateModalOpen(true)}>
        <Text style={[styles.createPostButtonText, {color: theme.colors.primaryText}]}>{'+ ' + t("post")}</Text>
      </TouchableOpacity>
      <CreatePostModal isOpen={isPostCreateModalOpen} setIsOpen={setIsPostCreateModalOpen} onSubmit={onPostCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  postContainer: {
    padding: 15,
    marginVertical: 8,
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  postTopic: {
    fontSize: 14,
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  postDate: {
    fontSize: 12,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    marginLeft: 5,
    fontSize: 16,
  },
  postsList: {
    paddingBottom: 70,
  },
  createPostButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  createPostButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostList;
