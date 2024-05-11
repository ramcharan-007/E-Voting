import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import React from 'react';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function NewsView({ author, title, description, imageUrl, content, url }) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => Linking.openURL(url)}>
      {/* <Image source={{ uri: imageUrl}} style={styles.image} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.author} numberOfLines={1}>{author}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: 'black',
  },
});
