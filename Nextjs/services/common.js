import listWordObscene from './listWordObscene.json'
import { GetUserLogin, GetUserLoginRefreshToken } from './userService'
import actionTypes from '../store/actions/actionTypes'
import jwt_decode from "jwt-decode";

let checkWord = (text) => {
    let arrText = text.toLowerCase().split(' ')

    let check = true
    arrText.forEach(item => {
        if (listWordObscene.includes(item))
            check = false;
    })
    listWordObscene.forEach(item => {
        if (text.includes(item)) {
            check = false;
        }
    })
    return check


}

let checkLogin = async (accessToken, refreshToken, dispatch, router) => {

    try {
        const accToken = localStorage.getItem('accessToken')
        const reToken = localStorage.getItem('refreshToken')

        if (!accToken && !reToken) return false

        if (!accessToken && !refreshToken) {
            return false;
        }


        let res = await GetUserLogin(accToken);
        if (res && res.errCode === 0) {
            dispatch({
                type: actionTypes.GET_LOGIN_SUCCESS,
                data: res.data
            })
            return true
        }
        else if (res && res.errCode === 2) {
            let res2 = await GetUserLoginRefreshToken(reToken)
            if (res2 && res2.errCode === 0) {
                dispatch({
                    type: actionTypes.GET_LOGIN_SUCCESS,
                    data: res2.data
                })
                dispatch({
                    type: actionTypes.UPDATE_TOKENS_SUCCESS,
                    data: res2.tokens
                })
                localStorage.setItem('accessToken', res2.tokens.accessToken)
                localStorage.setItem('refreshToken', res2.tokens.refreshToken)
                return true
            }
            else if (res2 && res2.errCode !== 0) {
                dispatch({
                    type: actionTypes.UPDATE_TOKENS_FAILD,
                })
                return false
            }
        }
        else if (res && res.errCode === 3) {
            dispatch({
                type: actionTypes.UPDATE_TOKENS_FAILD,
            })
            return false
        }
    } catch (error) {
        if (error?.response.status < 500) {
            dispatch({
                type: actionTypes.UPDATE_TOKENS_FAILD,
            })
        }
        return false
    }
}

let variables = {
    countPageEvaluate: 5
}

let formatNumber = (num) => {
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'k';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    } else {
        return num?.toString();
    }
}

let decode_token_exp = (token) => {
    try {
        let decoded = jwt_decode(token)
        if (decoded) {

            return decoded.exp
        }
    } catch (e) {
        return 0
    }
}

const renderAvatarUser = (item) => {
    if (!item) return {}
    if (item.avatarUpdate) {
        return {
            backgroundImage: `url(${item.avatarUpdate})`,
        }
    }
    if (item.typeAccount === 'web') {
        if (item.avatar) {
            return {
                backgroundImage: `url(${item.avatar})`,
            }
        }
        else {
            return {

            }
        }
    }

    if (item.typeAccount === 'google') {
        return {
            backgroundImage: `url(${item.avatarGoogle})`,
        }
    }
    if (item.typeAccount === 'facebook') {
        return {
            backgroundImage: `url(${item.avatarFacebook})`,
        }
    }

    if (item.typeAccount === 'github') {
        return {
            backgroundImage: `url(${item.avatarGithub})`,
        }
    }


}

const renderAvatarUser_url = (item) => {
    if (!item) return ''
    if (item.avatarUpdate) {
        return item.avatarUpdate
    }
    if (item.typeAccount === 'web') {
        if (item.avatar) {
            return item.avatar
        }
        else {
            return '/images/user/no-user-image.jpg'
        }
    }

    if (item.typeAccount === 'google') {
        return item.avatarGoogle
    }
    if (item.typeAccount === 'facebook') {
        return item.avatarFacebook
    }

    if (item.typeAccount === 'github') {
        return item.avatarGithub
    }


}


const decode_token = (token) => {
    try {
        let decoded = jwt_decode(token)
        if (decoded)
            return decoded
    } catch (e) {
        return 0
    }
}

function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    const day = String(dateTime.getDate()).padStart(2, '0');
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const year = String(dateTime.getFullYear());

    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');

    // Định dạng lại ngày tháng và giờ
    const formattedDateTime = `${hours}:${minutes} ${day}/${month}/${year}`;

    return formattedDateTime;
}


export {
    checkWord,
    checkLogin,
    variables,
    formatNumber,
    decode_token_exp,
    renderAvatarUser,
    renderAvatarUser_url,
    decode_token,
    formatDate
}