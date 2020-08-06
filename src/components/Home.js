import 'react-native-gesture-handler';
import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {ColorPicker} from 'react-native-color-picker';
import {StyleSheet, Text, View, Slider} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

class Home extends React.Component {
  constructor(props){
      super(props);
  }
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.block1}>
          <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Device')}>
            <Text style={styles.textCenter}>
                <Icon name="bars" size={30} color="#900" /> 
            </Text>
          </TouchableOpacity>
          {/* <Icon name="rocket" size={30} color="#900" /> */}
        </View>
        <View style={styles.colorPicker}>
          <ColorPicker
            onColorSelected={(color) => console.log(`Color selected: ${color}`)}
            style={{flex: 1}}
          />
        </View>
        <View style={styles.block2}>
          <TouchableOpacity style={styles.buttonFlash}>
            <Text style={[styles.textCenter, {color:"white"}]}>FLASH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonFlash}>
            <Text style={[styles.textCenter , {color:"white"}]}>FADE</Text>
          </TouchableOpacity>
        </View>
        <View>
            <Slider
                style={styles.slider}
                step={1}
                maximumValue={100}
            />
        </View>
        <View>
            <TouchableOpacity style={styles.buttonOff}>
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
  },

  block2: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  }
});

export default Home;
