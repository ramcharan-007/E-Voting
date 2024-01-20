import {View, Text, StyleSheet} from 'react-native';
import { FlatList } from 'react-native';
import GridviewElection from '../View/GridViewElection';

const PresentElection = [
    {
        id: 1,
        state: 'Karnataka',
    },
    {
        id: 2,
        state: 'Delhi',
    },
    {
        id: 3,
        state: 'Tamil Nadu',
    },
    {
        id: 4,
        state: 'Maharastra',
    },
    {
        id: 5,
        state: 'Kerala',
    },
    {
        id: 6,
        state: 'Gujurat',
    }
]

function Election(){
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Upcoming Election</Text>
            <FlatList data={PresentElection} 
            renderItem={(itemData) => 
            <GridviewElection text={itemData.item.state} id={itemData.item.id} /> } 
            key={PresentElection.id}/>
        </View>
    );
}

export default Election;

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    heading: {
        fontSize:25,
    }
})