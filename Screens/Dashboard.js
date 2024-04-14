import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Button,
  } from "react-native";
  import DashboardView from "./View/DashboardView";
  
  export default function Dashboard({ navigation }) {
    return (
      <SafeAreaView  style={{alignItems:'center', justifyContent:'center', marginTop:100}}>
        <View>
          <Text style={{fontSize:30}}>Dashboard</Text>
        </View>
        <ScrollView>
          <DashboardView id="1" name="Election" navigate={navigation} />
          <DashboardView id="2" name="General News" navigate={navigation} />
          <DashboardView id="3" name="Help" navigate={navigation} />
          <Button title="Admin" onPress={() => navigation.navigate("Admin")} />
        </ScrollView>
      </SafeAreaView>
    );
  }
  