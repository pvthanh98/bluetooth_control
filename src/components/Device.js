import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
export default function Device (props){
    let {devices, changeDevice} = props.route.params;
    return <View style={styles.container}> 
        <FlatList 
            data = {devices}
            renderItem={({item})=> <Text>{item.name}</Text>}
        />
        <TouchableOpacity onPress={changeDevice}>
            <Text>OK</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center"
    }
})