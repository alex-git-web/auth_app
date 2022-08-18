import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { white } from '../../colors'

export default function LogInScreen() {
  return (
    <View style={styles.container}>
      <Text>logIn_screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: white,
        paddingHorizontal: 20,
        paddingVertical: 20,
    }
})