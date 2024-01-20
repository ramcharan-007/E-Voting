import { View, Text, Pressable, StyleSheet, Button } from 'react-native';

function GridView({ id, text}) {
    return (
        <View style={style.gridItem}>
            <Pressable style={style.buttonStyle}>
                <View style={style.innerContainer}>
                    <Text>{id}</Text>
                    <Text>{text}</Text>
                </View>
            </Pressable >
        </View>

    );
}

export default GridView;

const style = StyleSheet.create({
    gridItem: {
        flex:1,
        margin:16,
        height: 150,
        width:250,
        borderRadius: 8,
        elevation:4,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOpacity:0.25,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
    },
    innerContainer:{
        flex:1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonStyle: {
        flex: 1,
    }
})