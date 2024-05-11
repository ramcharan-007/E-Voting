import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { db } from "../../Backend/config/config";
import { ref, onValue, remove } from "firebase/database";

const AddVoters = () => {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    const fetchVoters = () => {
      const votersRef = ref(db, "users/");
      onValue(votersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const votersList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setVoters(votersList);
        }
      });
    };

    fetchVoters();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this voter?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const voterRef = ref(db, `users/${id}`);
            remove(voterRef)
              .then(() => {
                Alert.alert("Success", "Voter deleted successfully");
              })
              .catch((error) => {
                Alert.alert("Error", `Failed to delete voter: ${error.message}`);
              });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const renderVoterItem = ({ item }) => {
    if (!item.name || !item.email || !item.phone) {
      return null; // Do not render if any of the fields are null
    }

    return (
      <TouchableOpacity
        style={styles.voterContainer}
        onPress={() => handleDelete(item.id)}
      >
        <View style={styles.voterBox}>
          <Text>Name: {item.name}</Text>
          <Text>Email: {item.email}</Text>
          <Text>Phone: {item.phone}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voter's List</Text>
      <FlatList
        data={voters}
        renderItem={renderVoterItem}
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
  voterContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  voterBox: {
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

export default AddVoters;
