// import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./Screens/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "./Screens/Dashboard";
import Election from "./Screens/Election";
import News from "./Screens/News";
import Help from "./Screens/Help";
import Admin from "./Screens/Admin";
import 'react-native-gesture-handler';
import Register from "./Screens/Register";
import AddCandidate from "./Screens/Admin Screens/AddCandidate";
import AddVoters from "./Screens/Admin Screens/AddVoters";


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Login" component={LoginPage} options={{headerShown:false}} />
    //     <Stack.Screen name="Dashboard" component={Dashboard} options={{headerShown:false}}/>
    //     <Stack.Screen name="Election" component={Election}/>
    //     <Stack.Screen name="News" component={News}/>
    //     <Stack.Screen name="Help" component={Help}/>
    //     <Stack.Screen name="Admin" component={Admin} />
    //     <Stack.Screen name="Register" component={Register} />
    //     <Stack.Screen name="Candidate" component={AddCandidate} />
    //     <Stack.Screen name="Voters List" component={AddVoters} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <AddCandidate />
  );
}
