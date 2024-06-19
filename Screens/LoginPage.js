import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Button,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { ref, update, get } from 'firebase/database';
import { firebase, db } from "../Backend/config/config";
// import { useNavigation } from "@react-navigation/native";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //const navigation = useNavigation();

  const validateInputs = () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password cannot be empty."); // Alert works fine
      return false;
    }
    return true;
  };

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      const currentUser = firebase.auth().currentUser;

      if (currentUser) {
        // Check if user is admin
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (userData && userData.isAdmin) {
          navigation.replace('Admin'); // Navigate to admin page
        } else {
          navigation.navigate('Dashboard'); // Navigate to user dashboard
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

// To set admi privileage
  // const setAdminStatus = async (uid, isAdmin) => {
  //   try {
  //     await update(ref(db, `users/${uid}`), { isAdmin });
  //     console.log(`User ${uid} is now ${isAdmin ? 'an admin' : 'not an admin'}`);
  //   } catch (error) {
  //     console.error('Error setting admin status:', error);
  //   }
  // };
  
  // // // Example: Set a user as admin
  // setAdminStatus('5Q03C5sX4KbGa24DrYqIqOTiT8n1', true); // Set to false to revoke admin privileges

  const handleCancel = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <View>
          <Text style={styles.heading}>Voting Application</Text>
        </View>
        <View style={styles.inputCard}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Fontisto name="email" size={24} color="black" />
              <TextInput
                style={styles.inputBox}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="password" size={24} color="black" />

              <TextInput
                style={styles.inputBox}
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                accessibilityLabel="Password input field"
                // Optional: Allow toggling password visibility
                rightIcon={
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={24}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
            </View>
            
            <Text>
              New User?
              <Text
                onPress={() => navigation.navigate("Register")}
                style={{ color: "#007FFF", fontSize: 20 }}
              >
                {" "}
                Register
              </Text>
            </Text>

            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  title="Login"
                  onPress={() => loginUser(email, password)}
                />
              </View>
              <View style={styles.button}>
                <Button title="Cancel" onPress={handleCancel} />
              </View>
            </View>
          </>
        )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 130,
  },
  heading: {
    fontFamily: "sans-serif",
    fontWeight: "bold",
    fontSize: 30,
    marginVertical: 30,
    textAlign:"center"
  },
  inputContainer: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 7,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    width: 250,
  },
  inputBox: {
    flex: 1,
    height: 20,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 20,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Elevation for Android shadows
    shadowColor: '#000', // Shadow color for iOS shadows
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS shadows
    shadowOpacity: 0.25, // Shadow opacity for iOS shadows
    shadowRadius: 3.84, // Shadow radius for iOS shadows
  },
});

export default LoginPage;
