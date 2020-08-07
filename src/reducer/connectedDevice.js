var initState = null;
var myReducer = (state = initState, action) => {
    if(action.type==="CONNECT_TO"){
        return {...action.device};
    }
    if(action.type==="DISCONNECT"){
        return null;
    }
	return state;
}
export default myReducer;