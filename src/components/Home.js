import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {connect} from 'react-redux';
import {ColorPicker, fromHsv} from 'react-native-color-picker';
import { ColorWheel } from 'react-native-color-wheel';
import {StyleSheet, Text, View, Alert, Image, Dimensions} from 'react-native';
import TimePicker from "react-native-24h-timepicker";
import {TouchableOpacity} from 'react-native-gesture-handler';
import BluetoothSerial from 'react-native-bluetooth-serial';
import {convertHexToRgbString} from './utils';
import * as actions from '../actions/index';
import timerImg from '../assets/timer.png';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null,
      selectedColor: null,
      power: 'off',
    };
  }
  async componentDidMount() {
    console.log('DID MOUNT');
    console.log('Connected device', this.props.connectedDevice);
    //  await this.isBluetoothEnabled();
    BluetoothSerial.on('connectionLost', () => {
      this.props.disConnect();
    });
  }

  isBluetoothEnabled = async () => {
    const bluetoothState = await BluetoothSerial.isEnabled();
    console.log('Bluetooth state', bluetoothState);
    if (!bluetoothState) {
      this.setState({
        connectedDevice: null,
      });
      Alert.alert(
        'Bluetooth is disabled',
        'Do you want to enable bluetooth?',
        [
          {
            text: 'NO',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'YES',
            onPress: () => this.enableBluetooth(),
          },
        ],
        {cancelable: false},
      );
    }
  };


  enableBluetooth = async () => {
    await BluetoothSerial.enable();
  };

  sendData = (data, isoff=false) => {
    if(!this.props.connectedDevice){
      Alert.alert(
        'Waring',
        'Device has not connected',
      );
    }
    BluetoothSerial.write(data)
      .then((res) => {
        console.log(`Successfully wrote "${data}" to device`, res);
        if(isoff===false && this.state.power==="off"){
          this.setState({power:"on"})
         
        }
        if(isoff===true){
          console.log("Turn off")
          this.setState({power:"off"})
        }
      })
      .catch((err) => console.log(err.message));
  };

  handleColorChange = async (color) => {
    color = fromHsv(color);
    this.setState({selectedColor: color});
    try {
      var data = `color ${convertHexToRgbString(color)}\r`;
      console.log(`Wrote data "${data}" to device`);
      this.sendData(data)
    } catch (e) {
      console.log(e);
    }
  };

  setDimmer = async (value) => {
    this.setState({dimmer: value});
    value = Math.round(value * 100);
    try {
      var data = `dimmer ${value}\r`;
      console.log(`Wrote data ${data} to device`);
      BluetoothSerial.write(data);
    } catch (e) {
      console.log(e);
    }
  };

  onDisconnect = async () => {
    await BluetoothSerial.disconnect();
    this.props.disConnect();
  };

  handleColorSelected = async (color) => {
    let rgbColor = convertHexToRgbString(fromHsv(color))
    if(this.state.power === "on"){
      this.sendData('off\r', true);
    } else {
      this.sendData(`color ${rgbColor}\r`);
    }

  };

  onConfirm =  (hour, minute) => {
    this.setState({ time: `${hour}:${minute}` });
    var second = hour * 60 * 60 + minute * 60;
    console.log(`set timer: ${hour}:${minute}\nsecond: ${second}`)
    var data = `timer ${second}\r`;
    this.TimePicker.close();
    this.sendData(data);
  }

  render() {
    const {navigation} = this.props;
    const {connectedDevice} = this.props;
    return (
      <View style={styles.container}>
        {!connectedDevice && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Icon name="warning" size={16} /> Device has not connected
            </Text>
          </View>
        )}
        <View style={styles.block1}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Device')}>
            <Text style={styles.textCenter}>
              <Icon name="bars" size={30} color="#900" />
            </Text>
          </TouchableOpacity>
          {connectedDevice && (
            <Text>
              Connecting: {connectedDevice && connectedDevice.name} {'\n'}
              {connectedDevice && connectedDevice.id}
              {'  '}
              <TouchableOpacity onPress={this.onDisconnect}>
                {connectedDevice && (
                  <Icon name="times-circle" size={16} color="#900" />
                )}
              </TouchableOpacity>
            </Text>
          )}
        </View>
        <View style={styles.colorPicker}>
          <ColorPicker
            onColorSelected={(color) => this.handleColorSelected(color)}
            style={{flex: 1}}
            onColorChange={this.handleColorChange}
            color={this.state.selectedColor}
          />
          {/* <ColorWheel
            initialColor="#ee0000"
            onColorChange={color => console.log({color})}
            onColorChangeComplete={color => onChange(color)}
            style={{width: Dimensions.get('window').width}}
            thumbStyle={{ height: 30, width: 30, borderRadius: 30}}
          /> */}
        </View>
        <View style={styles.block2}>
          <TouchableOpacity
            style={styles.buttonFlash}
            onPress={() => this.sendData('flash\r')}>
            <Text style={[styles.textCenter, {color: 'white'}]}>FLASH</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.5}
            onPress={()=> this.TimePicker.open()}
          >
            <Image source={timerImg} style={{height: 60, width: 60}} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonFlash}
            onPress={() => this.sendData('fade\r')}>
            <Text style={[styles.textCenter, {color: 'white'}]}>FADE</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TimePicker
            ref={(ref) => {
              this.TimePicker = ref;
            }}
            onCancel={() => this.TimePicker.close()}
            onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
            hourUnit=" H"
            minuteUnit=" M"
          />
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
    justifyContent: 'space-between',
  },

  block2: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 16,
  },
  button: {
    padding: 16,
  },
  buttonFlash: {
    margin: 4,
    padding: 16,
    width: 120,
    borderRadius: 8,
    backgroundColor: '#1abc9c',
  },
  textCenter: {
    textAlign: 'center',
    fontWeight: '700',
  },
  slider: {
    padding: 8,
  },
  buttonOff: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#ff0000',
  },
  warning: {
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  warningText: {
    fontSize: 16,
  },
});

export default connect(
  (state) => {
    return {
      connectedDevice: state.connectedDevice,
    };
  },
  (dispatch) => {
    return {
      disConnect: () => {
        dispatch(actions.bluetooth_disconnect());
      },
    };
  },
)(Home);
