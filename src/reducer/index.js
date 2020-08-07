import { combineReducers } from 'redux';
import devices from './device';
import connectedDevice from './connectedDevice';
import unpairedDevice from './unpairedDevice';
const myReducer = combineReducers({
    devices,
    connectedDevice,
    unpairedDevice,
})
export default myReducer;