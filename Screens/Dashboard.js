import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import DashboardView from '../View/DashboardView';

export default function Dashboard({navigation}){
    
    return (
        <SafeAreaView>
            <ScrollView>
                <DashboardView id='1' name='Election' navigate={navigation}/>
                <DashboardView id='2' name="General News" navigate={navigation}/>
                <DashboardView id='3' name="Help" navigate={navigation}/>
            </ScrollView>
        </SafeAreaView>
    );
}
