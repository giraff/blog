import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';

import createRootReducer from './redux/reducers/index';
import rootSaga from './redux/sagas/index';

// history 내보내기
export const history = createBrowserHistory();

//
const sagaMiddleware = createSagaMiddleware();

const initialState = {}

const middlewares = [sagaMiddleware, routerMiddleware(history)]

//chrome에서 리덕스로 개발을 할 때 상태 진행을 볼 수 있게 해주는 개발자 도구
const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

// 개발자 도구일 때나 배포 환경에서 redux devtools를 볼 수 있다. 
// 우리의 웹이 어떻게 작동하는지 드러내는 것이기 때문에 배포단계에서는 개발자 도구를 삭제하거나 안 보이게 해주어야 한다
const composeEnhancer = process.env.NODE_ENV === "production" ? compose: devtools || compose;

// store를 만들어주세요 => createRooteReducer랑 initailState랑 composeEnhancer을 합쳐서
const store = createStore(
  createRootReducer(history),
  initialState, //웹의 모든 상태를 담고 있는 초깃값
  composeEnhancer(applyMiddleware(...middlewares))
)

// sagaMiddleware을 작동시켜주세요.
console.log('sagaMiddleware 작동');
sagaMiddleware.run(rootSaga);

export default store;
