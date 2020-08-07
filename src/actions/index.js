export const createDevice =(device) =>{
    return {
        type: "CREATE_DEVICE",
        device
    }
}

export const loadDevice =(devices) =>{
    return {
        type: "LOAD_DEVICE",
        devices
    }
}

export const bluetooth_connect = (device) =>{
    return {
        type: "CONNECT_TO",
        device
    }
}
export const bluetooth_disconnect = () =>{
    return {
        type: "DISCONNECT"
    }
}