import { createStore,compose } from 'redux';
import reducer from './reducer';
const DEVTOOLS = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers =  DEVTOOLS ?  DEVTOOLS({}) : compose;
let store = createStore(reducer, composeEnhancers());
export default store;