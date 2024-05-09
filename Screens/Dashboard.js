import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert
  } from "react-native";
  import DashboardView from "./View/DashboardView";
  import {firebase} from "../Backend/config/config";

  
  export default function Dashboard({ navigation }) {

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
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={{fontSize:30}}>Dashboard</Text>
        </View>
        <ScrollView>
          <DashboardView id="1" name="Election" navigate={navigation} />
          <DashboardView id="2" name="General News" navigate={navigation} />
          <DashboardView id="3" name="Help" navigate={navigation} />
        </ScrollView>
        <View>
        <TouchableOpacity onPress={() => logout()} style={styles.logoutButton}><Text style={styles.logoutButtonText}>Log Out</Text></TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center', // Center the button horizontally
      justifyContent: 'center', // Center the button vertically
      marginTop:100
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
    },
    logoutButtonText: {
      color: '#FFF', // White text
      fontWeight: 'bold', // Bold text
      fontSize: 16, // Font size
    },
  });
  
  