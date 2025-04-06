import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import Header from '../../components/Header'
import { getUserImageSrc, uploadFile } from '../../services/imageService'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../../assets/icons'
import Input from '../../components/Input'
import { updateUser } from '../../services/userService'
import { useRouter } from 'expo-router'
import Button from '../../components/Button'
import * as ImagePicker from 'expo-image-picker'
import { Image } from 'expo-image'

const EditProfile = () => {
    
    const {user: currentUser, setUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [user, setUser] = useState({
        name: '',
        phoneNumber: '',
        image: null,
        address: '',
        bio: ''    
    });

    useEffect(() => {
        if(currentUser) {
            setUser({
                name: currentUser.name || '',
                phoneNumber: currentUser.phoneNumber || '',
                image: currentUser.image || null,
                address: currentUser.address || '',
                bio: currentUser.bio || ''
            });
        }
    }, [currentUser]);
    
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setUser({...user, image: result.assets[0].uri });
        }
    }

    const onSubmit = async () => {
        let userData = {...user};
        let {name, phoneNumber, address, bio, image} = userData;
        if(!name || !phoneNumber || !address || !bio || !image) {
            Alert.alert("Profile", "Please fill all fields");
            return;
        }
        setLoading(true);

        if(image && typeof image === 'string') {
            let imageRes = await uploadFile('profile', image, true);
            if(imageRes.success) {
                userData.image = imageRes.data;
            }else{
                userData.image = null;
            }
        }

        const res = await updateUser(currentUser?.id, userData);
        setLoading(false);

        if(res.success) {
            setUserData({...currentUser, ...userData});
            router.back();
        }
    }

    let imageSource = user.image && typeof user.image == 'object'? user.image.uri : getUserImageSrc(user.image);
  return (
    <ScreenWrapper bg="white">
        <View style={styles.container}>
            <ScrollView style={{flex: 1}}>
                <Header title="Edit Profile" />

                {/* Form */}
                <View style={styles.form} >
                    <View style={styles.avatarContainer}>
                        <Image source={imageSource} style={styles.avatar} />
                        <Pressable style={styles.cameraIcon} onPress={onPickImage} >
                            <Icon name="camera" size={20} />
                        </Pressable>
                    </View>
                    <Text style={{fontSize: hp(1.5), color: theme.colors.text}} >
                        Please fill your profile details 
                    </Text>
                    <Input icon={<Icon name="user" />} placeholder="Enter your name" value={user.name} onChangeText={value=> setUser({...user, name:value})} />
                    <Input icon={<Icon name="call" />} placeholder="Enter your phone number" value={user.phoneNumber} onChangeText={value=> setUser({...user, phoneNumber:value})} />
                    <Input icon={<Icon name="location" />} placeholder="Enter your address" value={user.address} onChangeText={value=> setUser({...user, address:value})} />
                    <Input placeholder="Enter your bio" value={user.bio} multiline={true} containerStyle={styles.bio} onChangeText={value=> setUser({...user, bio:value})} />

                    <Button title="Update" onPress={onSubmit} loading={loading} />
                </View>
            </ScrollView>
        </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(4)
    },
    avatarContainer: {
        height: hp(14),
        width: hp(14), 
        alignSelf: 'center',
    },
    avatar: {
        height: '100%',
        width: '100%',
        borderRadius: theme.radius.xxl*1.8,
        borderWidth: 1,
        borderColor: theme.colors.darkLight,
        borderCurve: 'continuous'
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: -10,
        padding: 8,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7
    },
    form: {
        gap: 10,
        marginTop: 20
    },
    input: {
        flexDirection: 'row',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 20,
        padding: 17,
        gap: 15
    },
    bio: {
        flexDirection: 'row',
        height: hp(15),
        alignItems: 'flex-start',
        paddingVertical: 15,
    }
})