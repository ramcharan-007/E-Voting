import {View, Text, SafeAreaView, TextInput, KeyboardAvoidingView , Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import axios from 'axios';


import { useState } from 'react';

export default function AddCandidate({navigation}){
    const [name, setname] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();

    const handleRegister = () =>{
        const user = {
            name: name,
            email: email,
            password: password
        }

        fetch('https://192.168.0.101:3000/addCandidate', user, { httpsAgent: { rejectUnauthorized: false } })
.then((response) => {
            console.log(response)
            Alert.alert("Registration succesfull", "You have been registered succesfully");
            setname("")
            setEmail("")
            setPassword("");
        }).catch((error) =>{
            Alert.alert("Registration failed","An error occurred during registration")
            console.log("error", error);
        })

    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontFamily:'sans-serif',fontSize:30, margin:30, fontWeight:'bold'}}>Voting Help Line</Text>
            <Text style={{fontFamily:'sans-serif',fontSize:25,marginBottom:5, fontWeight:'900'}}>Register Candidates</Text>
            <View style={styles.input}>
                <MaterialIcons name="drive-file-rename-outline" size={24} color="black" style={styles.icon}/>
                <TextInput placeholder='Candidate Name' value={name} onChangeText={(text) => setname(text)} style={styles.inputBox}/>
            </View>
            <View style={styles.input}>
                <MaterialIcons name="drive-file-rename-outline" size={24} color="black" style={styles.icon}/>
                <TextInput placeholder='Age' value={name} onChangeText={(text) => setname(text)} style={styles.inputBox}/>
            </View>
            
            <View  style={styles.button}>
            <View style={{margin:10}}>
                <Button title='Add' onPress={handleRegister}/>
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