import {View, Text, SafeAreaView, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
// import axios from 'axios';
import {firebase, db} from "../Backend/config/config";
import {ref, set} from "firebase/database";
import { useState } from 'react';

export default function Register({navigation}){
    const [name, setname] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();


    const handleSignUp = async () => {
        try {
          // Create the user account in Firebase Authentication
          const authResult = await firebase.auth().createUserWithEmailAndPassword(email, password);
      
          // Get the user UID (unique identifier) from the authentication result
          const uid = authResult.user.uid;
      
          // Save the user data to the Firebase Realtime Database
          set(ref(db, 'users/' + uid), {
            name: name,
            email: email,
            phone: phone,
            metamaskWalletAddress: null,
            canVote: false
          });
      
          // Display a success message
          Alert.alert('Success', 'User registered successfully!');
      
          // Navigate to the login screen
          navigation.navigate('LoginPage');
        } catch (error) {
          // Display an error message
          Alert.alert('Error', error.message);
        }
      };
      

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontFamily:'sans-serif',fontSize:30, margin:30, fontWeight:'bold'}}>Voting Help Line</Text>
            <View style={styles.inputCard}>
            <Text style={{fontFamily:'sans-serif',fontSize:25,marginBottom:5, fontWeight:'900', textAlign:"center"}}>Register</Text>
            <View style={styles.input}>
                <MaterialIcons name="drive-file-rename-outline" size={24} color="black" style={styles.icon}/>
                <TextInput placeholder='Name' value={name} onChangeText={(text) => setname(text)} style={styles.inputBox}/>
            </View>
            <View style={styles.input}>
                <Fontisto name="email" size={24} color="black" style={styles.icon}/>
                <TextInput placeholder='Email' value={email} onChangeText={(text) => setEmail(text)} style={styles.inputBox}/>
            </View>
            <View style={styles.input}>
            <MaterialCommunityIcons name="form-textbox-password" size={24} color="black" style={styles.icon}/>
                <TextInput secureTextEntry={true} placeholder='Password' value={password} onChangeText={(text) => setPassword(text)} style={styles.inputBox}/>
            </View>
            <View style={styles.input}>
                <AntDesign name="phone" size={24} color="black" style={styles.icon} />
                <TextInput placeholder='Phone' value={phone} onChangeText={(text) => setPhone(text)} style={styles.inputBox} keyboardType='numeric' maxLength={10} />
            </View>
            <View style={{marginVertical:20}}>
                <Text>Already have account <Text style={{color:'#007FFF', fontSize:20}} onPress={() => navigation.navigate("Login")}>Login</Text> ?</Text>
            </View>
            <View  style={styles.button}>
            <View style={{margin:10, textAlign:"center"}}>
                <Button title='Register' onPress={handleSignUp}/>
            </View>
            </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:50
    },
    input:{
        borderColor: 'black',
        borderRadius: 7,
        borderWidth: 2, 
        marginVertical: 10,
        width:250,
        height:40,
        flexDirection: 'row'
    },
    inputBox:{
        height:20,
        paddingVertical:2,
        paddingHorizontal: 10,
        marginVertical: 10,
        width:200,
    },
    icon:{
        margin: 5
    },
    button:{
        flexDirection:'row',
        margin:7,
        justifyContent:"center"
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
})