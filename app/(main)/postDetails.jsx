import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const PostDetails = () => {
    const { postID } = useLocalSearchParams();
    console.log('postID:', postID);
  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({})