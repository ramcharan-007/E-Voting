import {View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Button, TextInput} from 'react-native';
import { useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { firebase } from '../Backend/config/config';
import {getAuth, onAuthStateChanged} from "firebase/auth";


export default function LoginPage({navigation}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    function handlerLogin(){
        navigation.navigate("Dashboard")
    }

    function Oncancel(){
        setEmail("");
        setPassword("");
    }

    const loginUser = async (email, password) => {
        console.log(email, password)
        try{
            await firebase.auth().signInWithEmailAndPassword(email, password);
        }catch (error){
            alert(error.message)
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <View>
                    <Text  style={styles.heading}>Voting Application</Text>
                </View>
                <View style={styles.input}>
                <Fontisto name="email" size={24} color="black" style={styles.icon}/>
                    <TextInput style={styles.inputBox}
                    placeholder='Email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCorrect={false}
                    autoCapitalize="none"
                    />
                </View>
                <View style={styles.input}>
                <Fontisto name="email" size={24} color="black" style={styles.icon}/>
                    <TextInput style={styles.inputBox}
                    placeholder='Password'
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    autoCorrect = {false}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    />
                </View>
                <View>
                    <Text>New User? <Text onPress={() => navigation.navigate("Register")}>Register</Text></Text>
                </View>
                <View style={styles.buttonConatiner}>
                    <View  style={styles.button}>
                    <Button title='Login' 
                    onPress={() => loginUser(email, password)}/>
                    </View>
                    <View  style={styles.button}>
                    <Button title='Cancel' onPress={() => {Oncancel()}}/>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    heading: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: 30,
        marginVertical: 70,
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
    buttonConatiner:{
        width:'100%',
        alignContent:'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    button:{
        margin: 28,
        alignItems:'center'
    },
    inputcontainer: {
        flexDirection:'row',
        borderWidth: 4,
        borderColor: '#D24545',
        borderWidth: 2,
        borderRadius:6,
    }
})