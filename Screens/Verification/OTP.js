import React, { useRef } from 'react';
import OTPTextInput from 'react-native-otp-textinput';
import {View, Button, Text} from 'react-native';

export default OTP = () => {
    let otpInput = useRef(null);

    const clearText = () => {
        otpInput.current.clear();
    }

    const setText = () => {
        otpInput.current.setValue("1234");
    }

    return (
        <View>
            <Text style={{fontFamily:'sans-serif', 
            fontWeight:'bold', 
            fontSize:40, 
            justifyContent:'center',
            alignItems:'center',
            marginLeft:'25%',
            marginTop:200 }}>Enter OTP</Text>
            <OTPTextInput containerStyle={{marginTop:'10%'}}/>
            {/* <Button title='Submit' onPress={() => {console.log("Hello")}}/> */}
        </View>
    )
}