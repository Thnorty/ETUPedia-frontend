import {useTranslation} from "react-i18next";
import {View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView} from "react-native";
import {useEffect, useState} from "react";
import backend from "../../utils/Backend";
import Loading from "../../components/Loading";
import Icon from "react-native-vector-icons/FontAwesome";
import CreateCommentModal from "./CreateCommentModal";

const PostDetail = ({navigation, route}) => {
  const {t} = useTranslation();
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

  useEffect(() => {
    setLoading(true);
    navigation.setOptions({title: route.params.forumTitle});

    handleRefresh();
  }, [route.params.forumID, route.params.forumTitle]);

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

  const handleRefresh = () => {
    setRefreshing(true);
    const payload = {
      forum_id: route.params.forumID,
    };
    backend.post("posts/get-post-info/", payload)
      .then((response) => {
        setPostInfo(response.data.post);
        setComments(response.data.comments);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
      });
    route.params.handleRefreshPostList();
  }

  const onCommentCreate = (content) => {
    backend.post("posts/create-comment/", {
      forum_id: route.params.forumID,
      content: content
    }).then(() => {
      setLoading(true);
      handleRefresh();
    }).catch((error) => {
      console.error(error);
    });
  }

  const renderComment = ({item}) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentAuthor}>{item.author_name}</Text>
      <Text style={styles.commentContent}>{item.content}</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => likeComment(item.id)} style={styles.likeButton}>
          <Icon name={item.liked ? "heart": "heart-o"} size={20} color={item.liked ? "#c30000": "#000000"} />
          <Text style={styles.likeText}>{item.likes}</Text>
        </TouchableOpacity>
        <Text style={styles.commentDate}>{item.created_at}</Text>
      </View>
    </View>
  );

  if (loading) return <Loading />

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.commentsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <View style={styles.postContainer}>
            <Text style={styles.postTopic}>{postInfo.topic} • {postInfo.author_name}</Text>
            <Text style={styles.postTitle}>{postInfo.title}</Text>
            <Text style={styles.postContent}>{postInfo.content}</Text>
            <View style={styles.bottomContainer}>
              <TouchableOpacity onPress={likePost} style={styles.likeButton}>
                <Icon name={postInfo.liked ? "heart": "heart-o"} size={20} color={postInfo.liked ? "#c30000": "#000000"} />
                <Text style={styles.likeText}>{postInfo.likes}</Text>
              </TouchableOpacity>
              <Text style={styles.postDate}>{postInfo.created_at}</Text>
            </View>
          </View>
        }
      />
      <TouchableOpacity style={styles.createCommentButton} onPress={() => setIsCommentCreateModalOpen(true)}>
        <Text style={styles.createCommentButtonText}>{'+ ' + t("comment")}</Text>
      </TouchableOpacity>
      <CreateCommentModal isOpen={isCommentCreateModalOpen} setIsOpen={setIsCommentCreateModalOpen} onSubmit={onCommentCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  postContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: "#ededed",
    borderRadius: 10,
    elevation: 5,
  },
  postTopic: {
    fontSize: 14,
    color: "#888",
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
    color: "#aaa",
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
    backgroundColor: "#e1e1e1",
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
    color: "#aaa",
  },
  createCommentButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  createCommentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PostDetail;
