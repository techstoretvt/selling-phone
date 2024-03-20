import jwt_decode from "jwt-decode";

import actionTypes from "./actionTypes"
import { refreshTokenService, GetUserLogin } from '../../services/userService'


const updateTokensSuccess = (data, dispatch) => {
    dispatch({
        type: actionTypes.UPDATE_TOKENS_SUCCESS,
        data: data
    })
}

const updateTokensFaild = (dispatch) => {
    dispatch({
        type: actionTypes.UPDATE_TOKENS_FAILD
    })
}

// const getLogin = async (tokens, dispatch) => {
//     //refresh token
//     await handleRefreshToken(tokens, dispatch);

//     //call api
//     let res = await GetUserLogin(tokens.accessToken);
//     if (res && res.errCode === 0) {
//         dispatch({
//             type: actionTypes.GET_LOGIN_SUCCESS,
//             data: res.data
//         })
//     }
//     else if (res && res.errCode === 2) {
//         dispatch({
//             type: actionTypes.UPDATE_TOKENS_FAILD
//         })
//     }
//     else {
//         dispatch({
//             type: actionTypes.GET_LOGIN_FAILD,
//             data: res.data
//         })
//     }

// }

// const handleRefreshToken = async (tokens, dispatch) => {

//     try {
//         var decoded = await jwt_decode(tokens.accessToken);

//         let date = new Date();
//         if (decoded.exp < date.getTime() / 1000) {
//             let res = await refreshTokenService({ refreshToken: tokens.refreshToken });
//             console.log(res);

//             if (res && res.errCode === 0) {
//                 console.log('vào');

//                 dispatch({
//                     type: actionTypes.UPDATE_TOKENS_SUCCESS,
//                     data: res.data
//                 })
//             }
//             else if (res && res.errCode === 2) {
//                 console.log('vào 2');
//                 dispatch({
//                     type: actionTypes.UPDATE_TOKENS_FAILD
//                 })
//             }
//             else {
//             }
//         }
//         else {
//             // dispatch({
//             //     type: actionTypes.UPDATE_TOKENS_FAILD
//             // })
//         }
//     } catch (error) {
//         console.log('decode faild');
//         // dispatch({
//         //     type: actionTypes.UPDATE_TOKENS_FAILD
//         // })
//     }
// }

const userLogout = (dispatch) => {
    dispatch({
        type: actionTypes.USER_LOGOUT
    })
}



export {
    updateTokensSuccess,
    updateTokensFaild,
    // getLogin,
    userLogout,
}