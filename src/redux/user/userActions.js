import axios from 'axios'
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
import { toast } from 'react-toastify'

export const fetchUsers = (user, history) => {
  return (dispatch) => {
    dispatch(signupUsers())
    axios
      .post('/users/register', user)
      .then((response) => {
        // response.data is the users
        const status = response.status
        dispatch(signupUsersSuccess(status))
        toast.success('The Person has signed up')
        history.push('/login')
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(signupUsersFailure(error.response.data.msg))
      })
  }
}

export const getUser = (id) => {
  return (dispatch) => {
    dispatch(getUsers())
    axios
      .get(`/users/chat/${id}`)
      .then((response) => {
        // response.data is the users
        dispatch(getUsersSuccess(response))
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(getUsersFailure(error.response.data.msg))
      })
  }
}

export const loginUser = (user, history) => {
  return (dispatch) => {
    dispatch(loginUsers())
    axios
      .post('/users/login', user)
      .then((response) => {
        console.log(response)
        // response.data is the users
        const user = response.data.user
        const token = response.data.data
        delete user.password
        dispatch(loginUsersSuccess(user))
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('role', JSON.stringify(user.role))
        localStorage.setItem('token', token)
        localStorage.setItem('isAuthenticated', true)
        if(user.role == 'manager') {
          window.location.href = '../manager'
        }
        if(user.role == 'admin') {
          window.location.href = '../dashboard'
        }
        // toast.success('The Person has logged in')
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(loginUsersFailure(error.response.data.msg))
        toast.error(error.response.data.msg)
      })
  }
}

export const googleUser = (googleData, history) => {
  return (dispatch) => {
    dispatch(googleUsers())
    axios
      .post('/users/google', {
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
      })
      .then((response) => {
        // response.data is the users
        console.log(response)
        if (response.data.name.username == 'Shinwari Vlogs') {
          localStorage.setItem('isAdmin', true)
        }
        const user = response.data.name
        const token = response.data.data
        const permissions = response.data.permissions
        delete user.password
        delete user.permissions
        dispatch(googleUsersSuccess(user))
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('permissions', permissions)
        localStorage.setItem('isAuthenticated', true)
        toast.success('The Person has logged in via Google')
        window.location.href = '/'
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(googleUsersFailure(error.response.data.msg))
        toast.error(error.response.data.msg)
      })
  }
}

export const addPermission = (id, permission) => {
  return (dispatch) => {
    dispatch(addPermissions())
    axios
      .patch(`/users/${id}`, { permissions: permission })
      .then((response) => {
        // response.data is the users
        dispatch(addPermissionSuccess(response.data.users))
        toast.success('Permission Added')
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(addPermissionFailure(error.response.data.msg))
      })
  }
}

export const deletePermission = (id, permission) => {
  return (dispatch) => {
    dispatch(deletePermissions())
    axios
      .patch(`/users/dlt/${id}`, { permissions: permission })
      .then((response) => {
        // response.data is the users
        dispatch(deletePermissionSuccess(response.data.users))
        toast.success('Permission Deleted')
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(deletePermissionFailure(error.response.data.msg))
      })
  }
}

export const signupUsers = () => {
  return {
    type: SIGNUP_REQUEST,
  }
}

export const signupUsersSuccess = (status) => {
  return {
    type: SIGNUP_SUCCESS,
    payload: status,
  }
}

export const signupUsersFailure = (error) => {
  return {
    type: SIGNUP_FAILURE,
    payload: error,
  }
}

export const loginUsers = () => {
  return {
    type: LOGIN_REQUEST,
  }
}

export const loginUsersSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const loginUsersFailure = (error) => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  }
}

export const googleUsers = () => {
  return {
    type: GOOGLE_REQUEST,
  }
}

export const googleUsersSuccess = (name) => {
  return {
    type: GOOGLE_SUCCESS,
    payload: name,
  }
}

export const googleUsersFailure = (error) => {
  return {
    type: GOOGLE_FAILURE,
    payload: error,
  }
}

export const getUsers = () => {
  return {
    type: GET_USERS,
  }
}

export const getUsersSuccess = (users) => {
  return {
    type: GET_USERS_SUCCESS,
    payload: users,
  }
}

export const getUsersFailure = (error) => {
  return {
    type: GET_USERS_FAILURE,
    payload: error,
  }
}

export const addPermissions = () => {
  return {
    type: ADD_PERMISSION,
  }
}

export const addPermissionSuccess = (permission) => {
  return {
    type: ADD_PERMISSION_SUCCESS,
    payload: permission,
  }
}

export const addPermissionFailure = (error) => {
  return {
    type: ADD_PERMISSION_FAILURE,
    payload: error,
  }
}

export const deletePermissions = () => {
  return {
    type: DELETE_PERMISSION,
  }
}

export const deletePermissionSuccess = (permission) => {
  return {
    type: DELETE_PERMISSION_SUCCESS,
    payload: permission,
  }
}

export const deletePermissionFailure = (error) => {
  return {
    type: DELETE_PERMISSION_FAILURE,
    payload: error,
  }
}
