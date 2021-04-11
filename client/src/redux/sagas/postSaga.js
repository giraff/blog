import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import { 
  POSTS_LOADING_FAILURE, 
  POSTS_LOADING_REQUEST, 
  POSTS_LOADING_SUCCESS,
  POST_UPLOADING_REQUEST,
  POST_UPLOADING_SUCCESS,
  POST_UPLOADING_FAILURE,
  POST_DETAIL_LOADING_SUCCESS,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_FAILURE,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  POST_EDIT_UPLOADING_FAILURE,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_FAILURE,
  CATEGORY_FIND_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  SEARCH_REQUEST,

} from '../types';
import { push } from 'connected-react-router';

//All Post Load

const loadPostAPI = () => {
  return axios.get("/api/post")
}

function* loadPosts() {
  try{
    const result = yield call(loadPostAPI)
    console.log(result)
    yield put({
      type: POSTS_LOADING_SUCCESS,
      payload: result.data //왜 result.data인지는 콘솔 확인 ㄱㄱ
    })
    
  }catch(e) {
    yield put({
      type: POSTS_LOADING_FAILURE,
      payload: e
    })

    // 실패하면 홈으로 보내줘
    yield put(push("/"));
  }
}

function* watchLoadPost() {
  yield takeEvery(POSTS_LOADING_REQUEST, loadPosts);
}

// Post Upload

// Upload API
// upload는 서버에서 인증받은 사용자만 가능
const uploadPostAPI = (payload) => {
  // userLoading에서 토큰만 넘겨주는 userLoading API와 달리, 
  // uploadPostAPI에는 token 이외에
  // contents 등 다양한 내용이 같이 넘어오므로,
  // 따로 떼어주는 작업을 해야한다.
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post("/api/post", payload, config);
}

function* uploadPosts(action) {
  try{
    // front에서 action 담겨져 들어옴. 그 action 값 확인
    console.log(action, "게시물 업로드 함수")
    // uploadPostAPI 부를 때 token 값을 넘겨주기 위해 action.payload도 같이 넘겨준다
    const result = yield call(uploadPostAPI, action.payload);
    // UploadPostAPI 결과값 출력
    console.log(result)
    yield put({
      type: POST_UPLOADING_SUCCESS,
      payload: result.data,
    });
    // 새페이지로 넘어가는 주소 적어줌
    //upload 가 성공하면, 작성한 글의 상세 페이지로 (PostDetail) 넘어가기
    // 서버 쪽에 (post.js) /post/:id로 가는 라우터를 또 달아주어야한다.
    yield put(push(`/post/${result.data._id}`));
    
  }catch(e) {
    yield put({
      type: POST_UPLOADING_FAILURE,
      payload: e,
    });

    // 실패하면 홈으로 보내줘
    yield put(push("/"));
  }
}

function* watchuploadPosts() {
  yield takeEvery(POST_UPLOADING_REQUEST, uploadPosts);
}

// load Post Detail
const loadPostDetailAPI = (payload) => {
  // 1. postDetail는 일반 방문자도 볼 수 있기 때문에 인증이 필요없다 (token x)
  // 2. 어떤 걸 가져다 넣는게 아니므로 post 요청도 아니다.
  // 3. axios.get(`')
  console.log(payload);
  return axios.get(`/api/post/${payload}`);

}

function* loadPostDetail(action) {
  try {
    console.log(action);
    const result = yield call(loadPostDetailAPI, action.payload);
    console.log(result, "post_detail_saga_data");
    yield put({
      type: POST_DETAIL_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_DETAIL_LOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchloadPostDetail() {
  yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}


// 오직 지우는 사람은 글 쓴 사람만 가능하다.
const DeletePostAPI = (payload) => {

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }
  const token = payload.token;

  if(token) {
    config.headers["x-auth-token"] = token
  }
  return axios.delete(`/api/post/${payload.id}`, config);
}

function* DeletePost(action) {
  try {
    const result = yield call(DeletePostAPI, action.payload);
    yield put({
      type: POST_DELETE_SUCCESS,
      payload: result.data,
    });
    yield put(push("/"));

  } catch (e) {
    yield put({
      type: POST_DELETE_FAILURE,
      payload: e,
    });
  }
}

function* watchDeletePost() {
  yield takeEvery(POST_DELETE_REQUEST, DeletePost);
}


// Post Edit Load
// 오직 수정하는 사람은 글 쓴 사람만, 인증된 사람만 가능하다.
const PostEditLoadAPI = (payload) => {

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }
  const token = payload.token;

  if(token) {
    config.headers["x-auth-token"] = token
  }
  return axios.get(`/api/post/${payload.id}/edit`, config);
}

function* PostEditLoad(action) {
  try {
    const result = yield call(PostEditLoadAPI, action.payload);
    yield put({
      type: POST_EDIT_LOADING_SUCCESS,
      payload: result.data,
    });

  } catch (e) {
    yield put({
      type: POST_EDIT_LOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchPostEditLoad() {
  yield takeEvery(POST_EDIT_LOADING_REQUEST, PostEditLoad);
}

// Post Edit Upload
// 수정한 글을 업로드 하는것도 인증된 사람만 가능
const PostEditUploadAPI = (payload) => {

  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }
  const token = payload.token;

  if(token) {
    config.headers["x-auth-token"] = token
  }

  //why? payload 다음 config를 넘겨주나?
  // payload 값 안에 token이 들어있는데 config 값을 먼저 받아들이면
  // payload 안의 token 값을 받지 못한다.
  return axios.post(`/api/post/${payload.id}/edit`, payload, config);
}

function* PostEditUpload(action) {
  try {
    const result = yield call(PostEditUploadAPI, action.payload);
    yield put({
      type: POST_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_EDIT_UPLOADING_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchPostEditUpload() {
  yield takeEvery(POST_EDIT_UPLOADING_REQUEST, PostEditUpload);
}

// Category find

const CategoryFindAPI = (payload) => {
  return axios.get(`/api/post/category/${encodeURIComponent(payload)}`);
  /** encodeURIComponent() 함수는 URI의 특정 문자를 UTF-8로 인코딩(암호화)하여 
   * 하나, 둘 , 셋 혹은 네개의 연속된 이스케이프 문자로 나타낸다. 
   * encodes characters such as ?,=,/,&,: ...
   *  한글로 사과 라고 하면 이상한 글자가 나옴
   */
}

function* CategoryFind(action) {
  try {
    const result = yield call(CategoryFindAPI, action.payload);
    yield put({
      type: CATEGORY_FIND_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: CATEGORY_FIND_FAILURE,
      payload: e,
    });
  }
}

function* watchCategoryFind() {
  yield takeEvery(CATEGORY_FIND_REQUEST, CategoryFind);
}

// SEARCH

const SearchResultAPI = (payload) => {
  return axios.get(`/api/search/${encodeURIComponent(payload)}`);
  /** encodeURIComponent() 함수는 URI의 특정 문자를 UTF-8로 인코딩(암호화)하여 
   * 하나, 둘 , 셋 혹은 네개의 연속된 이스케이프 문자로 나타낸다. 
   * encodes characters such as ?,=,/,&,: ...
   *  한글로 사과 라고 하면 이상한 글자가 나옴
   */
}

function* SearchResult(action) {
  try {
    const result = yield call(SearchResultAPI, action.payload);
    yield put({
      type: SEARCH_SUCCESS,
      payload: result.data,
    });
    // 검색 후 엔터를 누르면 해당 화면으로 넘어가는 것을 만들어주어야 한다.
    // 검색한 '결과 목록을 보여줄 화면'을 넘어갈 경로를 넘겨준다.
    yield put(push(`/search/${encodeURIComponent(action.payload)}`));
  } catch (e) {
    yield put({
      type: SEARCH_FAILURE,
      payload: e,
    });
    yield put(push("/"));
  }
}

function* watchSearchResult() {
  yield takeEvery(SEARCH_REQUEST, SearchResult);

}


export default function* postSaga() {
  yield all([
    fork(watchLoadPost),
    fork(watchuploadPosts),
    fork(watchloadPostDetail),
    fork(watchDeletePost),
    fork(watchPostEditLoad),
    fork(watchPostEditUpload),
    fork(watchCategoryFind),
    fork(watchSearchResult),
  ]);
}