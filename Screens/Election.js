import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { ref, get } from 'firebase/database';
import {db} from "../Backend/config/config";


const Election = ({navigation}) => {
  const [isElectionActive, setIsElectionActive] = useState(true); // 'null' indicates loading state

  useEffect(() => {
    const fetchElectionState = async () => {
      try {
        // Fetch the current election status
        const statusSnapshot = await get(ref(db, 'election/state'));
        const currentStatus = statusSnapshot.val() ? statusSnapshot.val().status : null;

    // Check if there is an ongoing election
        if (currentStatus && currentStatus === 'ongoing') {
            setIsElectionActive(true);
        }
      } catch (error) {
        console.error('Error fetching election state:', error);
        // Alert.alert('Error', 'Unable to fetch election state.');
        setIsElectionActive(false); // Treat as no ongoing election
      }
    };

    fetchElectionState(); // Fetch election state when component mounts
  }, []);

  if (isElectionActive === false) {
    // Show loading indicator while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isElectionActive) {
    //return <StartElection />; // Show the election start screen if it's ongoing
    navigation.navigate("ElectionStarted");
  }
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noElectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noElectionText: {
    fontSize: 25,
    textAlign: 'center',
  },
});

export default Election;
