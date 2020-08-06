import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import Device from './Device';
const Stack = createStackNavigator();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [
        {id: '1', name: 'ESP 35V3'},
        {id: '2', name: 'AVG 24DF'},
        {id: '3', name: 'VBF 22FB'},
        {id: '4', name: 'AQW 90HT'},
      ],
    };
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
                headerTitleAlign:"center"
            }}
          />
          <Stack.Screen name="Device" 
            component={Device} 
            initialParams={{ 
                devices: this.state.devices,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
