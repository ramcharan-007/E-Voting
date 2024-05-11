import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from "../../Backend/config/config";
import { ref, onValue, remove } from "firebase/database";

const ViewCandidates = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = () => {
      const candidatesRef = ref(db, "candidates/");
      onValue(candidatesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const candidatesList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setCandidates(candidatesList);
        }
      });
    };

    fetchCandidates();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this candidate?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const candidateRef = ref(db, `candidates/${id}`);
            remove(candidateRef)
              .then(() => {
                Alert.alert("Success", "Candidate deleted successfully");
              })
              .catch((error) => {
                Alert.alert("Error", `Failed to delete candidate: ${error.message}`);
              });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderCandidateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.candidateContainer}
      onPress={() => handleDelete(item.id)}
    >
      <View style={styles.candidateBox}>
        <Text>Name: {item.name}</Text>
        <Text>Department: {item.department}</Text>
        <Text>Age: {item.age}</Text>
        <Text>Phone: {item.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Candidate's List</Text>
      <FlatList
        data={candidates}
        renderItem={renderCandidateItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flatList: {
    width: '100%',
  },
  candidateContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  candidateBox: {
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ViewCandidates;
