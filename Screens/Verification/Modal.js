// ModalComponent.js
import React, {useState} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';

const ModalComponent = ({ visible, closeModal }) => {
  const [text, setText] = useState('Enter OTP')
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>Enter the OTP you recieved</Text>
          <TextInput 
          style={styles.input} 
          placeholder='Enter OTP' 
          onChange={setText} 
          value={text}/>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.closeButton}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );3
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    color: 'blue',
  },
  input:{
    borderRadius: 7,
    borderWidth:3,
    borderColor:'black',
    width: 150,
    paddingHorizontal:10,
    paddingVertical:5,
    marginVertical:10
  },
  text:{
    fontFamily:"sans-serif",
    fontSize:15,
    marginBottom:5,

  }
});

export default ModalComponent;
