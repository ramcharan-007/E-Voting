import {View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Button, TextInput} from 'react-native';
import { useState } from 'react';
import { Octicons } from '@expo/vector-icons';

export default function LoginPage({navigation}){

    const [adhaarnumber, setadhaarnumber] = useState()

    function Oncancel(){
        setadhaarnumber('')
    }

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView>
                <View>
                    <Text  style={styles.heading}>Voting Application</Text>
                </View>
                <View style={styles.inputcontainer}>
                <Octicons name="unverified" size={24} color="black" style={{paddingTop: 15, paddingLeft:5}} />
                    <TextInput style={styles.input}
                    placeholder='Adhaar Number' 
                    maxLength={12}
                    value={adhaarnumber}
                    onChange={setadhaarnumber}
                    keyboardType='numeric' 
                    />
                </View>
                <View style={styles.buttonConatiner}>
                    <View  style={styles.button}>
                    <Button title='Get OTP' 
                    onPress={() => navigation.navigate('Dashboard')}/>
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
    input: {
        
        paddingVertical:2,
        paddingHorizontal: 10,
        marginVertical: 10,   
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