import React, { useState, useEffect, ActivityIndicator } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Button,
} from "react-native";
import { ref, onValue, set, update, get, push } from "firebase/database";
import { db } from "../../Backend/config/config";
import { useNavigation } from "@react-navigation/native";
import StartElection from "./ElectionStart";

const ManageElection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [showSelectedModal, setShowSelectedModal] = useState(false);
  const [isElectionOngoing, setIsElectionOngoing] = useState(false);
  const [candidatesWithVotes, setCandidatesWithVotes] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchElectionStatus = async () => {
      try {
        const snapshot = await get(ref(db, "election/state"));
        const status = snapshot.val() ? snapshot.val().status : null;

        if (status === "ongoing") {
          setIsElectionOngoing(true);

          // Fetch the list of candidates
          const candidatesSnapshot = await get(ref(db, "election/candidates"));
          const candidatesData = candidatesSnapshot.val();

          if (candidatesData) {
            const candidatesList = Object.keys(candidatesData).map((key) => ({
              id: key,
              ...candidatesData[key],
            }));
            setCandidatesWithVotes(candidatesList); // Set candidates in state
            console.log("this",candidatesList);
          }
        } else {
          setIsElectionOngoing(false);
        }
      } catch (error) {
        console.error("Error fetching election status:", error.message);
      }
    };

    const fetchCandidates = async () => {
      const candidatesRef = ref(db, "candidates/");
      onValue(candidatesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const candidatesData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCandidates(candidatesData);
        } else {
          console.error("No candidates found.");
          Alert.alert("Error", "No candidates found in the database.");
        }
      });
    };

    const fetchVoters = async () => {
      const votersRef = ref(db, "users/");
      onValue(votersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const votersData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setVoters(votersData);
        } else {
          console.error("No voters found.");
          Alert.alert("Error", "No voters found in the database.");
        }
      });
    };

    const loadData = async () => {
      setIsLoading(true); // Start loading
      await fetchElectionStatus();
      fetchCandidates();
      fetchVoters();
      setIsLoading(false); // End loading
    };

    loadData(); 
  }, [db]);

  

  const toggleCandidateSelection = (id) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(
        selectedCandidates.filter((itemId) => itemId !== id)
      );
    } else {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const toggleVoterSelection = (id) => {
    if (selectedVoters.includes(id)) {
      setSelectedVoters(selectedVoters.filter((itemId) => itemId !== id));
    } else {
      setSelectedVoters([...selectedVoters, id]);
    }
    
  };

  const handleStartElection = async () => {
    // Fetch the current election status
    const statusSnapshot = await get(ref(db, "election/state"));

    const currentStatus = statusSnapshot.val()
      ? statusSnapshot.val().status
      : null;


    

    // Check if there is an ongoing election
    if (currentStatus && currentStatus === "ongoing") {
      setIsElectionOngoing(true);
      // Alert the user that an election is already ongoing
      Alert.alert(
        "An election is already ongoing!!!",
        "Kindly Start an Election once the present election is closed"
      );
      return; // Exit without starting a new election
    }

    try {
      // Set the election state to 'ongoing'
      await set(ref(db, "election/state"), {
        status: "ongoing",
      });

      // Create a new object with each candidate's name as a key and their details (including `voteCount`) as the value
      const candidatesWithVoteCount = {};

      // Loop through the candidate names and add an entry for each with `voteCount` set to 0
      selectedCandidates.forEach((name) => {
        console.log(name);
        candidatesWithVoteCount[name] = {
          voteCount: 0,
        };
      });
      setIsElectionOngoing(true);
      console.log(candidatesWithVoteCount);
      // Set the candidates in the database with the `voteCount` initialized to 0
      set(ref(db, "election/candidates"), candidatesWithVoteCount)
        .then(() => {
          console.log("Candidates added with initial vote count.");
        })
        .catch((error) => {
          console.error("Error setting candidates:", error);
        });

      // Set canVote to true for all selected voters
      const updates = {}; // To hold updates for each voter

      selectedVoters.forEach((uid) => {
        updates[`users/${uid}/canVote`] = true;
      });

      await update(ref(db), updates);

      // Navigate to StartEletion
      navigation.navigate("StartEletion");
    } catch (error) {
      console.log(error.message);
      Alert.alert("Error", `Failed to start the election: ${error.message}`);
    }
  };

  const handleEndElection = async () => {
    try {
      // Step 1: Read data from 'election/candidates'
      const candidatesRef = ref(db, 'election/candidates');
      const snapshot = await get(candidatesRef);
      
      if (snapshot.exists()) {
        const candidatesData = snapshot.val();
  
        // Find the candidate with the highest votes
      let highestVotes = -1; // Initialize with a low value
      let winner = null; // No winner initially

      // Iterate through the candidates to find the one with the most votes
      for (const [name, details] of Object.entries(candidatesData)) {
        if (details.voteCount > highestVotes) {
          highestVotes = details.voteCount; // Update highest votes
          winner = name; // Update winner
        }
      }

      // Step 2: Generate a unique ID and write data to 'Result/uniqueID'
      const uniqueID = Date.now().toString(); // Unique ID based on timestamp
      await set(ref(db, `Result/${uniqueID}`), {
        candidates: candidatesData, // Store all candidates
        winner, // Store the name of the winner
      });


        // Step 3: Clear data in 'election/candidates'
        await set(candidatesRef, null); // Setting to null removes the data
  
        console.log('Candidates data transferred and cleared. and winner is ', winner);
      } else {
        console.warn('No candidates data found.');
      }
  
      // Update the status in the Firebase Realtime Database to "noElections"
      await set(ref(db, 'election/state'), 'noElections');
      setIsElectionOngoing(false);
      console.log('Election status updated to noElections.');
    } catch (error) {
      console.error('Error during end election process:', error);
    }
  };

  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowAddCandidateModal(true)}
      >
        <Text style={styles.modalButtonText}>Add Candidate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowAddVoterModal(true)}
      >
        <Text style={styles.modalButtonText}>Add Voter</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowSelectedModal(true)}
      >
        <Text style={styles.modalButtonText}>Show Selected</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowModal(false)}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isElectionOngoing ? (
        <>
          <View style={styles.modalContainer}>
            <StartElection/>
            <View>
              <TouchableOpacity style={styles.modalButton} onPress={() => handleEndElection()}>
                <Text style={styles.modalButtonText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View>
            <Button
              title="Manage Election"
              onPress={() => setShowModal(true)}
            />
            <Text>No On Going Elections</Text>
          </View>
        </>
      )}

      <Modal visible={showModal} animationType="slide">
        {renderModalContent()}
      </Modal>
      <Modal visible={showAddCandidateModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Add Candidate</Text>
          <FlatList
            data={candidates}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleCandidateSelection(item.id)}
                style={[
                  styles.itemContainer,
                  selectedCandidates.includes(item.id) && styles.selectedItem,
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          <Button
            title="Close"
            onPress={() => setShowAddCandidateModal(false)}
          />
        </View>
      </Modal>
      <Modal visible={showAddVoterModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Add Voter</Text>
          <FlatList
            data={voters}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => toggleVoterSelection(item.id)}
                style={[
                  styles.itemContainer,
                  selectedVoters.includes(item.id) && styles.selectedItem,
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
          <Button title="Close" onPress={() => setShowAddVoterModal(false)} />
        </View>
      </Modal>
      <Modal visible={showSelectedModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Selected Candidates</Text>
          <FlatList
            data={candidates.filter((candidate) =>
              selectedCandidates.includes(candidate.id)
            )}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <Text>Selected Voters</Text>
          <FlatList
            data={voters.filter((voter) => selectedVoters.includes(voter.id))}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleStartElection}
          >
            <Text style={styles.modalButtonText}>Start Election</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowSelectedModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewbox: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get("window").width * 0.9,
  },
  itemContainer: {
    backgroundColor: "transparent",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedItem: {
    backgroundColor: "#e0e0e0",
  },
  modalButton: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get("window").width * 0.9,
  },
  candidateCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: Dimensions.get("window").width * 0.9,
    height: 200,
  },
});
export default ManageElection;
