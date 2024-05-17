import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Help = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important !!</Text>
      <View style={styles.content}>
      <Text style={styles.text}>1. Currently this app is in its alpha stage. Hence their are more functionalites to add.</Text>
      <Text style={styles.text}>2. Go to Election page to cast your vote.</Text>
      <Text style={styles.text}>3. Once the vote is casted you are not allowed to cast the again.</Text>
      <Text style={styles.text}>4. If your are not able to cast your first vote. Then it might be that admin as not given you the privilage to participate. But dont worry you can still see the voting result.</Text>
      <Text style={styles.text}>5. Once the election is over you can view the Result of past elections.</Text>
      <Text style={styles.text}>6. If you face any difficulties feel free to contact at ramcharanpaddu07@gmail.com</Text>
      </View>
    </View>
  )
}

export default Help

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    // Add additional styling for content if needed
  },
  text: {
    marginBottom: 10,
  },
});