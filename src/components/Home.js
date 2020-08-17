import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {connect} from 'react-redux';
import {ColorPicker, fromHsv} from 'react-native-color-picker';
import {StyleSheet, Text, View, Alert, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BluetoothSerial from 'react-native-bluetooth-serial';
import {convertHexToRgbString} from './utils';
import * as actions from '../actions/index';
import timerImg from '../assets/timer.png';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedColor: null,
      power: 'off\r',
      timer: null,
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

  sendData = (data) => {
    BluetoothSerial.write(data)
      .then((res) => {
        console.log(`Successfully wrote "${data}" to device`, res);
      })
      .catch((err) => console.log(err.message));
  };

  handleColorChange = async (color) => {
    // console.log("original color: ", color)
    color = fromHsv(color);
    this.setState({selectedColor: color});
    // console.log("SELECTED COLOR: ",color)
    // console.log("from hsv color(HEX COLOR ): ", color)
    try {
      var data = `color ${convertHexToRgbString(color)}\r`;
      console.log(`Wrote data "${data}" to device`);
      BluetoothSerial.write(data);
    } catch (e) {
      console.log(e);
    }
  };

  setTimer = () => {
    //to turn off light
    this.setState({
      timer: 30,
    });
    const timecounting = setInterval(() => {
      if (this.state.timer <= 0) {
        this.setState({timer:null})
        clearInterval(timecounting);
        return
      }
      this.setState({timer: this.state.timer - 1});
    }, 1000);
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
    console.log(this.state.power);
    await BluetoothSerial.write(this.state.power);
    this.setState({
      power: this.state.power === 'off\r' ? 'flash\r' : 'off\r',
    });
  };

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
          <Text>Shutdown in : {this.state.timer}</Text>
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
        </View>
        <View style={styles.block2}>
          <TouchableOpacity
            style={styles.buttonFlash}
            onPress={() => this.sendData('flash\r')}>
            <Text style={[styles.textCenter, {color: 'white'}]}>FLASH</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={this.setTimer}>
            <Image source={timerImg} style={{height: 60, width: 60}} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonFlash}
            onPress={() => this.sendData('fade\r')}>
            <Text style={[styles.textCenter, {color: 'white'}]}>FADE</Text>
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
