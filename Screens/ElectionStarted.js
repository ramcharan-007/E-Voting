import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert,Dimensions,ActivityIndicator } from 'react-native';
import { ref, update, get,increment } from "firebase/database";
import {db, firebase} from "../Backend/config/config";
import ElectionResults from "../Screens/Admin Screen/Result";

const ElectionStarted = ({navigation}) => {
  
  const [isElectionOngoing, setIsElectionOngoing] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCanVote, setUserCanVote] = useState(true);

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
        
        const canVote = await canUserVote();
        setUserCanVote(canVote);
        console.log("usercanvote",userCanVote)
      } else {
        setIsElectionOngoing(false);
      }
      
    } catch (error) {
      Alert.alert('Error', `Failed to fetch election status: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading after the fetch is complete
    }
  };

  useEffect(() => {
    fetchElectionStatus();
  }, []);

  async function canUserVote() {
    try {
      const currentUser = firebase.auth().currentUser;
  
      if (!currentUser) {
        throw new Error('User not logged in');
      }
  
      const voterId = currentUser.uid; // Get the current user's UID
      const voterRef = ref(db, `users/${voterId}`); // Reference to the user in Firebase
      const snapshot = await get(voterRef); // Fetch user data
  
      if (snapshot.exists() && snapshot.val().canVote === true) {
        return true; // User can vote
      } else {
        return false; // User cannot vote
      }
    } catch (error) {
      console.error('Error checking canVote status:', error);
      Alert.alert('Error', `Failed to check voting status: ${error.message}`);
      return false; // Default to false in case of error
    }
  }

  if (isLoading === true) {
    // Show loading indicator while fetching data
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.heading}>Loading...</Text>
        </View>
      );    
  }

  // async function handleVote(candidateName) {
  //   try {
  //     const currentUser = firebase.auth().currentUser;
  
  //     if (!currentUser) {
  //       throw new Error('User not logged in');
  //     }
  
  //     const voterId = currentUser.uid; // Get the current user's UID
  //     const voterRef = ref(db, `users/${voterId}`); // Reference to the voter in the database
  //     const candidateRef = ref(db, `election/candidates/${candidateName}`); // Reference to the candidate
  
  //     // Update the candidate's vote count and the voter's `canVote` status
  //     await Promise.all([
  //       update(candidateRef, { voteCount: increment(1) }), // Increment vote count by 1
  //       update(voterRef, { canVote: false }), // Set canVote to false
  //     ]);
  
  //     Alert.alert('Success', `Voted for ${candidateName}`);
  //   } catch (error) {
  //     console.error('Error during voting:', error);
  //     Alert.alert('Error', `Failed to record vote: ${error.message}`);
  //   }
  // }


  async function handleVote(candidateName) {
    try {
      const currentUser = firebase.auth().currentUser;
  
      if (!currentUser) {
        throw new Error('User not logged in');
      }
  
      const voterId = currentUser.uid; // Get the current user's UID
      const voterRef = ref(db, `users/${voterId}`); // Reference to the voter in the database
      const candidateRef = ref(db, `election/candidates/${candidateName}`); // Reference to the candidate
  
      // Update the candidate's vote count and the voter's `canVote` status
      await Promise.all([
        update(candidateRef, { voteCount: increment(1) }), // Increment vote count by 1
        update(voterRef, { canVote: false }), // Set canVote to false
      ]);
  
      Alert.alert('Success', `Voted for ${candidateName}`);
  
      // Refresh the page by fetching the latest election status
      fetchElectionStatus();
    } catch (error) {
      console.error('Error during voting:', error);
      Alert.alert('Error', `Failed to record vote: ${error.message}`);
    }
  }
  

  function onpress(name){

    if (userCanVote) {
      handleVote(name); // Call handleVote only if userCanVote is true
    } else {
      Alert.alert('Alert', 'You cannot vote. You have already Voted!!');
    }
}
  

  function renderDetails(){
    return(
      <>
      <View>
      <Text style={styles.heading}>Candidates</Text>
      {candidates.map((candidate) => (
        <View key={candidate} style={styles.card}>
          <Text style={styles.candidateText}>{candidate.name}</Text>
          <TouchableOpacity style={styles.voteButton} onPress={() => onpress(candidate.name)}
              // Disable button if user can't vote
            >
            <Text style={styles.voteButtonText}>Vote</Text>
          </TouchableOpacity>
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
          <Text style={styles.heading}>No Election Data...</Text>
          <TouchableOpacity style={styles.voteButton} onPress={() =>navigation.navigate("Result")}>
        <Text style={styles.voteButtonText}>
          Previous Elections
        </Text>
      </TouchableOpacity>
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
    backgroundColor: '#007bff', // Blue color for the vote button
    borderRadius: 8,
    padding: 10,
    margin:20,
    marginTop:50
  },
  voteButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold',
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

export default ElectionStarted;
