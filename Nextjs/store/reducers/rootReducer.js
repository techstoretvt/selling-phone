import { combineReducers } from "redux";
import userReducer from "./userReducer";
import appReducer from './appReducer'

import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'

import { CookieStorage } from 'redux-persist-cookie-storage'
import Cookies from 'js-cookie'


const userPersistConfig = {
    key: 'user',
    storage: new CookieStorage(Cookies, {
        expiration: {
            'default': 30 * 86400
        }
    }),
    whitelist: ['accessToken', 'refreshToken', 'link_redirect_login']
}

const appPersistConfig = {
    key: 'app',
    storage: new CookieStorage(Cookies, {
        expiration: {
            'default': 30 * 86400
        }
    }),
    whitelist: ['listKeyword', 'showSuggessVideo']
}

let rootReducer = combineReducers({
    user: persistReducer(userPersistConfig, userReducer),
    app: persistReducer(appPersistConfig, appReducer)
})

export default rootReducer;