// import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./Screens/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "./Screens/Dashboard";
import Election from "./Screens/Election";
import News from "./Screens/News";
import Help from "./Screens/Help";
// import OTP from "./Screens/Verification/OTP";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Dashboard" component={Dashboard}/>
        <Stack.Screen name="Election" component={Election}/>
        <Stack.Screen name="News" component={News}/>
        <Stack.Screen name="Help" component={Help}/>
        {/* <Stack.Screen name="OTP" component={OTP} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
