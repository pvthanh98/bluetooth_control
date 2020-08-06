var initState = [
    {id: '1', name: 'ESP 35V3'},
    {id: '2', name: 'AVG 24DF'},
    {id: '3', name: 'VBF 22FB'},
    {id: '4', name: 'AQW 90HT'},
];
var myReducer = (state = initState, action) => {
    if(action.type==="CREATE_DEVICE"){
        state.push(action.device);
        return [...state];
    }
	return [...state];
}
export default myReducer;