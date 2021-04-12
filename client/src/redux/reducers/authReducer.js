import { 
  LOGIN_FAILURE, 
  LOGIN_REQUEST, 
  LOGIN_SUCCESS, 
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
  USER_LOADING_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  PASSWORD_EDIT_UPLOADING_REQUEST,
  PASSWORD_EDIT_UPLOADING_SUCCESS,
  PASSWORD_EDIT_UPLOADING_FAILURE,
  CLEAR_ERROR_REQUEST, 
  CLEAR_ERROR_SUCCESS, 
  CLEAR_ERROR_FAILURE, 
} from '../types'
// REGISTER와 LOGIN은 다를 바 없음
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: "",
  userId: "",
  userName: "",
  userRole: "",
  // 에러 담당 메시지
  errorMsg: "",
  successMsg: "",
  // 비밀번호 edit에서 사용하기 위해 추가
  previousMatchMsg: "", //이전값과 같은지 여부
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST: //LOGIN과 작업이 동일해서 붙어서 작성해도 됨
    case LOGIN_REQUEST:
      return{
        ...state, 
        errorMsg: "", 
        isLoading: true 
      }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log(action.payload,'login_success');
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        userId: action.payload.user.id,
        userName: action.payload.user.name,
        userRole: action.payload.user.role,
        errorMsg: "",
      }
    case REGISTER_FAILURE:
    case LOGOUT_FAILURE:
    case LOGIN_FAILURE:
      localStorage.removeItem("token")
      return{
        ...state,
        ...action.payload,
        token: null,
        user: null,
        userId: null,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        errorMsg: action.payload.data.msg
      }
    case USER_LOADING_REQUEST:
      return{
        ...state,
        isLoading: true
      }
    case USER_LOADING_SUCCESS:
      return{
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        userId: action.payload._id,
        userName: action.payload.name,
        userRole: action.payload.role
      }
    case USER_LOADING_FAILURE:
      return{
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userRole: ""
      }
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        token: null,
        user:null,
        userId: null,
        isAuthenticated: false,
        isLoading: false,
        userRole: null,
        errorMsg: ""
      }
    case PASSWORD_EDIT_UPLOADING_REQUEST:
      return{
        ...state,
        isLoading: true,
        successMsg: "",
        errorMsg: "",
        previousMsg: "",
      }
    case PASSWORD_EDIT_UPLOADING_SUCCESS:
      console.log(action.payload);
      return{
        ...state,
        isLoading: false,
        // password는 이미 auth에 저장됨 여기는 state를 관리하는 곳
        // 메시지 상태만 조정
        successMsg: action.payload.success_msg,
        errorMsg: "",
        previousMsg:"",
      }
    case PASSWORD_EDIT_UPLOADING_FAILURE:
      console.log(action.payload);
      return{
        ...state,
        isLoading: false,
        successMsg: "",
        errorMsg: action.payload.data.fail_msg,
        previousMatchMsg: action.payload.data.match_msg,
      }
      // edit 업로드 버튼 누를 때 에러는 모두 싹 날려줄 것이다
      // 그 뒤 서버쪽이 메시지를 받을것이다
    case CLEAR_ERROR_REQUEST:
      return{
        ...state,
      }
    case CLEAR_ERROR_SUCCESS: //에러를 모두 날려보낸다
      return{
        ...state,
        errorMsg: "",
        previousMatchMsg: "",
      }
    case CLEAR_ERROR_FAILURE:
      return{
        ...state,
        errorMsg: "Clear Error Fail",
        previousMatchMsg: "Clear Error Fail"
      }
    default:
      return state

  }
}

export default authReducer;