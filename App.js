// import { StatusBar } from "expo-status-bar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./Screens/LoginPage";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "./Screens/Dashboard";
import Election from "./Screens/Election";
import News from "./Screens/News";
import Help from "./Screens/Help";
import Admin from "./Screens/Admin";
import "react-native-gesture-handler";
import Register from "./Screens/Register";
import AddCandidate from "./Screens/Admin Screen/AddCandidate";
import AddVoters from "./Screens/Admin Screen/AddVoters";
import { firebase } from "./Backend/config/config";
import { useState, useEffect } from "react";
import ManageElection from "./Screens/Admin Screen/ManageElection";
import ViewCandidates from "./Screens/Admin Screen/ViewCandidates";
import ElectionResults from "./Screens/Admin Screen/Result";
// import auth from "@react-native-firebase/auth";
import ElectionStart from "./Screens/Admin Screen/ElectionStart";
import ElectionStarted from "./Screens/ElectionStarted";
import "@walletconnect/react-native-compat";
import { WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, sepolia, lineaTestnet } from "viem/chains";
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from "@web3modal/wagmi-react-native";

const projectId = "71d9c7e7480ee5bef1e5705c71b260da";

// 2. Create config
const metadata = {
  name: "E-Voting Application",
  description: "E-Voting Application.",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

const chains = [polygon ,lineaTestnet, sepolia];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState("");
  const [user, setUser] = useState("");

  // Hamdle user state change
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <WagmiConfig config={wagmiConfig}>
        <Stack.Navigator>
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Election" component={Election} />
          <Stack.Screen name="News" component={News} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen
            name="Admin"
            component={Admin}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="AdminElection" component={ManageElection} />
          <Stack.Screen name="AdminCandidate" component={AddCandidate} />
          <Stack.Screen name="AdminVoters" component={AddVoters} />
          <Stack.Screen name="ViewCandidates" component={ViewCandidates} />
          <Stack.Screen name="StartEletion" component={ElectionStart} />
          <Stack.Screen name="Result" component={ElectionResults} />
          <Stack.Screen name="ElectionStarted" component={ElectionStarted} />
        </Stack.Navigator>
        <Web3Modal />
      </WagmiConfig>
    </NavigationContainer>
  );
}
