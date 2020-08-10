import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {connect} from 'react-redux';
import {ColorPicker, fromHsv} from 'react-native-color-picker';
import {StyleSheet, Text, View, Slider, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BluetoothSerial from 'react-native-bluetooth-serial';
import { convertHexToRgbString } from "./utils";
import * as actions from '../actions/index';
class Home extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        dimmer: 1
      }
  }
  async componentDidMount(){
    console.log("DID MOUNT")
    await this.isBluetoothEnabled();
  }
  isBluetoothEnabled = async () =>{
    const bluetoothState = await BluetoothSerial.isEnabled();
    console.log("Bluetooth state", bluetoothState)
			if (!bluetoothState) {
				this.setState({
					connectedDevice: null,
				});
				Alert.alert(
					"Bluetooth is disabled",
					"Do you want to enable bluetooth?",
					[
						{
							text: "NO",
							onPress: () => console.log("Cancel Pressed"),
							style: "cancel",
						},
						{
							text: "YES",
							onPress: () => this.enableBluetooth(),
						},
					],
					{ cancelable: false }
				);
			}
  }

  enableBluetooth = async () =>{
    await BluetoothSerial.enable();
  }

  sendData = (data) =>{
    BluetoothSerial.write(data)
      .then((res) => {
        console.log(`Successfully wrote "${data}" to device`, res);
      })
    .catch((err) => console.log(err.message));
  }

  handleColorChange = async (color) =>{
    color = fromHsv(color);
    try {
			var data = `color ${convertHexToRgbString(color)}\r`;
			console.log(`Wrote data "${data}" to device`);
			BluetoothSerial.write(data);
		} catch (e) {
			console.log(e);
		}
  }

  setDimmer = async (value) => {
    this.setState({dimmer:value})
    value = Math.round(value *100);
		try {
			var data = `dimmer ${value}\r`;
			console.log(`Wrote data ${data} to device`);
			BluetoothSerial.write(data);
		} catch (e) {
			console.log(e);
		}
  };
  
  onDisconnect = async () =>{
    await BluetoothSerial.disconnect();
    this.props.disConnect();
  }


  render() {
    const { navigation } = this.props;
    const{connectedDevice} = this.props;
    return (
      <View style={styles.container}>
        {
          !this.state.connectedDevice &&
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Icon name="warning" size={16} />
              {" "}Device has not connected
            </Text>
          </View>
        }
        <View style={styles.block1}>
          <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Device')}>
            <Text style={styles.textCenter}>
                <Icon name="bars" size={30} color="#900" /> 
            </Text>
          </TouchableOpacity>
          { this.state.connectedDevice &&
            <Text>
              Connecting: {connectedDevice && connectedDevice.name} {"\n"} 
              {connectedDevice && connectedDevice.id}
              {"  "}
              <TouchableOpacity onPress={this.onDisconnect}>
                {connectedDevice && <Icon name="times-circle" size={16} color="#900" />} 
              </TouchableOpacity>
            </Text>
          }
          
        </View>
        <View style={styles.colorPicker}>
          <ColorPicker
            onColorSelected={(color) => console.log(`Color selected: ${color}`)}
            style={{flex: 1}}
            onColorChange={this.handleColorChange}
          />
         
        </View>
        <View style={styles.block2}>
          <TouchableOpacity 
            style={styles.buttonFlash}
            onPress={()=> this.sendData('flash\r')}
          >
            <Text style={[styles.textCenter, {color:"white"}]}>FLASH</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.buttonFlash}
            onPress={()=> this.sendData('fade\r')}
          >
            <Text style={[styles.textCenter , {color:"white"}]}>FADE</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop:8,marginBottom:16}}>
            <Slider
                value={this.state.dimmer}
                onValueChange={this.setDimmer}
            />
            <Text>{"    "}Value: {Math.round(this.state.dimmer *100)} </Text>
        </View>
        <View>
            <TouchableOpacity 
              style={styles.buttonOff}
              onPress={()=> this.sendData('off\r')}
            >
            <Text style={[styles.textCenter , {color:"white"}]}>OFF</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  colorPicker: {
    height: 380,
  },
  block1: {
    flexDirection: 'row-reverse',
    justifyContent:"space-between"
  },

  block2: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin:16
  },
  button: {
    padding:16
  },
  buttonFlash: {
    margin: 4,
    padding: 16,
    width:120,
    borderRadius:8,
    backgroundColor:"#1abc9c"
  },
  textCenter:{
      textAlign:"center",
      fontWeight:"700"
  },
  slider:{
      padding:8
  },
  buttonOff:{
    padding:12,
    borderRadius:4,
    backgroundColor:"#ff0000"
  },
  warning:{
      alignItems:"center",
      backgroundColor:"yellow",
      padding:4
  },
  warningText:{
    fontSize:16
  }
});

export default connect(state=>{
  return {
    connectedDevice: state.connectedDevice
  }
}, dispatch =>{
  return {
    disConnect : ()=>{
      dispatch(actions.bluetooth_disconnect());
    }
  }
})(Home);
