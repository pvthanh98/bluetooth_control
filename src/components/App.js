import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './Home';
import Device from './Device';
const Stack = createStackNavigator();
class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={Home} 
            options={{
                headerTitleAlign:"center",
            }}
          />
          <Stack.Screen name="Device" 
            component={Device} 
            options={{
              headerTitleAlign:"center",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
