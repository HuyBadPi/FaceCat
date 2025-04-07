import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'


const RichTextEditor = ({
    editorRef,
    onChange,
}) => {
  return (
    <View style={{minHeight: 285}}>
        <RichToolbar
            actions={[
                actions.setBold,
                actions.setItalic,
                actions.setStrikethrough,
                actions.removeFormat,
                actions.insertOrderedList,
                actions.blockquote,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.code,
                actions.line,
                actions.heading1,
                actions.heading4
            ]}
            iconMap={{
                [actions.heading1]: ({ tintColor }) => (
                    <Text style={{ color: tintColor }}>H1</Text>
                ),
                [actions.heading4]: ({ tintColor }) => (
                    <Text style={{ color: tintColor }}>H4</Text>
                ),
            }}
            style={styles.richBar}
            flatContainerStyle={styles.listStyle}
            selectedIconTint={theme.colors.primaryDark}
            editor={editorRef}
            disabled={false}
        />

        <RichEditor
            ref={editorRef}
            containerStyle={styles.rich}
            placeholder={"Write something..."}
            onChange={onChange}
            editorStyle={styles.contentStyle}
        />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar: {
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
        backgroundColor: theme.colors.gray
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderBottomRightRadius: theme.radius.xl,
        borderBottomLeftRadius: theme.radius.xl,
        borderWidth: 1.5,
        borderTopWidth: 0,
        borderColor: theme.colors.gray,
        padding: 5
    },
    contentStyle: {
        placeholderColor: 'gray',
        color: theme.colors.textDark
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3
    }
})