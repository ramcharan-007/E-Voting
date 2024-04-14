import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { db } from "../../Backend/config/config";
import { ref, onValue } from "firebase/database";

const ManageElection = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [showSelectedModal, setShowSelectedModal] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesRef = ref(db, "candidates/");
      onValue(candidatesRef, (snapshot) => {
        const data = snapshot.val();
        const candidatesData = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setCandidates(candidatesData);
      });
    };

    const fetchVoters = async () => {
      const votersRef = ref(db, "users/");
      onValue(votersRef, (snapshot) => {
        const data = snapshot.val();
        const votersData = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setVoters(votersData);
      });
    };

    fetchCandidates();
    fetchVoters();
  }, []);

  const toggleCandidateSelection = (id) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(selectedCandidates.filter(itemId => itemId !== id));
    } else {
      setSelectedCandidates([...selectedCandidates, id]);
    }
  };

  const toggleVoterSelection = (id) => {
    if (selectedVoters.includes(id)) {
      setSelectedVoters(selectedVoters.filter(itemId => itemId !== id));
    } else {
      setSelectedVoters([...selectedVoters, id]);
    }
  };

  const renderAddCandidateModal = () => (
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
                selectedCandidates.includes(item.id) && styles.selectedItem
              ]}
            >
              <View style={styles.viewbox}>
                <Text>{item.name}</Text>
                <Text>{item.department}</Text>
                <Text>{item.age}</Text>
                <Text>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button title="Close" onPress={() => setShowAddCandidateModal(false)} />
      </View>
    </Modal>
  );

  const renderAddVoterModal = () => (
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
                selectedVoters.includes(item.id) && styles.selectedItem
              ]}
            >
              <View style={styles.viewbox}>
                <Text>{item.name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.phone}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button title="Close" onPress={() => setShowAddVoterModal(false)} />
      </View>
    </Modal>
  );

  const renderSelectedModal = () => (
    <Modal visible={showSelectedModal} animationType="slide">
      <View style={styles.modalContainer}>
        <Text>Selected Candidates</Text>
        <FlatList
          data={candidates.filter(candidate => selectedCandidates.includes(candidate.id))}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Text>{item.department}</Text>
              <Text>{item.age}</Text>
              <Text>{item.phone}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text>Selected Voters</Text>
        <FlatList
          data={voters.filter(voter => selectedVoters.includes(voter.id))}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>{item.name}</Text>
              <Text>{item.email}</Text>
              <Text>{item.phone}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity style={styles.modalButton} title="Start Election" onPress={() => handleStartElection()}>
          <Text style={styles.modalButtonText}>Start Election</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} title="Close" onPress={() => setShowSelectedModal(false)} >
          <Text style={styles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const handleStartElection = () => {
    navigation.navigate('StartEletion', {
      selectedCandidates: selectedCandidates,
      selectedVoters: selectedVoters,
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Manage Election" onPress={() => setShowModal(true)} />
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalButton} title="Add Candidate" onPress={() => setShowAddCandidateModal(true)}>
            <Text style={styles.modalButtonText}>Add Candidate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} title="Add Voter" onPress={() => setShowAddVoterModal(true)}>
            <Text style={styles.modalButtonText}>Add Voter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} title="Show Selected" onPress={() => setShowSelectedModal(true)}>
            <Text style={styles.modalButtonText}>Show Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} title="Close" onPress={() => setShowModal(false)} >
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {renderAddCandidateModal()}
      {renderAddVoterModal()}
      {renderSelectedModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewbox: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get('window').width * 0.9
  },
  itemContainer: {
    backgroundColor: 'transparent',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
  modalButton: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get('window').width * 0.9,
  }
});

export default ManageElection;
