import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { db } from "../../Backend/config/config";
import { ref, onValue } from "firebase/database";

const ViewCandidates = () => {
  const [vdata, setData] = useState([]);

  useEffect(() => {
    const starCountRef = ref(db, "candidates/");
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      const newdata = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      console.log(newdata);
      setData(newdata);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Candidate's List</Text>
      <FlatList
        data={vdata}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.viewbox}>
            <Text>{item.name}</Text>
            <Text>{item.department}</Text>
            <Text>{item.age}</Text>
            <Text>{item.phone}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        style={{ width: '100%' }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
  },
  viewbox: {
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 7,
    padding: 10,
    margin: 10,
    width: Dimensions.get('window').width * 0.9
  }
});

export default ViewCandidates;
