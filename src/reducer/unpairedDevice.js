var initState = [];
var myReducer = (state = initState, action) => {
    if(action.type==="LOAD_UNPAIRED_DEVICE"){
        return [...action.devices];
    }
	return [...state];
}
export default myReducer;