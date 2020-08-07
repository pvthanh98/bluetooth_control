import React from 'react';
import {Text, TouchableOpacity, Alert, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BluetoothSerial from 'react-native-bluetooth-serial';
import {connect} from 'react-redux';
import * as actions from '../actions/index';
class DeviceItem extends React.Component {
  constructor(props) {
    super(props);
  }
  onConnectDevice = async () => {
    const { connectedDevice } = this.props;
    const deviceId = this.props.item.id;
    if(((connectedDevice && connectedDevice.id) === deviceId)) {
      Alert.alert('','This device has been connecting...');
    } else{
        try {
            this.props.setConnectting();
            console.log("DEVICE ID TO CONNECT: ", deviceId)
            await BluetoothSerial.connect(deviceId);
            this.props.setConnectting();
            this.props.bluetooth_connect_to(this.props.item);
        } catch (e) {
            this.props.bluetooth_connect_to(null);
            alert(e);
        }
    }
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
        <TouchableOpacity 
          style={this.props.ItemStyle} 
          onPress={this.onConnectDevice}
        > 
          <View>  
            <Icon name="desktop" size={30} />
          </View>
          <View>
            <Text style={{marginLeft:8, padding:2, fontWeight:"700"}}> {this.props.item.name}</Text>
            <Text style={{marginLeft:8,padding:2}}> {this.props.item.id}</Text>
          </View>   
        </TouchableOpacity>
    );
  }
}


export default connect(state=>{
  return {
    connectedDevice: state.connectedDevice
  }
}, (dispatch)=>{
  return {
    bluetooth_connect_to: (device)=>{
      dispatch(actions.bluetooth_connect(device))
    }
  }
})(DeviceItem);
