import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions/index'

function Device (props){

    let {devices} = props;
    return <View> 
        <FlatList 
            style={{padding:4}}
            data = {devices}
            renderItem={({item})=> <TouchableOpacity style={styles.flatItem}>
                <Text>{item.name}</Text>
            </TouchableOpacity>}
        />
        <TouchableOpacity onPress={()=> props.createDevice({id:"8",name:"Thanhphan"})}>
            <Text>OK</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    flatItem:{
        alignItems:"stretch",
        backgroundColor:"#c3c3c3",
        marginTop:4,
        padding:16
    }
})

const mapStateToProps = state => ({
    devices: state.devices,
});
const mapDispatchToProps = dispatch => ({
    createDevice: (device)=>{
        dispatch(actions.createDevice(device))
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Device)