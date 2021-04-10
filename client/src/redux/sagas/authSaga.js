import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import { 
  LOGIN_FAILURE, 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGOUT_SUCCESS, 
  LOGOUT_FAILURE, 
  LOGOUT_REQUEST,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
  USER_LOADING_FAILURE, 
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_SUCCESS,
  CLEAR_ERROR_REQUEST
} from '../types';
import axios from 'axios';

//Login
const loginUserAPI = (loginData) => {
  console.log(loginData, "authSaga/loginData")
  const config = {
    header: {
      "Content-type": "application/json"
    }
  }
  return axios.post('api/auth', loginData, config)
}

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload)
    console.log(result)
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data
    })
  }catch(e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response
    })
  }
}

function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser)
}

//LOGOUT : 서버랑 통신할 필요 없음
function* logout() {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    })
  }catch(e) {
    yield put({
      type: LOGOUT_FAILURE,
    })
  }
}

function* watchlogout() {
  yield takeEvery(LOGOUT_REQUEST, logout);
}
// REGISTER
// LOGIN과 크게 다르지 않다.
const registerUserAPI = (req) => {
  console.log(req, "req")
  // 회원가입은 특별한 토큰이 필요 없음.
  return axios.post('api/user', req)
  // SERVER 측 ROUTER의 회원가입은 api/user로 post 요청 보낸다.
}

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload)
    console.log(result, "RegisterUser data")
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data
    })
  }catch(e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response
    })
  }
}

function* watchregisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser)
}

// clearError
// 에러를 없애는 건 api (서버 측으로 axios가 보내거나 할)가 필요 없다.
function* clearError() {
  try{
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  }catch(e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
    console.error(e);
  }
}

function* watchclearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}
// UserLoading
// login과 userLoading은 유사
// userLoading : 매번 로그인 하는 것
// 챕터가 넘어갈 때마다 매번 로그인
// userLoading은 토큰만 있으면 유저 로딩 여부를 판단할 수 있으므로 넘겨받는 값은 오직 토큰 뿐
const userLoadingAPI = (data) => {
  const token = data.payload
  const config = {
    header: {
      "Content-type": "application/json"
    }
  }
  if(token) {
    config.headers['x-auth-token'] = token;
  }

  //설정을 가지고 유저가 여기 존재하는지 아닌지만 확인하는 용도이므로 post가 아닌 get
  return axios.get('api/auth/user', config)
}

function* userLoading(action) {
  console.log(action,"userLoading acttion")
  try {
    const result = yield call(userLoadingAPI, action.payload)
    console.log(result)
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data
    })
  }catch(e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response
    })
  }
}

function* watchuserLoading() {
  yield takeEvery(USER_LOADING_REQUEST, userLoading)
}
export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchlogout),
    fork(watchregisterUser),
    fork(watchclearError),
    fork(watchuserLoading)
  ])
}

