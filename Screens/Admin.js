import { View, Button, Text, StyleSheet, Pressable } from 'react-native';
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
    }
];


function Admin({navigation}) {
    return (
        <FlatList
        key={DATA.id}
            data={DATA}
            renderItem={(itemData) => <GridView text={itemData.item.title} id={itemData.item.id} comp={navigation} />}
            keyExtractor={item => item.id}
            numColumns={2}
        />
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