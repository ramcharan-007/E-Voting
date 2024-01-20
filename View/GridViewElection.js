// GridviewElection.js

import React from 'react';
import { View, Text, Pressable, StyleSheet, Button, Dimensions } from 'react-native';

function GridviewElection({ id, text, img }) {
  
  return (
    <View style={styles.gridItem}>
      <Pressable style={styles.buttonStyle}>
        <View style={styles.innerContainer}>
          <Text style={styles.idText}>{id}</Text>
          <Text style={styles.text}>{text}</Text>
          <Text style={styles.imgText}>{img}</Text>
          <Button title='Participate' color='#4CAF50' onPress={() => console.log(id)}/>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 16,
    height: 150,
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
  },
  idText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  imgText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
});

export default GridviewElection;
