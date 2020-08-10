import React from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import BluetoothSerial from 'react-native-bluetooth-serial';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as actions from '../actions/index';
import DeviceItem from './DeviceItem';
class Device extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connecting: false
    }
  }

  setConnectting = () =>{
    this.setState({connecting: ! this.state.connecting})
  }

  async componentDidMount(){
    this.props.loadDevice();
    try {
      const unpairedDevices = await BluetoothSerial.listUnpaired()
      console.log('discovered devices', unpairedDevices)
    } catch (e){
      console.log(e)
    }
    
  }

  render() {
    let {devices, navigation} = this.props;
    return (
      <View style={{flex:1}}>
        <View style={{flex:1}}>
            {
              this.state.connecting &&             
              <ActivityIndicator
                size={"large"}
                color="red"
              />
            }
            <FlatList
            style={{padding: 4}}
            data={devices}
            renderItem={({item}) => (
                <DeviceItem 
                  navigation={navigation} 
                  ItemStyle={styles.flatItem} 
                  item={item} 
                  setConnectting={this.setConnectting}
                />
            )}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatItem: {
    alignItems: 'stretch',
    shadowColor:"black",
    marginTop: 8,   
    padding: 16,
    flexDirection:"row",
    borderBottomWidth: 2,
    borderBottomColor: "#d3d3d3",
    backgroundColor:"white"
  },
  title:{
      fontWeight:"700",
      fontSize:20,
      marginBottom:8,
      marginTop:8,
      marginLeft:12,
  }
});

const mapStateToProps = (state) => ({
  devices: state.devices,
});
const mapDispatchToProps = (dispatch) => ({
  loadDevice: async () => {
    const devices = await BluetoothSerial.list()
    dispatch(actions.loadDevice(devices))
  },
  createDevice: (device) => {
    dispatch(actions.createDevice(device));
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(Device);
