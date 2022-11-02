import React,{useState,useEffect,useRef} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { loginUser } from '../../../redux'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AppHeader, AppSidebar } from 'src/components';
import  logoNegative  from 'src/assets/images/logo.png'

const Login = ({history}) => {
  const [user, setuser] = useState({username:'',password:''})
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false)
    
  const handleSubmit = e => {
    e.preventDefault();
    if(user.username.trim() === '' || user.password.trim() === '') {
      // console.log("first")
      return toast.error("Complete the fields") 
    }
    dispatch(loginUser(user,history))
  }      
  
  const handleChange =  e => {
    setuser({...user,[e.target.name]:e.target.value})
  }
  console.log(user.username,user.password)
  return (
    <>
    {/* <AppSidebar /> */}
    <div className="bg-light wrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer fluid>
      {/* <AppHeader /> */}
        <CRow className="justify-content-center">
          <CCol md={9}>
        
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                <img src={logoNegative} className="sidebar-brand-full m-auto d-block mb-5 text-center"  height={75} />
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <h1 className="mb-4">Login Form</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username"  autoComplete="username" name="username" onChange={handleChange}  />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password" className='form-control' onChange={handleChange}
                        placeholder="Password"
                        autoComplete="current-password"
                        
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' onSubmit={handleSubmit}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Login
