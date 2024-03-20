import actionTypes from '../actions/actionTypes'

const initState = {
    listKeyword: [],
    showSuggessVideo: 0
}

const appReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_LIST_KEYWORD: {
            let copyState = { ...state }
            console.log('First Keyword: ', action.data[0]);
            console.log('list keyword: ', action.data);
            copyState.listKeyword = action.data
            return {
                ...copyState,
            }
        }
        case actionTypes.SET_SHOW_SUGGESS_VIDEO: {
            let copyState = { ...state }
            copyState.showSuggessVideo = action.data
            return {
                ...copyState,
            }
        }

        default:
            return state;
    }
}

export default appReducer;