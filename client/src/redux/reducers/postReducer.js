import { 
  POSTS_LOADING_REQUEST,
  POSTS_LOADING_SUCCESS,
  POSTS_LOADING_FAILURE, 
  // POSTS_WRITE_REQUEST,
  // POSTS_WRITE_SUCCESS,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_SUCCESS,
  POST_DETAIL_LOADING_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  POST_EDIT_UPLOADING_FAILURE,
  CATEGORY_FIND_REQUEST,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_FAILURE,
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
} from '../types';

//초기상태
const initialState = {
  isAuthenticated: null,
  posts: [],
  postDetail:"",
  postCount: "",
  loading: false,
  error: '',
  creatorId:"",
  categoryFindResult:"",
  title:"",
  searchBy:"",
  searchResult:""
}
// saga에서 함수 결과에 따라 type과 payload를 다르게 설정해주면 리듀서는 거기에 맞게 상태관리 후 새 state를 반환한다.
// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch(action.type) {
    case POSTS_LOADING_REQUEST:
      return {
        ...state,
        posts:[],
        // 새로고침 할 경우, posts를 비워주어야 게시글 무한 증식을 막을 수 있다
        loading: true,
      }
    case POSTS_LOADING_SUCCESS:
      return {
        ...state,
        posts: [...state.posts, ...action.payload.postFindResult],
        categoryFindResult: action.payload.categoryFindResult,
        postCount: action.payload.postCount,
        loading: false,

      }
    case POSTS_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case POST_DETAIL_LOADING_REQUEST:
      return {
        ...state,
        posts: [],
        loading: true,
      };
    case POST_DETAIL_LOADING_SUCCESS:
      return {
        ...state,
        postDetail: action.payload,
        creatorId: action.payload.creator._id,
        title: action.payload.title,
        loading: false,
      };
    case POST_DETAIL_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case POST_EDIT_LOADING_REQUEST:
      return {
        ...state,
        posts: [],
        loading: true,
      };
    case POST_EDIT_LOADING_SUCCESS:
      return {
        ...state,
        postDetail: action.payload,
        loading: false,
      };
    case POST_EDIT_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case POST_EDIT_UPLOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case POST_EDIT_UPLOADING_SUCCESS:
      // edit은 인증된 사람만 가능하다.
      return {
        ...state,
        posts: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case POST_EDIT_UPLOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case CATEGORY_FIND_REQUEST:
      return {
        ...state,
        posts:[], //카테고리 찾고 홈으로넘어가면, 카테고리 찾은 것과 기존에 있던 것과 겹치게되어 에러 발생. 빈배열로 날려준다.
        loading: true,
      };
    case CATEGORY_FIND_SUCCESS:
      // edit은 인증된 사람만 가능하다.
      return {
        ...state,
        categoryFindResult: action.payload,
        loading: false,
      };
    case CATEGORY_FIND_FAILURE:
      return {
        ...state,
        categoryFindResult: action.payload,
        loading: false,
      };
    case SEARCH_REQUEST:
      return {
        ...state,
        posts:[],  // 홈으로 넘어오는 경우 게시글이 겹쳐질 수 있으므로 비워준다.
        searchBy: action.payload,
        loading: true,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        searchBy: action.payload, // 무엇으로 검색했는지 input 창 입력값
        searchResult: action.payload, //search 결과를 받는다,.
        loading: false,
      };
    case SEARCH_FAILURE:
      return {
        ...state,
        searchResult: action.payload, 
        loading: false,
      };
    default:
      return state
  }
}