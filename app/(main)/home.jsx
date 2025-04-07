import { Alert, StyleSheet, Text, View, Button, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { user } from '../../services/userService'

const Home = () => {
    const {user, setAuth} = useAuth();
    // console.log('user:', user);
    const router = useRouter();

    // const onLogout = async () => {
    //     // setAuth(null);
    //     const {error} = await supabase.auth.signOut();
    //     if(error) {
    //         Alert.alert("Logout", error.message);
    //     }
    // }

  return (
    <ScreenWrapper bg="white">
        <View style={styles.container}>
            {/*header*/}
            <View style={styles.header}>
                <Text style={styles.title}>FaceCat</Text>
                <View style={styles.icons}>
                    <Pressable onPress={()=>router.push('notifications')}>
                        <Icon name="heart" size={hp(3.2)} color={theme.colors.text} />
                    </Pressable>
                    <Pressable onPress={()=>router.push('newPost')}>
                        <Icon name="plus" size={hp(3.2)} color={theme.colors.text} />
                    </Pressable>
                    <Pressable onPress={()=>router.push('profile')}>
                        <Avatar 
                            uri={user?.image}
                            size={hp(4.3)}
                            rounded={theme.radius.sm}
                            style={{borderWidth: 2}}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
        {/* <Button title="Logout" onPress={onLogout} /> */}
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: wp(4)
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(3.2),
        fontWeight: theme.fonts.bold
    },
    avatarImage: {
        width: hp(4.3),
        height: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: 'continuous',
        borderColor: theme.colors.gray,
        borderWidth: 3
    },
    icons: {
        flexDirection: 'row',
        gap: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
    },
    noPosts: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(2)
    },
    pill: {
        position: 'absolute',
        top: -4,
        right: -10,
        height: hp(2.2),
        width: hp(2.2),
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.roseLight
    },
    pillText: {
        color: 'white',
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }

})