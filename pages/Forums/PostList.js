import {useTranslation} from "react-i18next";
import backend from "../../utils/Backend";
import {memo, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View, RefreshControl} from "react-native";
import Loading from "../../components/Loading";
import {FlashList} from "@shopify/flash-list";
import CreatePostModal from "./CreatePostModal";
import {useTheme} from "../../utils/Theme";
import SearchBar from "../../components/SearchBar";
import MultiSelect from "../../components/MultiSelect";
import {useActionSheet} from "@expo/react-native-action-sheet";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faEllipsisVertical, faHeart, faPen} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartO, faComment} from "@fortawesome/free-regular-svg-icons";
import {showPostOptions, EditPostModal, DeletePostAlert} from "./PostOptions";
import Picker from "../../components/Picker";

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
  const [isPostDeleteAlertOpen, setIsPostDeleteAlertOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostSortOption, setSelectedPostSortOption] = useState("hot");

  const postSortOptions = ["new", "hot", "top"];

  useEffect(() => {
    handleRefresh();
  }, [selectedPostSortOption]);

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
        (selectedTopics.length === 0 || selectedTopics.includes(t(post.topic.name)))
      )
    );
  }, [theme, search, selectedTopics, postList]);

  const handlePostLikeButton = (postID) => {
    let isLiked = false;
    const newPostList = postList.map(post => {
      if (post.id === postID) {
        isLiked = post.liked;
        post.likes += post.liked ? -1 : 1;
        post.liked = !post.liked;
      }
      return post;
    });
    setPostList(newPostList);

    const payload = {
      post_id: postID,
    };
    const endpoint = isLiked ? "posts/dislike-post/" : "posts/like-post/";
    backend.post(endpoint, payload)
      .catch((error) => {
        console.error(error);
      });
  };

  const updatePostLikeStatus = (postID, liked) => {
    const newPostList = postList.map(post => {
      if (post.id === postID) {
        post.liked = liked;
        post.likes += liked ? 1 : -1;
      }
      return post;
    });
    setPostList(newPostList);
  };

  const handleRefresh = () => {
    setSelectedPost(null);
    setRefreshing(true);
    setLoadingError(false);
    const payload = {
      sort_by: selectedPostSortOption,
    }
    backend.post("posts/get-posts/", payload)
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
  };

  const PostItem = memo(({ item, navigation }) => (
    <TouchableOpacity style={[styles.postContainer, {backgroundColor: theme.colors.surface}]} onPress={() => navigation.navigate("ForumDetailIndex", {
      postTitle:item.title, postID: item.id,
      handleRefreshPostList: handleRefresh,
      updatePostLikeStatus: updatePostLikeStatus,
    })}>
      <View style={styles.postHeader}>
        <Text style={[styles.postTopic, {color: theme.colors.secondaryText}]}>{t(item.topic.name)} • {item.author_name}</Text>
        {item.is_owner &&
          <TouchableOpacity onPress={() => {
            setSelectedPost(item);
            showPostOptions(showActionSheetWithOptions, theme,
              () => setIsPostEditModalOpen(true),
              () => setIsPostDeleteAlertOpen(true)
            );
          }}>
            <FontAwesomeIcon icon={faEllipsisVertical} size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        }
      </View>
      <Text style={[styles.postTitle, {color: theme.colors.primaryText}]}>{item.title}</Text>
      <Text style={[styles.postContent, {color: theme.colors.primaryText}]}>{item.content}</Text>
      <View style={styles.bottomContainer}>
        <View style={styles.postBottomButtons}>
          <TouchableOpacity style={styles.postBottomButton} onPress={() => handlePostLikeButton(item.id)}>
            <FontAwesomeIcon icon={item.liked ? faHeart : faHeartO} size={20} color={item.liked ? "#c30000" : theme.colors.secondaryText} />
            <Text style={[styles.postBottomButtonText, {color: theme.colors.secondaryText}]}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postBottomButton} onPress={() => navigation.navigate("ForumDetailIndex", {
            postTitle:item.title, postID: item.id,
            handleRefreshPostList: handleRefresh,
            updatePostLikeStatus: updatePostLikeStatus,
          })}>
            <FontAwesomeIcon icon={faComment} size={20} color={theme.colors.secondaryText} />
            <Text style={[styles.postBottomButtonText, {color: theme.colors.secondaryText}]}>{item.comments}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postBottomButtons}>
          <Text style={[styles.postDate, {color: theme.colors.secondaryText}]}>
            {item.created_at}
            {item.edited_at &&
              <>
                {" • "}<FontAwesomeIcon icon={faPen} size={12} color={theme.colors.secondaryText} />{" "}{item.edited_at}
              </>
            }
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ));

  if (loading) return <Loading loadingError={loadingError} onRetry={handleRefresh} />

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlashList
        data={filteredPostList}
        renderItem={({item}) => <PostItem item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{paddingBottom: 100}}
        estimatedItemSize={100}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View style={styles.topContainer}>
            <View style={styles.firstRow}>
              <SearchBar value={search} onChangeText={setSearch} placeholder={t("search...")} style={styles.searchBar} />
              <MultiSelect placeholder={t("topics")} options={topics.map(topic => t(topic.name))} value={selectedTopics}
                           onChange={setSelectedTopics} buttonStyle={[styles.multiSelect, {backgroundColor: theme.colors.surface}]}
                           placeholderStyle={{color: theme.colors.secondaryText}} />
            </View>
            <Picker
              onChange={(selectedOption) => {
                const selectedPostSortOption = postSortOptions.find(option => t(option) === selectedOption);
                setSelectedPostSortOption(selectedPostSortOption ? selectedPostSortOption : postSortOptions[0]);
              }}
              value={t(selectedPostSortOption)} options={postSortOptions.map(option => t(option))}
              buttonStyle={[styles.postSortOptionPicker, {backgroundColor: theme.colors.surface}]}
              placeholder={t("sortPostsBy")} placeholderStyle={{color: theme.colors.secondaryText}}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.noPosts, {color: theme.colors.secondaryText}]}>{t("noPosts")}</Text>
        }
      />
      <TouchableOpacity style={[styles.createPostButton, {backgroundColor: theme.colors.primary}]} onPress={() => setIsPostCreateModalOpen(true)}>
        <Text style={[styles.createPostButtonText, {color: theme.colors.primaryText}]}>{'+ ' + t("post")}</Text>
      </TouchableOpacity>
      <CreatePostModal topics={topics} isOpen={isPostCreateModalOpen} setIsOpen={setIsPostCreateModalOpen} handleRefresh={handleRefresh} setLoading={setLoading} />
      <EditPostModal topics={topics} selectedPost={selectedPost} isOpen={isPostEditModalOpen} setIsOpen={setIsPostEditModalOpen} handleRefresh={handleRefresh} setLoading={setLoading} />
      <DeletePostAlert selectedPost={selectedPost} isOpen={isPostDeleteAlertOpen} setIsOpen={setIsPostDeleteAlertOpen} handleRefresh={handleRefresh} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    marginBottom: 10,
  },
  firstRow: {
    flexDirection: "row",
  },
  searchBar: {
    flex: 1,
  },
  multiSelect: {
    flex: 1,
    borderRadius: 6,
    marginVertical: 10,
    width: 150,
    marginLeft: 0,
  },
  postSortOptionPicker: {
    flex: 1,
    borderRadius: 6,
    marginLeft: 10,
    elevation: 5,
  },
  postContainer: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  noPosts: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
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
  bottomContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postBottomButtons: {
    flexDirection: "row",
    columnGap: 10,
  },
  postBottomButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  postBottomButtonText: {
    marginLeft: 5,
    fontSize: 16,
  },
  postDate: {
    fontSize: 12,
  },
  createPostButton: {
    position: "absolute",
    bottom: 100,
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
