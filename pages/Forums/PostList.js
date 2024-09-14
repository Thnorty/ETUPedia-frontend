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
import MultiSelect from "../../components/MultiSelect";
import {useActionSheet} from "@expo/react-native-action-sheet";
import Alert from "../../components/Alert";
import EditPostModal from "./EditPostModal";

const PostList = ({navigation}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {showActionSheetWithOptions} = useActionSheet();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postList, setPostList] = useState([]);
  const [search, setSearch] = useState('');
  const [isPostCreateModalOpen, setIsPostCreateModalOpen] = useState(false);
  const [filteredPostList, setFilteredPostList] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loadingError, setLoadingError] = useState(false);
  const [isPostEditModalOpen, setIsPostEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    backend.get("posts/get-topics/")
      .then((response) => {
        setTopics(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setFilteredPostList(
      postList.filter(post =>
        (post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())) &&
        (selectedTopics.length === 0 || selectedTopics.includes(post.topic.name))
      )
    );
  }, [theme, search, selectedTopics, postList]);

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

  const deletePost = (postID) => {
    backend.post("posts/delete-post/", {
      post_id: postID,
    }).then(() => {
      handleRefresh();
    }).catch((error) => {
      console.error(error);
    });
    setPostToDelete(null);
  }

  const showPostSettingsOptions = (postID) => {
    const options = [t("editPost"), t("deletePost")];
    const cancelButtonIndex = options.length;
    const tintColor = theme.colors.primaryText;
    const title = t("postSettings");
    const titleTextStyle = {color: theme.colors.secondaryText};
    const destructiveButtonIndex = 1;
    const containerStyle = {backgroundColor: theme.colors.surface};
    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      tintColor,
      title,
      titleTextStyle,
      destructiveButtonIndex,
      containerStyle,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          const post = postList.find(post => post.id === postID);
          setPostToEdit(post);
          setIsPostEditModalOpen(true);
          break;
        case 1:
          setIsDeleteAlertOpen(true);
          setPostToDelete(postID);
          break;
      }
    });
  }

  const deleteAlertButtons = [
    {
      text: t("cancel"),
      onPress: () => setIsDeleteAlertOpen(false),
    },
    {
      text: t("delete"),
      onPress: () => {
        setIsDeleteAlertOpen(false);
        deletePost(postToDelete);
      },
      style: {color: "#c30000"},
    },
  ];

  const PostItem = memo(({ item, navigation }) => (
    <TouchableOpacity style={[styles.postContainer, {backgroundColor: theme.colors.surface}]} onPress={() => navigation.navigate("ForumDetailIndex", {
      forumTitle:item.title, forumID: item.id,
      handleRefreshPostList: handleRefresh,
      updatePostLikeStatus: updatePostLikeStatus,
    })}>
      <View style={styles.postHeader}>
        <Text style={[styles.postTopic, {color: theme.colors.secondaryText}]}>{t(item.topic.name)} • {item.author_name}</Text>
        {item.is_owner &&
          <TouchableOpacity onPress={() => showPostSettingsOptions(item.id)}>
            <Icon name="ellipsis-v" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        }
      </View>
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
          <View style={styles.topContainer}>
            <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} style={styles.searchBar} />
            <MultiSelect placeholder={t("topics")} options={topics.map(topic => topic.name)} value={selectedTopics} onChange={setSelectedTopics}
                         buttonStyle={[styles.multiSelect, {backgroundColor: theme.colors.surface}]} placeholderStyle={{color: theme.colors.secondaryText}} />
          </View>
        }
      />
      <TouchableOpacity style={[styles.createPostButton, {backgroundColor: theme.colors.primary}]} onPress={() => setIsPostCreateModalOpen(true)}>
        <Text style={[styles.createPostButtonText, {color: theme.colors.primaryText}]}>{'+ ' + t("post")}</Text>
      </TouchableOpacity>
      <CreatePostModal topics={topics} isOpen={isPostCreateModalOpen} setIsOpen={setIsPostCreateModalOpen} handleRefresh={handleRefresh} setLoading={setLoading} />
      <EditPostModal topics={topics} post={postToEdit} isOpen={isPostEditModalOpen} setIsOpen={setIsPostEditModalOpen} handleRefresh={handleRefresh} setLoading={setLoading} />
      <Alert title={t("deletePost")} message={t("deletePostConfirmation")} buttons={deleteAlertButtons} isOpen={isDeleteAlertOpen} setIsOpen={setIsDeleteAlertOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  topContainer: {
    flexDirection: "row",
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  multiSelect: {
    flex: 1,
    borderRadius: 6,
    marginVertical: 10,
    width: 150
  },
  postContainer: {
    padding: 15,
    marginVertical: 8,
    marginBottom: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
