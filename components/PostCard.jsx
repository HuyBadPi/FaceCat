import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html'
import { getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'


const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.9),
}

const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark,
    },
    h4: {
        color: theme.colors.dark,
    }
}

const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow = true,
}) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const openPostDetails = () => {

    }

    const createAt = moment(item?.created_at).format('MMM DD')
    const likes = [];
    const liked = false;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
        <View style={styles.header}>
            {/* user info and post time*/}
            <View style={styles.userInfo}>
                <Avatar size={hp(4.5)} uri={item?.user?.image} rounded={theme.radius.md} />
                <View style={{gap: 2}}>
                    <Text style={styles.username}>{item?.user?.name}</Text>
                    <Text style={styles.postTime}>{createAt}</Text>
                </View>
            </View>
        
        <TouchableOpacity onPress={openPostDetails}>
            <Icon name='threeDotsHorizontal' size={hp(2.3)} color={theme.colors.text} />
        </TouchableOpacity>
        </View>

        {/* post content and media */}
        <View style={styles.content}>
            <View style={styles.postBody}>
                {
                    item?.body && (<RenderHtml
                        contentWidth={wp(90)}
                        source={{ html: item?.body }}
                        tagsStyles={tagsStyles}
                    />
                    )
                }
            </View>

            {/* post image */}
            {
                item?.file && item?.file?.includes('postImage') && (
                    <Image
                        source={getSupabaseFileUrl(item?.file)}
                        transition={100}
                        style={styles.postMedia}
                        contentFit='cover'
                    />
                )
            }

            {/* post video */}
            {
                item?.file && item?.file?.includes('postVideo') && (
                    <Video
                        style={[styles.postMedia, { height: hp(30) }]}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode='cover'
                        isLooping
                    />
                )
            }

            {/* like, comment, share */}
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name='heart' size={23} fill={liked ? theme.colors.rose: 'transparent'} color={liked ? theme.colors.rose : theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name='comment' size={24} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                    <TouchableOpacity style={styles.footerButton}>
                        <Icon name='share' size={24} color={theme.colors.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
            </View>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        backgroundColor: 'white',
        borderRadius: theme.radius.xxl*1.1,
        padding: 10,
        marginBottom: 15,
        borderCurve: 'continuous',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000',
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        color: theme.colors.textDark,
        fontSize: hp(1.7),
        fontWeight: theme.fonts.medium
    },
    postTime: {
        color: theme.colors.textDark,
        fontSize: hp(1.4),
        fontWeight: theme.fonts.medium
    },
    content: {
        gap: 10,
    },
    postMedia: {
        width: '100%',
        height: hp(40),
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
    },
    postBody: {
        marginLeft: 5
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8),
    }
})