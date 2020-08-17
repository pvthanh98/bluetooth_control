var initState = []
var myReducer = (state = initState, action) => {

    if(action.type==="LOAD_DEVICE"){
        return [...action.devices];
    }
    if(action.type==="CREATE_DEVICE"){
        state.push(action.device);
        return [...state];
    }
	return [...state];
}
export default myReducer;