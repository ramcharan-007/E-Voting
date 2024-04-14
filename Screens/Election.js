import {View, StyleSheet} from 'react-native';
import Metamask from './metamask';

function Election(){
    return (
        <View style={styles.container}>
            <Metamask />
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