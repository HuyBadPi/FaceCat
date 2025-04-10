import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchPostDetails, removeComment, removePost, createComment } from '../../services/postService';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import Icon from '../../assets/icons';
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';
import { createNotification } from '../../services/notificationService';


const PostDetails = () => {
    const { postID, commentID } = useLocalSearchParams();
    const { user } = useAuth();
    const router = useRouter();
    const [startLoading, setStartLoading] = useState(true);
    const inputRef = useRef(null);
    const commentRef = useRef('');
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleNewComment = async (payload) => {
        if(payload.new) {
            let newComment = {...payload.new};
            let res = await getUserData(newComment.userID);
            newComment.user = res.success ? res.data : {};
            setPost(prevPost => {
                return {
                    ...prevPost,
                    comments: [newComment, ...prevPost.comments]
                }
            })
        }    
    }

    useEffect(() => {
        let commentChannel = supabase
            .channel('comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `postID=eq.${postID}` }, handleNewComment)
            .subscribe();

        getPostDetails();
        return () => {
            supabase.removeChannel(commentChannel);
        }
    }, [])

    const getPostDetails = async () => {
        //call API here
        let res = await fetchPostDetails(postID);
        // console.log('post details:', res);
        if(res.success) {
            setPost(res.data); 
        }
        setStartLoading(false);
    }

    const onNewComment = async () => {
        if(!commentRef.current) return null;
        let data = {
            postID: post?.id,
            userID: user?.id,
            text: commentRef.current,
        }
        //crete comment 
        setLoading(true);
        let res = await createComment(data);
        setLoading(false);
        if(res.success){
            // send notification later
            if(user.id != post.userID) {
                let notify = {
                    senderID: user.id,
                    receiverID: post.userID,
                    title: 'commented on your post',
                    data: JSON.stringify({
                        postID: post.id,
                        commentID: res?.data?.id,
                    }),
                }
                createNotification(notify);
            }
            inputRef?.current?.clear();
            commentRef.current = '';
        } else {
            Alert.alert("comment", res.msg);
        }
    }

    const onDeleteComment = async (comment) => {
        let res = await removeComment(comment?.id);
        if(res.success) {
            setPost(prevPost => {
                let updatePost = {...prevPost};
                updatePost.comments = updatePost.comments.filter(c => c.id != comment.id);
                return updatePost;
            })
        } else {
            Alert.alert("comment", res.msg);
        }
    }

    const onDeletePost = async (item) => {
        // delete post
        let res = await removePost(post.id);
        if(res.success) {
            router.back();
        } else {
            Alert.alert("Post", res.msg);
        }
    }

    const onEditPost = async (item) => {
        router.back();
        router.push({
            pathname: 'newpost',
            params: {...item},
        });
    }

    if(startLoading) {
        return (
            <View style={styles.center}>
                <Loading />
            </View>
        )
    }

    if(!post) {
        return (
            <View style={[styles.center, {justifyContent: 'flex-start', marginTop: 100}]}>
                <Text style={styles.notFound}>Post not found</Text>
            </View>
        )
    }

  return (
    <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            <PostCard
                item={{...post, comments: [{count: post?.comments?.length}]}} // to show comment count
                currentUser={user}
                router={router}
                hasShadow={false}
                showMoreIcon={false}
                showDelete={true}
                onDelete={onDeletePost}
                onEdit={onEditPost}
            />

            {/*comment input*/}
            <View style={styles.inputContainer}>
                <Input
                    inputRef={inputRef}
                    placeholder='Type a comment...'
                    onChangeText={value => commentRef.current = value}
                    placeholderTextColor={theme.colors.textLight}
                    containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }}
                />

                {
                    loading ? (
                        <View style={styles.loading}>
                            <Loading size='small' />
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                            <Icon name='send' color={theme.colors.primaryDark} />
                        </TouchableOpacity>
                    )
                }
                
            </View>

            {/*comments list*/}
            <View style={{marginVertical: 15, gap: 17}}>
                {
                    post?.comments?.map(comment=>
                        <CommentItem
                            key={comment?.id?.toString()}
                            item={comment}
                            onDelete={onDeleteComment}
                            highlight = {comment.id == commentID}
                            canDelete={user.id == comment.userID || user.id == post.userID}
                        />
                     )
                }
                {
                    post?.comments?.length == 0 && (
                        <Text style={{color: theme.colors.text, marginLeft: 5}}>
                            Be first to comment
                        </Text>
                    )
                }
            </View>

        </ScrollView>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: wp(7),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    list: {
        paddingHorizontal: wp(4),
    },
    sendIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.8,
        borderColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        height: hp(5.8),
        width: hp(5.8),
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{scale: 1.3}]
    }
})