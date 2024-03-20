import { createStore } from 'redux'
import rootReducer from './reducers/rootReducer';
import { persistStore } from 'redux-persist';


let store = createStore(rootReducer);
export const persistor = persistStore(store);
export default store