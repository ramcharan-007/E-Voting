import { View, Button, Text, StyleSheet, Pressable, TouchableOpacity,Alert, Dimensions } from 'react-native';
import { FlatList } from 'react-native';
import GridView from "./View/GridView";
import {AntDesign} from "@expo/vector-icons";
import {firebase} from "../Backend/config/config"

const DATA = [
    {
        id: '1',
        title: 'Manage Candidate'
    },
    {
        id: '2',
        title: 'Manage Election'
    },
    {
        id: '3',
        title: 'Manage Voters'
    },
    {
        id: '4',
        title: 'View Candidates'
    },
    {
        id: '5',
        title: 'Result'
    }
];


function Admin({navigation}) {

    async function logout(){
        try{
          await firebase.auth().signOut();
          Alert.alert('Log Out', 'You have been logged out.');
          // Navigate to the Login page
          navigation.navigate('Login'); 
        }
        catch (error) {
          console.error('Error during logout:', error);
          Alert.alert('Error', 'An error occurred while logging out.');
        }
      }
    return (
        <>
        <View style={{justifyContent:"center", alignItems:"center", marginTop:100, marginBottom:50}}>
        <AntDesign name="user" size={30} color="white" style={styles.profileIcon} />
            <Text style={{fontSize:30, fontWeight:"bold", textAlign:"center"}}>Admin</Text>
        </View>
        <FlatList
        key={DATA.id}
            data={DATA}
            renderItem={(itemData) => <GridView text={itemData.item.title} id={itemData.item.id} comp={navigation} />}
            keyExtractor={item => item.id}
            numColumns={2}
        />
        <View>
        <TouchableOpacity style={styles.logoutButton} onPress={() =>logout()}><Text style={styles.logoutButtonText}>Log Out</Text></TouchableOpacity>
        </View>
        </>
    );
}

export default Admin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        height: Dimensions.get("window").height * 0.8,
        paddingHorizontal: 20,
    },
    button: {
        width: 200,
        height: 200,
        color: 'orange',
        backgroundColor: 'black',
        margin: 8,
    },
    buttonContainer: {
        flex: 5,
        // flexDirection:'row',
    },
    boxContainer: {
        margin: 24,
        backgroundColor: 'red',

    },
    logoutButton: {
        backgroundColor: '#FF6347', // Tomato red color
        borderRadius: 10, // Rounded corners
        paddingVertical: 12, // Vertical padding for button height
        paddingHorizontal: 24, // Horizontal padding for button width
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 4 }, // Shadow offset
        shadowOpacity: 0.3, // Shadow opacity
        shadowRadius: 5, // Shadow radius
        elevation: 6, // Elevation for Android
        alignItems: 'center', // Center the text in the button
        // marginBottom:1,
      },
      logoutButtonText: {
        color: '#FFF', // White text
        fontWeight: 'bold', // Bold text
        fontSize: 16, // Font size
      },
      profileIcon: {
        marginRight: 10,
        backgroundColor:"black"
    },
})