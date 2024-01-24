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

    const handleRegister = () => {
        set(ref(db, 'user/' + name), {
            name:name,
            email: email,
            password: password,
            phone: phone,
        });
        setname('');
        setEmail('');
        setPassword('');
        setPhone('');
        Alert.alert("Register successfully","Congralutions!!! You were succesflly register to voter helpline");
        navigation.navigate("Login");
    }

      const handleSignUp = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'User registered successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    // handleRegister();
  };
    // const handleRegister = () => {
    //     const user = {
    //       name: name,
    //       email: email,
    //       password: password,
    //       phone: phone
    //     };
      
    //     axios.post('http://192.168.0.101:3000/register', user)
    //       .then((response) => {
    //         console.log(response);
    //         Alert.alert("Registration successful", "You have been registered successfully");
    //         setname("");
    //         setEmail("");
    //         setPassword("");
    //         setPhone("");
    //       })
    //       .catch((error) => {
    //         Alert.alert("Registration failed", `An error occurred during registration: ${error.message}`);
    //         console.log("Registration error", error);
    //       });
          
    //   };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontFamily:'sans-serif',fontSize:30, margin:30, fontWeight:'bold'}}>Voting Help Line</Text>
            <Text style={{fontFamily:'sans-serif',fontSize:25,marginBottom:5, fontWeight:'900'}}>Register</Text>
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
            <View style={{margin:10}}>
                <Button title='Register' onPress={handleSignUp}/>
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
    }
})