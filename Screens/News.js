// import { StyleSheet, 
//         Text, 
//         View, 
//         Alert, 
//         ActivityIndicator, 
//         SafeAreaView, 
//         TouchableOpacity } from 'react-native'
// import React, {useState, useEffect} from 'react'
// import { getArticles } from '../Backend/fetchApi';

// function News(){
//     const [loading, setloading] = useState(false);
//     const [data, setdata ] = useState('');

//     function viewData(){
//         useEffect( () => {
//             getArticles().then(data => {
//                 setloading(false)
//                 setdata(data)
//             }), error => {
//                     Alert.alert("Error", "Something went wrong")
//             }
//         },[])

//         console.log(data);
//         return new Promise((resolve, reject) => {
//             if(loading){
//                 resolve(data)
//             }else{
//                 reject(error)
//             }
//         })
//     }

//     return (
//         <SafeAreaView>
//             <View>
//                {viewData().then((message) => {
//                 console.log(message)
//                }).catch((error) => {
//                 console.log(error)
//                })}
//             </View>
//         </SafeAreaView>
//     );
// }

// export default News

// const styles = StyleSheet.create({})

import React, {Component} from "react";
import { getArticles } from "../Backend/fetchApi";
import { Alert, View, FlatList, Text } from "react-native";
import NewsView from "../View/NewsView";
export default class News extends Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            data: null
        }
    }

    componentDidMount(){
        getArticles().then(data => {
            this.setState({
                isLoading: false,
                data: data
            });
        }, error => {
            Alert.alert("Error", "Something went wrong")
        })
    }

    render(){
        console.log(this.state.data);
        
        return(
            <View>
                <FlatList
                data={this.state.data} 
                renderItem={(itemdata) => <NewsView props={itemdata} />} />
            </View>
        )
    }
}