import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const StartElection = ({ route }) => {
  const { selectedCandidates } = route.params;

  const handleVote = (candidateId) => {
    // Handle the voting action for the selected candidate
    console.log(`Voted for candidate with ID: ${candidateId}`);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Candidates</Text>
      {selectedCandidates.map(candidate => (
        <View key={candidate} style={styles.card}>
          <Text style={styles.Text}>{candidate}</Text>
          <TouchableOpacity onPress={() => handleVote(candidate)} style={styles.voteButton}>
            <Text style={styles.buttonText}>Vote</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get('window').width * 0.9,
  },
  voteButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  Text: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign:'center'
  }
});

export default StartElection;
