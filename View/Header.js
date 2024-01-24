import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text>Voting HelpLine</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: "center",
        fontFamily: "sans-serif",
        fontWeight:"bold",
        fontSize:25,
    }
})