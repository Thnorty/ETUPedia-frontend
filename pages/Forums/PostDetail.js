import {useTranslation} from "react-i18next";
import {View, Text, StyleSheet, TouchableOpacity, RefreshControl} from "react-native";
import {memo, useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import CreateCommentModal from "./CreateCommentModal";
import {FlashList} from "@shopify/flash-list";
import {useTheme} from "../../utils/Theme";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {faHeart as faHeartO} from "@fortawesome/free-regular-svg-icons";

const PostDetail = ({navigation, route}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postInfo, setPostInfo] = useState({
    topic: "",
    author_name: "",
    title: "",
    content: "",
    created_at: "",
    likes: 0,
    liked: false,
  });
  const [isCommentCreateModalOpen, setIsCommentCreateModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    navigation.setOptions({title: route.params.forumTitle});
    handleLoad();
  }, []);

  const likePost = () => {
    const newPostInfo = {...postInfo, likes: postInfo.liked ? postInfo.likes - 1 : postInfo.likes + 1, liked: !postInfo.liked};
    setPostInfo(newPostInfo);

    const newLikedStatus = !postInfo.liked;
    route.params.updatePostLikeStatus(route.params.forumID, newLikedStatus);

    const payload = {
      forum_id: route.params.forumID,
    };
    backend.post("posts/like-post/", payload)
      .catch((error) => {
        console.error(error);
      });
  }

  const likeComment = (commentID) => {
    const newComments = comments.map(comment => {
      if (comment.id === commentID) {
        return {...comment, likes: comment.liked ? comment.likes - 1 : comment.likes + 1, liked: !comment.liked};
      }
      return comment;
    });
    setComments(newComments);

    const payload = {
      comment_id: commentID,
    };
    backend.post("posts/like-comment/", payload)
      .catch((error) => {
        console.error(error);
      });
  }

  const handleLoad = () => {
    setLoading(true);
    setLoadingError(false);
    const payload = {
      forum_id: route.params.forumID,
    }
    backend.post("posts/get-post-info/", payload)
      .then((response) => {
        setPostInfo(response.data.post);
        setComments(response.data.comments);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingError(true);
      });
    route.params.handleRefreshPostList();
  }

  const handleRefresh = () => {
    setRefreshing(true);
    const payload = {
      forum_id: route.params.forumID,
    };
    backend.post("posts/get-post-info/", payload)
      .then((response) => {
        setPostInfo(response.data.post);
        setComments(response.data.comments);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        setRefreshing(false);
      });
  }

  const onCommentCreate = (content) => {
    backend.post("posts/create-comment/", {
      forum_id: route.params.forumID,
      content: content
    }).then(() => {
      handleLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  const CommentItem = memo(({ item }) => (
    <View style={[styles.commentContainer, {backgroundColor: theme.colors.surface}]}>
      <Text style={[styles.commentAuthor, {color: theme.colors.primaryText}]}>{item.author_name}</Text>
      <Text style={[styles.commentContent, {color: theme.colors.primaryText}]}>{item.content}</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => likeComment(item.id)} style={styles.likeButton}>
          <FontAwesomeIcon icon={item.liked ? faHeart : faHeartO} size={20} color={item.liked ? "#c30000": theme.colors.secondaryText} />
          <Text style={[styles.likeText, {color: theme.colors.secondaryText}]}>{item.likes}</Text>
        </TouchableOpacity>
        <Text style={[styles.commentDate, {color: theme.colors.secondaryText}]}>{item.created_at}</Text>
      </View>
    </View>
  ));

  if (loading) return <Loading loadingError={loadingError} onRetry={handleLoad} />

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlashList
        data={comments}
        renderItem={({item}) => <CommentItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.commentsList}
        estimatedItemSize={100}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.postContainer, {backgroundColor: theme.colors.surface}]}>
              <Text style={[styles.postTopic, {color: theme.colors.secondaryText}]}>{t(postInfo.topic.name)} • {postInfo.author_name}</Text>
              <Text style={[styles.postTitle, {color: theme.colors.primaryText}]}>{postInfo.title}</Text>
              <Text style={[styles.postContent, {color: theme.colors.primaryText}]}>{postInfo.content}</Text>
              <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={likePost} style={styles.likeButton}>
                  <FontAwesomeIcon icon={postInfo.liked ? faHeart : faHeartO} size={20} color={postInfo.liked ? "#c30000": theme.colors.secondaryText} />
                  <Text style={[styles.likeText, {color: theme.colors.secondaryText}]}>{postInfo.likes}</Text>
                </TouchableOpacity>
                <Text style={[styles.postDate, {color: theme.colors.secondaryText}]}>{postInfo.created_at}</Text>
              </View>
            </View>
            <Text style={[styles.commentsHeader, {color: theme.colors.primaryText}]}>{t("comments")}</Text>
            <View style={[styles.separator, {borderBottomColor: theme.colors.border}]} />
          </View>
        }
      />
      <TouchableOpacity style={[styles.createCommentButton, {backgroundColor: theme.colors.primary}]} onPress={() => setIsCommentCreateModalOpen(true)}>
        <Text style={[styles.createCommentButtonText, {color: theme.colors.primaryText}]}>{'+ ' + t("comment")}</Text>
      </TouchableOpacity>
      <CreateCommentModal isOpen={isCommentCreateModalOpen} setIsOpen={setIsCommentCreateModalOpen} onSubmit={onCommentCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  postContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 15,
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
  commentsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  separator: {
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginBottom: 10,
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
  commentsList: {
    paddingBottom: 70,
  },
  commentContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    elevation: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
  },
  createCommentButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  createCommentButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostDetail;
