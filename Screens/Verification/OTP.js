// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import OTPInputView from '@twotalltotems/react-native-otp-input';

// const OTPScreen = () => {
//   const [otp, setOtp] = useState();

//   const handleOTPSubmit = async () => {
//     try {
//       // Simulate server verification (replace with actual server verification logic)
//       const response = await verifyOTP(otp);

//       if (response.success) {
//         Alert.alert('Success', 'OTP Verified!');
//         // You can navigate to the next screen or perform any other action
//       } else {
//         Alert.alert('Error', response.message);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Something went wrong.');
//     }
//   };

//   const verifyOTP = async (otp) => {
//     // Simulate server verification (replace with actual server verification logic)
//     // For demonstration, we assume the correct OTP is "123456"
//     const correctOTP = '123456';

//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (otp === correctOTP) {
//           resolve({ success: true });
//         } else {
//           resolve({ success: false, message: 'Invalid OTP' });
//         }
//       }, 1000);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>OTP Verification</Text>
//       <Text style={styles.subtitle}>Enter the OTP sent to your mobile number</Text>

//       <OTPInputView
//         style={styles.otpInput}
//         pinCount={6}
//         code={otp}
//         onCodeChanged={(code) => setOtp(code)}
//         autoFocusOnLoad
//         codeInputFieldStyle={styles.underlineStyleBase}
//         codeInputHighlightStyle={styles.underlineStyleHighLighted}
//       />

//       <TouchableOpacity style={styles.submitButton} onPress={handleOTPSubmit}>
//         <Text style={styles.submitButtonText}>Submit OTP</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   otpInput: {
//     width: '80%',
//     height: 100,
//     marginBottom: 20,
//   },
//   underlineStyleBase: {
//     width: 30,
//     height: 45,
//     borderWidth: 0,
//     borderBottomWidth: 1,
//     color: '#333',
//     fontSize: 24,
//   },
//   underlineStyleHighLighted: {
//     borderColor: '#007AFF',
//   },
//   submitButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 8,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default OTPScreen;
