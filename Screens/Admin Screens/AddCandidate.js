import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Fontisto } from "@expo/vector-icons";
// import axios from "axios";
// import * as DocumentPicker from "expo-document-picker";
import { db } from "../../Backend/config/config";
import {set, ref} from "firebase/database";
import { useState } from "react";

export default function AddCandidate({ navigation }) {
  const [name, setname] = useState("");
  const [department, setDepartment] = useState("");
  const [age, setAge] = useState();
  const [phone, setPhone] = useState();

  // const [pickedImage, setPickedImage] = useState(null);
  // const pickImage = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: "image/*", // Set the type according to your requirements
  //     });

  //     if (result.type === "success") {
  //       const pickedImagei = result.assets[0]
  //       setPickedImage(pickedImagei)
  //       console.log(
  //         result.uri,
  //         result.type, // mime type
  //         result.name,
  //         result.size
  //       );

  //       setPickedImage(result.uri);
  //     } else if (result.type === "cancel") {
  //       console.log("Document picker canceled by the user");
  //     } else {
  //       // The document picker encountered an error
  //       console.error("Error picking document:", result);
  //     }
  //   } catch (err) {
  //     // Handle other errors
  //     console.error("Error picking document:", err);
  //   }
  // };

  // const handleRegister = () => {
  //   const user = {
  //     name: name,
  //     email: email,
  //     password: password,
  //   };

  //   fetch("https://192.168.0.101:3000/addCandidate", user, {
  //     httpsAgent: { rejectUnauthorized: false },
  //   })
  //     .then((response) => {
  //       console.log(response);
  //       Alert.alert(
  //         "Registration succesfull",
  //         "You have been registered succesfully"
  //       );
  //       setname("");
  //       setEmail("");
  //       setPassword("");
  //     })
  //     .catch((error) => {
  //       Alert.alert(
  //         "Registration failed",
  //         "An error occurred during registration"
  //       );
  //       console.log("error", error);
  //     });
  // };

  const handleRegister = () => {
    set(ref(db, 'candidates/' + name), {
        name:name,
        department: department,
        age: age,
        phone: phone,
    });
    setname('');
    setDepartment('');
    setAge('');
    setPhone('');

    Alert.alert("Register successfully","Congralutions!!! You were succesflly register to voter helpline");
}

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontFamily: "sans-serif",
          fontSize: 30,
          margin: 30,
          fontWeight: "bold",
        }}
      >
        Voting Help Line
      </Text>
      <Text
        style={{
          fontFamily: "sans-serif",
          fontSize: 25,
          marginBottom: 5,
          fontWeight: "900",
        }}
      >
        Register Candidates
      </Text>
      <View style={styles.input}>
        <MaterialIcons
          name="drive-file-rename-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          placeholder="Candidate Name"
          value={name}
          onChangeText={(text) => setname(text)}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.input}>
        <MaterialIcons
          name="drive-file-rename-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={(text) => setAge(text)}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.input}>
        <MaterialIcons
          name="drive-file-rename-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          placeholder="Department"
          value={department}
          onChangeText={(text) => setDepartment(text)}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.input}>
        <MaterialIcons
          name="drive-file-rename-outline"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          style={styles.inputBox}
        />
      </View>
      <View style={styles.button}>
        <View style={{ margin: 10 }}>
          <Button title="Add" onPress={handleRegister} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  input: {
    borderColor: "black",
    borderRadius: 7,
    borderWidth: 2,
    marginVertical: 10,
    width: 250,
    height: 40,
    flexDirection: "row",
  },
  inputBox: {
    height: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: 200,
  },
  icon: {
    margin: 5,
  },
  button: {
    flexDirection: "row",
    margin: 7,
  },
});
