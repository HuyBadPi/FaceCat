import { Alert, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import ScreenWrapper from '../../components/ScreenWrapper'
import Header from '../../components/Header'
import Avatar from '../../components/Avatar'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../assets/icons'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import Button from '../../components/Button'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'

const NewPost = () => {
  const {user} = useAuth();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  const onPick = async (isImage) => {

    let mediaConfig = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }

    if(!isImage) {
      mediaConfig = {
        mediaTypes: ['videos'],
        allowsEditing: true,
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);
    // console.log('result:', result.assets[0]);
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file == 'object') return true;
    return false;
  }

  const getFileType = file => {
    if(!file) return null;
    if(isLocalFile(file)) {
      return file.type;
    }
    
    if(file.includes('postImage')) return 'image';
    return 'video';
  }

  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }
      
  const onSubmit = async () => {
    if(!bodyRef.current && !file) {
      Alert.alert("Post", "Please write something or add a file");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userID: user?.id
    }
    console.log('data:', data);
    setLoading(true);
    let res = await createOrUpdatePost(data);
    setLoading(false);
    if(res.success){
      setFile(null);
      bodyRef.current = '';
      editorRef.current?.setContentHTML('');
      router.back();
    } else {
      Alert.alert("Post", res.msg || "Could not create post");
    }
  }

  return (
    <ScreenWrapper bg="white" >
      <View style={styles.container} >
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{gap: 20}}>
          {/* avatar */}
          <View style={styles.header} >
            <Avatar uri={user?.image} size={hp(6.5)} rounded={theme.radius.xl} />
            <View style={{gap: 2}} >
              <Text style={styles.username} >{user && user.name}</Text>
              <Text style={styles.publicText} >Public</Text>
            </View>
          </View>
          <View style={styles.textEditor}>
            <RichTextEditor editorRef={editorRef} onChange={body=> bodyRef.current = body} />
          </View>

          {
            file && (
              <View style={styles.file} >
                {
                  getFileType(file) == 'image'? (
                    <Image source={{uri: getFileUri(file)}} resizeMode='cover' style={{flex: 1}} />
                  ):(
                    <Video
                    style={{flex: 1}}
                    source={{uri: getFileUri(file)}}
                    useNativeControls
                    resizeMode="cover"
                    isLooping
                  />
                  )
                }

                <Pressable style={styles.closeIcon} onPress={()=> setFile(null)} > 
                  <Icon name="delete" size={15} color='white' />
                </Pressable>
              </View>
            )
          }

          <View style={styles.media} >
            <Text style={styles.addImageText} >Add to your post</Text>
            <View style={styles.mediaIcons} >
              <TouchableOpacity onPress={()=> onPick(true)} >
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> onPick(false)} >
                <Icon name="video" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{height: hp(6.2)}}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderCurve: 'continuous'
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {

  },
  media: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addImageText: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  imageIcon: {
    borderRadius: theme.radius.md
  },
  file: {
    height: hp(30),
    width: '100%',
    overflow: 'hidden',
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
  },
  video: {

  },
  closeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
  }
})