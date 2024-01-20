import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView , Dimensions} from 'react-native';

export default function DashboardView({ id, name, navigate }) {
  function move(id) {
    const section = {
      1: "Election",
      2: "News",
      3: "Help",
    };
    return navigate.navigate(section[id]);
  }

  const backgroundColors = {
    1: '#FF6961', // Red
    2: '#77DD77', // Green
    3: '#AEC6CF', // Blue-gray
  };

  const containerColor = backgroundColors[id] || '#ffffff'; // Default White

  return (
    <SafeAreaView>
    <View style={[styles.container, { backgroundColor: containerColor }]}>
      <TouchableOpacity style={styles.touchStyle} onPress={() => move(id)}>
        <Text style={styles.idText}>{name}</Text>
        {/* <Text style={styles.nameText}>{name}</Text> */}
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    width:Dimensions.get('window').width * 0.9
  },
  touchStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 150,
    borderRadius: 10,
    padding: 16,
  },
  idText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});