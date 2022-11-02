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
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { loginUser } from '../../../redux'
import { cilLockLocked, cilUser } from '@coreui/icons'
import moment from 'moment';
import { AppHeader, AppSidebar } from 'src/components';

const map = {
  'Monday': 1,'Tuesday': 2,'Wednesday': 3,'Thursday': 4,'Friday': 5,'Saturday': 6,
  'Sunday': 7
};

const ManagerDashboard = () => {
  const [employees, setemployees] = useState([])
  const getSingleManager = async () => {
    // let movieData = moment().day("Sunday");
    // console.log(movieData)
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const employee = await axios.get(`/users/${user._id}`);
      console.log("hi",employee.data.userList)
      setemployees(employee.data.userList)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSingleManager()
  }, [])

  const data = () => {
    const datam = employees.map(e=>e.data.map(s=>s))
    // console.log(datam)
  }

  return (
    <>
    <AppSidebar />
    <div className="bg-light wrapper d-flex flex-row">
      <CContainer fluid>
      <AppHeader />
      {/* <CAlert color="warning" dismissible visible={visible} onClose={() => setVisible(false)}>
        Please fill all the fields
      </CAlert> */}
        <CRow className="justify-content-center">
          <CCol md={12}>
            <h1 className="text-center mb-4">Employees Record</h1>
            <table className="table mb-5 table-striped">
              <thead>
                <tr>
                  <th scope="col">Username</th><th></th><th></th>
                  <th scope="col">Day</th><th></th><th></th><th></th>
                  <th scope="col">Time</th><th></th><th></th><th></th>
                  <th scope="col">Location</th><th></th>
                </tr>
              </thead>
             
              <tbody> 
              {employees?.map(e=>(  
                <>
                <tr key={e._id}>
                <td><Link to={`/reviews/${e._id}`}><h5 className="text-capitalize">{e.username}</h5></Link></td>
                {e.data.map((s)=>(         
                  <>
                  <td> <h5> {s.day}</h5></td>
                  <td><h5> {s.time && moment(s.time, ["HH:mm"]).format("hh:mm a")}</h5></td>
                  <td><h5> {s.location}</h5></td>
                  </>
                ))}
                </tr>  
                {/* {data()} */}
                {/* {data(e.data.filter(s=>Object.keys(s)=='day'))} */}
                </>
                ))}
              {/* </div>  */}
              </tbody>
              </table> 
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default ManagerDashboard