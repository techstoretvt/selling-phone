import actionTypes from '../actions/actionTypes'

const initState = {
    isLoadingGetLogin: null,
    accessToken: null,
    refreshToken: null,
    currentUser: '',
    listCarts: null,
    link_redirect_login: ''
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_TOKENS_SUCCESS: {
            let copyState = { ...state }
            copyState.accessToken = action.data.accessToken
            copyState.refreshToken = action.data.refreshToken
            console.log('da lưu token');
            return {
                ...copyState,
            }
        }
        case actionTypes.UPDATE_TOKENS_FAILD: {
            let copyState = { ...state }
            copyState.accessToken = null
            copyState.refreshToken = null
            return {
                ...copyState,
            }
        }
        case actionTypes.GET_LOGIN_START: {
            let copyState = { ...state }
            copyState.isLoadingGetLogin = true
            return {
                ...copyState,
            }
        }
        case actionTypes.GET_LOGIN_SUCCESS: {
            let copyState = { ...state }
            copyState.currentUser = action.data
            copyState.isLoadingGetLogin = false
            return {
                ...copyState,
            }
        }
        case actionTypes.GET_LOGIN_FAILD: {
            let copyState = { ...state }
            copyState.currentUser = null;
            copyState.isLoadingGetLogin = false
            return {
                ...copyState,
            }
        }
        case actionTypes.USER_LOGOUT: {
            let copyState = { ...state }
            copyState.currentUser = null;
            copyState.isLoadingGetLogin = false
            copyState.accessToken = null;
            copyState.refreshToken = null
            return {
                ...copyState,
            }
        }
        case actionTypes.UPDATE_LIST_CART: {
            let copyState = { ...state }
            copyState.listCarts = action.data
            return {
                ...copyState,
            }
        }

        case actionTypes.UPDATE_REDIRECT_LOGIN: {
            let copyState = { ...state }
            copyState.link_redirect_login = action.data
            return {
                ...copyState,
            }
        }

        default:
            return state;
    }
}

export default userReducer;