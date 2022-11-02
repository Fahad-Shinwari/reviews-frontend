import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GOOGLE_REQUEST,
  GOOGLE_SUCCESS,
  GOOGLE_FAILURE,
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAILURE,
  ADD_PERMISSION,
  ADD_PERMISSION_SUCCESS,
  ADD_PERMISSION_FAILURE,
  DELETE_PERMISSION,
  DELETE_PERMISSION_SUCCESS,
  DELETE_PERMISSION_FAILURE,
} from './userTypes'

const initialState = {
  loading: false,
  status: '',
  error: '',
  user: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case SIGNUP_SUCCESS:
      return {
        loading: false,
        status: action.payload,
        error: '',
      }
    case SIGNUP_FAILURE:
      return {
        loading: false,
        status: '',
        error: action.payload,
      }
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case LOGIN_SUCCESS:
      return {
        loading: false,
        user: action.payload,
        error: '',
      }
    case LOGIN_FAILURE:
      return {
        loading: false,
        user: {},
        error: action.payload,
      }
    case GOOGLE_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case GOOGLE_SUCCESS:
      return {
        loading: false,
        user: action.payload,
        error: '',
      }
    case GOOGLE_FAILURE:
      return {
        loading: false,
        user: {},
        error: action.payload,
      }
    case GET_USERS:
      return {
        ...state,
        loading: true,
      }
    case GET_USERS_SUCCESS:
      return {
        loading: false,
        user: action.payload,
        error: '',
      }
    case GET_USERS_FAILURE:
      return {
        loading: false,
        error: action.payload,
      }

    case ADD_PERMISSION:
      return {
        ...state,
        loading: true,
      }
    case ADD_PERMISSION_SUCCESS:
      return {
        loading: false,
        status: 'Added a new permission',
        error: '',
      }
    case ADD_PERMISSION_FAILURE:
      return {
        loading: false,
        error: action.payload,
      }
    case DELETE_PERMISSION:
      return {
        ...state,
        loading: true,
      }
    case DELETE_PERMISSION_SUCCESS:
      return {
        loading: false,
        status: 'Deleted a new permission',
        error: '',
      }
    case DELETE_PERMISSION_FAILURE:
      return {
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}

export default reducer
