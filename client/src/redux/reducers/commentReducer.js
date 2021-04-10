import {
  COMMENT_LOADING_REQUEST,
  COMMENT_LOADING_SUCCESS,
  COMMENT_LOADING_FAILURE,
  COMMENT_UPLOADING_REQUEST,
  COMMENT_UPLOADING_SUCCESS,
  COMMENT_UPLOADING_FAILURE,

} from '../types';

const initialState = {
  comments: [],
  creatorId: "",
  loading: false,
  isAuthenticated: false
}

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case COMMENT_LOADING_REQUEST:
      return {
        ...state,
        loading: true
      };
    case COMMENT_LOADING_SUCCESS:
      return {
        ...state,
        loading: false,
        comments: action.payload
      };
    case COMMENT_LOADING_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case COMMENT_UPLOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case COMMENT_UPLOADING_SUCCESS:
      return {
        ...state,
        comments: [
          ...state.comments,  // 기존에 있던 state 가져오고 
          action.payload
        ],
        isAuthenticated: true,
        loading: false,
      };
    case COMMENT_UPLOADING_FAILURE:
      return {
        ...state,
        loading: false,
      };
    default: 
      return state
  }
}

export default commentReducer;