import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import authSaga from './authSaga';
import postSaga from './postSaga';
import commentSaga from './commentSaga';

import dotenv from 'dotenv'
dotenv.config()

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

export default function* rootSaga() {
  yield all([fork(authSaga), fork(postSaga), fork(commentSaga)]);
};

// 일반 함수는 값을 하나만 반환하지만, 제너레이터 함수는 여러 개를 반환할 수 있는 최신 문법 함수
// all([]) 배열 안에 saga 관련된 여러개를 넣을 수 있다.
// 필요할 때마다 배열 안에서 값들을 불러올 수 있도록 rootSaga 함수를 사용한다.

/** 48강- comment front 작업
 * commentSaga 추가 이후 PostDetail로 넘어감
 */