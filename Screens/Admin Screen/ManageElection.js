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
  TextInput,
} from "react-native";
import { ref, onValue, set, update, get, push } from "firebase/database";
import { db } from "../../Backend/config/config";
import { useNavigation } from "@react-navigation/native";
import StartElection from "./ElectionStart";
import { W3mButton } from "@web3modal/wagmi-react-native";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useSignMessage,
  useWaitForTransaction,
} from "wagmi";
import { ContractABI, ContractAddress } from "../../Constants/Constants";
import { AppState } from 'react-native';

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
  const { address, isConnected, isDisconnected } = useAccount();
  const [electionInterval, setElectionInterval] = useState(0);
  // const { data, isError, isLoading:isLoadingSignature, isSuccess, signMessage } = useSignMessage({
  //   message: 'gm wagmi frens'
  // })

  const {
    data: ContractName,
    isError,
    isLoading: iscontractLoading,
    isSuccess,
  } = useContractRead({
    address: "0x1918469F87b66Bb4226bF3e197cd44c620045cA9",
    abi: ContractABI,
    functionName: "getResult",
  });

  const waitforResultTransaction = useWaitForTransaction({
    hash: ContractName?.hash,
  });

  const { config } = usePrepareContractWrite({
    address: "0x1918469F87b66Bb4226bF3e197cd44c620045cA9",
    abi: ContractABI,
    functionName: "initialize",
    args: [selectedCandidates, selectedVoters],
    account: "0xaEBAc2c6c71e433e308e08ADD5D2A211e3e184AC",
    // chainId: 11155111, // for sepolia
    // chainId: 59140 // for linea gerolia
    chainId: 137,
  });

  console.log(ContractName);
  const {
    data: writeCOntractName,
    isLoading: iswriteCOntractLoading,
    isSuccess: iswriteContractSuccess,
    write,
  } = useContractWrite(config);
  const waitForTransaction = useWaitForTransaction({
    hash: writeCOntractName?.hash,
  });

  const navigation = useNavigation();

  useEffect(() => {
    checkElectionStatus();
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
            console.log("this", candidatesList);
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
    try {
      // Fetch the current election status
      const statusSnapshot = await get(ref(db, "election/state"));
      const currentStatus = statusSnapshot.val() ? statusSnapshot.val().status : null;
  
      // Check if there is an ongoing election
      if (currentStatus && currentStatus === "ongoing") {
        setIsElectionOngoing(true);
        Alert.alert(
          "An election is already ongoing!!!",
          "Kindly Start an Election once the present election is closed"
        );
        return; // Exit without starting a new election
      }
      
      write();
      // Set the election state to 'ongoing' with a time duration
      const electionDurationInMinutes = electionInterval; // e.g., 60 minutes
      const electionEndTime = Date.now() + electionDurationInMinutes * 60 * 1000;
  
      await set(ref(db, "election/state"), {
        status: "ongoing",
        endTime: electionEndTime,
      });
  
      // Initialize candidates with vote count set to 0
      const candidatesWithVoteCount = {};
      selectedCandidates.forEach(name => {
        candidatesWithVoteCount[name] = { voteCount: 0 };
      });
      await set(ref(db, "election/candidates"), candidatesWithVoteCount);
  
      // Set canVote to true for all selected voters
      const updates = {};
      selectedVoters.forEach(uid => {
        updates[`users/${uid}/canVote`] = true;
      });
      await update(ref(db), updates);
  
      setIsElectionOngoing(true);
      Alert.alert("Alert", "Election Initiated");
  
      // Navigate to StartElection
      navigation.navigate("StartEletion");
    } catch (error) {
      console.error("Failed to start the election:", error.message + electionInterval);
      Alert.alert("Error", `Failed to start the election: ${error.message} ${electionInterval}`);
    }
  };
  


  const handleEndElection = async () => {
    try {
      // Step 1: Read data from 'election/candidates'
      const candidatesRef = ref(db, "election/candidates");
      const snapshot = await get(candidatesRef);

      if (isSuccess && waitforResultTransaction) {
        Alert.alert("Success!!", `Result recorded in blockchain`);
      }
      resultFUnction();

      async function resultFUnction() {
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

          console.log(
            "Candidates data transferred and cleared. and winner is ",
            winner
          );
        } else {
          console.warn("No candidates data found.");
        }

        // Update the status in the Firebase Realtime Database to "noElections"
        await set(ref(db, "election/state"), "noElections");
        setIsElectionOngoing(false);
        console.log("Election status updated to noElections.");
      }
    } catch (error) {
      console.error("Error during end election process:", error);
    }
  };


  const checkElectionStatus = async () => {
    try {
      // Fetch the current election state
      const statusSnapshot = await get(ref(db, "election/state"));
      const electionState = statusSnapshot.val();
  
      if (electionState && electionState.status === "ongoing") {
        const currentTime = Date.now();
        const electionEndTime = electionState.endTime;
  
        // If the current time is past the election end time, end the election
        if (currentTime >= electionEndTime) {
          await handleEndElection();
        } else {
          // Set a timeout to end the election when the time expires
          setTimeout(() => {
            handleEndElection();
          }, electionEndTime - currentTime);
        }
      }
    } catch (error) {
      console.error("Error checking election status:", error.message);
    }
  };
  

  const renderModalContent = () => (
    <>
      <View style={{ justifyContent: "center", marginTop: 100 }}>
        <Text style={{ fontSize: 30, textAlign: "center", fontWeight: "bold" }}>
          Admin Functions
        </Text>
      </View>
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
      </View>
      <TouchableOpacity
        style={styles.modalButton}
        onPress={() => setShowModal(false)}
      >
        <Text style={styles.modalButtonText}>Close</Text>
      </TouchableOpacity>
    </>
  );

  function isWalletConnected() {
    if (isConnected) {
      setShowModal(true);
    } else {
      Alert.alert(
        "Alert",
        "Connect Your Web3 Wallet in order to initiate an election"
      );
    }
  }

  return (
    <View style={styles.container}>
      <W3mButton />
      {isElectionOngoing ? (
        <>
          <View style={styles.modalContainer}>
            <StartElection />
            <View>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleEndElection()}
              >
                <Text style={styles.modalButtonText}>End</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View>
            <TouchableOpacity
              onPress={() => isWalletConnected()}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Manage Election</Text>
            </TouchableOpacity>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
            >
              No On Going Elections
            </Text>
          </View>
        </>
      )}

      <Modal visible={showModal} animationType="slide">
        {renderModalContent()}
      </Modal>
      <Modal visible={showAddCandidateModal} animationType="slide">
        <View style={styles.showVoterCandidateModal}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Add Candidate
          </Text>
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
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowAddCandidateModal(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={showAddVoterModal} animationType="slide">
        <View style={styles.showVoterCandidateModal}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Add Voter
          </Text>
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
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowAddVoterModal(false);
            }}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={showSelectedModal} animationType="slide">
        <View style={styles.showVoterCandidateModal}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Selected Candidates
          </Text>

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
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: 10,
            }}
          >
            Selected Voters
          </Text>
          <FlatList
            data={voters.filter((voter) => selectedVoters.includes(voter.id))}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <View>
            <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              margin: 10,
            }}
            >Set Election Interval</Text>
          </View>
          <TextInput 
            value={electionInterval}
            onChangeText={(e) => setElectionInterval(e)}
            placeholder="Election internal in minutes"
            keyboardType="numeric"
            style={{textAlign:"center", margin:10, borderColor:"black",  padding:10, borderWidth:2}}
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
    // justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    margin: 50,
    marginTop: 80,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Elevation for Android shadows
    shadowColor: "#000", // Shadow color for iOS shadows
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS shadows
    shadowOpacity: 0.25, // Shadow opacity for iOS shadows
    shadowRadius: 3.84, // Shadow radius for iOS shadows
  },
  showVoterCandidateModal: {
    marginTop: 30,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Elevation for Android shadows
    shadowColor: "#000", // Shadow color for iOS shadows
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS shadows
    shadowOpacity: 0.25, // Shadow opacity for iOS shadows
    shadowRadius: 3.84, // Shadow radius for iOS shadows
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
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.8,
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
    justifyContent: "center",
    width: Dimensions.get("window").width * 0.8,
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
