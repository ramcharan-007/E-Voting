import {View, Text} from 'react-native';
import React, {Component} from 'react';


export default class NewsView extends Component{

    constructor(props){
        super(props);
     
        this.data = props.data;
    }
    
    render(){
        console.log(this.data);
        return(
            <View>
                <Text>Hello</Text>
                
            </View>
        )
    }
}