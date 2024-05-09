import { View, Button, Text, StyleSheet, Pressable, TouchableOpacity,Alert } from 'react-native';
import { FlatList } from 'react-native';
import GridView from "./View/GridView";

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
    return (
        <>
        <FlatList
        key={DATA.id}
            data={DATA}
            renderItem={(itemData) => <GridView text={itemData.item.title} id={itemData.item.id} comp={navigation} />}
            keyExtractor={item => item.id}
            numColumns={2}
        />
        <View>
        <TouchableOpacity onPress={() =>{Alert.alert("You have been logged out!!"); navigation.navigate("Login")}}><Text>Log Out</Text></TouchableOpacity>
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

    }
})