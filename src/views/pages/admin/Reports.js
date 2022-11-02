import React,{useState,useEffect,useRef} from 'react'
import { Link,useParams  } from 'react-router-dom'
import Pdf from "react-to-pdf";
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
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
  CAlert,
  CFormCheck
} from '@coreui/react'
import axios from 'axios'
import CIcon from '@coreui/icons-react'
import { loginUser } from '../../../redux'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AppHeader, AppSidebar } from 'src/components';

const rating = [
  "Excellent",
  "Good",
  "Average",
  "Bad"
]

const Reports = () => {
  const params = useParams();
  const ref = useRef();
  const [reviewsList, setreviewsList] = useState(undefined)
  const [employeeData, setemployeeData] = useState({})
  const [from, setfrom] = useState("")
  const [to, setto] = useState("")

  const getSingleManager = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const employee = await axios.get(`/reviews/${params.id}`);
      // console.log("datas",employee.data)
      setreviewsList(employee.data.review)
      console.log("first")
      // setemployees(employee.data.userList)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSingleManager()
    getSingleUser()
  }, [])

  const filter = () => {
    if(reviewsList?.length==0) {
      getSingleManager()
    }else{
      let data = reviewsList
    
      if(from) {
        data = reviewsList.filter(r=>(moment(r.createdAt).format('MMM D, YYYY')>=moment(from).format('MMM D, YYYY')))
      } 
      if(to) {
        data = reviewsList.filter(r=>moment(r.createdAt).format('MMM D, YYYY')<=moment(to).format('MMM D, YYYY'))
      }
      if(from && to) {
        data = reviewsList.filter(r=>(moment(r.createdAt).format('MMM D, YYYY')>=moment(from).format('MMM D, YYYY')
        && moment(r.createdAt).format('MMM D, YYYY')<=moment(to).format('MMM D, YYYY')))
        // console.log(data)
      } 
      console.log("second",data)
      setreviewsList(data)
    }
  }

  const handleChangeFrom = e => {
    setfrom(e.target.value);
  }

  const handleChangeTo = e => {
    setto(e.target.value);
  }

  const getSingleUser = async () => {
    try {
      const employee = await axios.get(`/users/single/${params.id}`);
      setemployeeData(employee.data.user)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    filter()
  }, [from,to,employeeData])

  return (
    <>
    <AppSidebar />
    <div className="bg-light wrapper min-vh-100 d-flex flex-row create manager">
      <CContainer fluid>
        <AppHeader />
        <CRow className="justify-content-center">
          <CCol md={12}>
          <Link to='/employees' className='mt-4'>Go Back</Link> 
          <div className='d-flex justify-content-between align-items-center'>
            <h2 className="my-4 text-capitalize">Reports for {employeeData.username}</h2>
            <Pdf targetRef={ref} filename="employee-report.pdf" scale={0.5}>
              {({ toPdf }) => <button className='btn btn-success' style={{height:'3rem', color:'white'}} onClick={toPdf}>Generate Pdf</button>}
            </Pdf>
          </div> 
          <div className='d-flex justify-content-between align-items-center'>
          <CInputGroup className="mb-3">
            <label>From</label>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <input type="date" value={from} name="from" onChange={handleChangeFrom} className="form-control mr-4" />
          </CInputGroup>
          <CInputGroup className="mb-3 ms-5">
          <label className='ml-4'>To</label>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <input type="date" value={to} name="to" onChange={handleChangeTo} className="form-control" />
          </CInputGroup>

          </div>
            <div ref={ref} style={{width: '100%'}}>
            <h1 className="my-5 ml-3">All Reviews</h1>
            <table className="table mb-5 table-striped">
              <thead>
                <tr>
                  <th scope="col"><h6>Comments</h6></th>
                  <th scope="col"><h6>Rating</h6></th>
                  <th scope="col"><h6>Added By:</h6></th>
                  <th scope="col"> <h6>Manager</h6></th>
                  <th scope="col"> <h6>Time</h6></th>
                </tr>
              </thead>
              <tbody> 
            {reviewsList?.slice(0).reverse().map((r)=>(
              <tr key={r._id}>
                <td><h6>{r.comment}</h6></td>
                <td><h6>{r.review}</h6></td>
                <td><h6 className={r.admin ? 'text-red' : 'text-green'}>{r.admin ? 'Admin' : 'Manager'}</h6></td>
                <td><h6>{r.skills[0].username}</h6></td>
                <td><h6>{moment(r.createdAt).fromNow()}</h6></td>
              </tr>  
            ))}
            </tbody>
            </table>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Reports