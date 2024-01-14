import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

export default function DashboardView({id,name, navigate}){

    function move(id){
        const section = {
            1: "Election",
            2: "News",
            3: "Help"
        }
        return navigate.navigate(section[id]);
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchstyle} onPress={() => move(id)}>
                <Text>{id}</Text>
                <Text>{name}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 50,
        alignItems:'center',
        justifyContent: 'center',
        flex: 1,
    },
    touchstyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#EBD9B4',
        width: 200,
        height: 200
    }
})