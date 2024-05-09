import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, set, update, get, push } from "firebase/database";
import {db} from "../../Backend/config/config";

const StartElection = () => {
  
  const [isElectionOngoing, setIsElectionOngoing] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchElectionStatus = async () => {
      try {
        const stateSnapshot = await get(ref(db, 'election/state'));
        const status = stateSnapshot.val()?.status || 'noElections';
        
        if (status === 'ongoing') {
          setIsElectionOngoing(true);
          
          const candidatesSnapshot = await get(ref(db, 'election/candidates'));
          const candidatesData = candidatesSnapshot.val();
          
          if (candidatesData) {
            const candidateList = Object.keys(candidatesData).map((key) => ({
              name: key,
              voteCount: candidatesData[key].voteCount,
            }));
            setCandidates(candidateList);
          }
        } else {
          setIsElectionOngoing(false);
        }
      } catch (error) {
        Alert.alert('Error', `Failed to fetch election status: ${error.message}`);
      } finally {
        setIsLoading(false); // Stop loading after the fetch is complete
      }
    };

    fetchElectionStatus();
  }, []);

  function renderDetails(){
    return(
      <>
      <View>
      <Text style={styles.heading}>Candidates</Text>
      {candidates.map((candidate) => (
        <View key={candidate} style={styles.card}>
          <Text style={styles.candidateText}>Candidate Name's : {candidate.name}</Text>
          <Text style={styles.candidateText}>Votes Secured :{candidate.voteCount}</Text>
        </View>
      ))}
      </View>
      </>
    )
  }
  
  function renderNothing(){
    return(
      <>
        <View>
          <Text>No Election Data...</Text>
        </View>
      </>
    )
  }

  return (

    <View style={styles.container}>
      {isElectionOngoing ? renderDetails() : 
        renderNothing()
      }
      
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign:'center'
  },
  card: {
    backgroundColor: '#fff', // White background for the card
    borderRadius: 10, // Rounded corners
    padding: 20, // Padding within the card
    marginVertical: 10, // Vertical margin between cards
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 10,
    flexDirection: 'col', // Arrange content horizontally
    justifyContent: 'space-between', // Align vote button to the right
    alignItems: 'center', // Center items vertically
  },
  candidateText: {
    fontSize: 18,
    textAlign: 'center',
  },
  voteButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  endElectionButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StartElection;
