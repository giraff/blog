import axios from 'axios';
import { call, put, takeEvery, all, fork} from 'redux-saga/effects';
import { 
  COMMENT_LOADING_FAILURE, 
  COMMENT_LOADING_REQUEST, 
  COMMENT_LOADING_SUCCESS,
  COMMENT_UPLOADING_REQUEST,
  COMMENT_UPLOADING_SUCCESS,
  COMMENT_UPLOADING_FAILURE,
} from '../types';
import {} from 'react-router-dom';
import { push } from 'connected-react-router';

/** load Comments */ 

const loadCommentsAPI = (payload) => {
  console.log(payload, "loadCommentsAPI");
  // router와 주소 일치하는 지 확인
  return axios.get(`/api/post/${payload}/comments`);
};

function* loadComments(action) {
  try {
    // comments 로드 요청
    const result = yield call(loadCommentsAPI, action.payload);
    // comments 로드 성공
    yield put({
      type: COMMENT_LOADING_SUCCESS,
      payload: result.data
    });

  } catch(e) {
    console.log(e);
    yield put({
      type: COMMENT_LOADING_FAILURE,
      payload: e
    });

    yield push('/');
  }
}

function* watchloadComments () {
  yield takeEvery(COMMENT_LOADING_REQUEST, loadComments);
}

/** upload Comments */
const uploadCommentsAPI = (payload) => {
  console.log(payload.id, "loadCommentsAPI");
  // router와 주소 일치하는 지 확인
  return axios.post(`/api/post/${payload.id}/comments`, payload);
  //  why id?
  /** 업로드 할 때는 내용이 content, 글쓴이 등도 담길 수 있기 때문에 그 안에서 id만 추출한다. */
};

function* uploadComments(action) {
  try {
    // comments 로드 요청
    const result = yield call(uploadCommentsAPI, action.payload);
    // comments 로드 성공
    yield put({
      type: COMMENT_UPLOADING_SUCCESS,
      payload: result.data
    });

  } catch(e) {
    console.log(e);
    yield put({
      type: COMMENT_UPLOADING_FAILURE,
      payload: e
    });

    yield push('/');
  }
}

function* watchuploadComments () {
  yield takeEvery(COMMENT_UPLOADING_REQUEST, uploadComments);
}


// export sagas
export default function* commentSaga() {
  yield all([
    fork(watchloadComments),
    fork(watchuploadComments),
  ])
}