import { SafeAreaView, Text, View, StyleSheet, Dimensions } from "react-native";
import { db } from "../../Backend/config/config";
import {ref, onValue } from "firebase/database";
import {useState, useEffect} from "react";


const ViewCandidates = () => {
  const  [vdata, setData] = useState([]);
  useEffect( () => {
    const starCountRef = ref(db, "candidates/");
    onValue(starCountRef, (snapshot)=> {
      const data = snapshot.val();
      const newdata = Object.keys(data).map(key => ({
        id:key,
        ...data[key]
      }));
      console.log(newdata);
      setData(newdata);
    });
  }, [])
  return (
    <View style={styles.container}>
      <Text>Candidate's List</Text>
      {
        vdata.map((item, index) =>{
          return (
            <View key={index} style={styles.viewbox}>
              <Text>{item.name}</Text>
              <Text>{item.department}</Text>
              <Text>{item.age}</Text>
              <Text>{item.phone}</Text>
              </View>
          )
        })
      }
    </View>
  )
}

export default ViewCandidates;

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems:"center"
  },
  viewbox:{
    borderColor:"black",
    borderWidth:2,
    borderRadius:7,
    padding:10,
    margin:10,
    width:Dimensions.get('window').width * 0.9
  }
})