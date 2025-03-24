import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button  from '../components/Button'
import { useRouter } from 'expo-router'



const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
        <StatusBar style="dark" />
        <View style={styles.container}>
          {/*welcome image*/}
          <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/background-image.png')}/>

          {/*title*/}
          <View style={{gap: 20}}>
            <Text style={styles.title}>FaceCat</Text>
            <Text style={styles.punchline}>
              The best place to find your lost cat</Text>
          </View>

          {/*footer*/}
          <View style={styles.footer}>
            <Button title="Get Started" buttonStyle={{marginHorizontal: wp(3)}} onPress={()=> router.push('signup')} />
            <View style={styles.bottomTextContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <Pressable onPress={()=> router.push('login')}>
                <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Login</Text>
              </Pressable>
            </View>
          </View>

        </View>
    </ScreenWrapper>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'write',
        paddingHorizontal: wp(4)
    },
    welcomeImage: {
        width: wp(100),
        height: hp(30),
        alignSelf: 'center'
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fonts.extraBold,
        color: theme.colors.text,
        textAlign: 'center'
    },
    punchline: {
        fontSize: hp(1.7),
        color: theme.colors.text,
        textAlign: 'center',
        paddingHorizontal: wp(10)
    },
    footer: {
        width: '100%',
        gap: 30
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6)
    }
})