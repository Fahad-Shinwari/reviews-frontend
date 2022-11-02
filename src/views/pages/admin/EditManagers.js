import React,{useState,useEffect,useRef} from 'react'
import { Link,useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Fade } from "react-awesome-reveal";
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
import { toast } from 'react-toastify';
import { loginUser } from '../../../redux'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AppHeader, AppSidebar } from 'src/components'

const locations = [
  "Islamabad" ,
  "Lahore" ,
  "Karachi" 
];

const EditManagers = ({history}) => {
  const params = useParams();
  const [manager, setmanager] = useState({username:'',location: '', department: '',role:'manager',employees:[] })
  const [visible, setVisible] = useState(false)
  const [employeesList, setemployeesList] = useState([])
  const [employee, setemployee] = useState("")

  const getEmployees = async () => {
    try {
      const employee = await axios.get(`/users/employees/all`);
      console.log(employee)
      setemployeesList(employee.data.user)
    }
    catch(e) {
      console.log(e);
    }
  }

  const getSingleEmployee = async () => {
    try {
      let employee = await axios.get(`/users/single/${params.id}`);
      console.log(employee)
      employee = employee.data.user
      setmanager({...manager,username:employee.username,location:employee?.data[0].location,
       employees:employee?.employees,department:employee?.data[1].department})
      // settechnologiesArray(Technologies.data.technology[0].technologies)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getEmployees()
    getSingleEmployee()
  }, [])
  
    
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const data = await axios.put(`/users/edit/${params.id}`,{
        "username":manager.username,
        "role": manager.role,
        "password":manager.password,
        "employees":manager.employees,
        "data": [{
            "location":manager.location
        },{
            "department": manager.department
        }]
      });
      return toast.success("Manager edited successfully")
      // setVisible(true)
    }catch(e) {
      console.log(e);
    }
  } 

  const handleEmployee = e => {
    e.preventDefault()
    setmanager({...manager,employees:[...manager.employees,employee]})
    setemployee("")
  }

  const handleManager =  e => {
    setmanager({...manager,[e.target.name]:e.target.value})
  }

  const handleDeleteEmployee = e => {
    let seat = manager.employees.filter( s => {return (s !== e)})
    setmanager({...manager,employees:seat})
  }

  console.log(manager)
  return (
    <>
    <AppSidebar />
    <div className="wrapper bg-light min-vh-100 d-flex flex-column align-items-center create">
      <CContainer fluid>
      <AppHeader  />  
      {/* <CAlert color="success" dismissible visible={visible} onClose={() => setVisible(false)}>
        User Updated Successfully
      </CAlert> */}
        <CRow className="justify-content-end">
          <CCol md={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <Link to='/managers'>Go Back</Link> 
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <h1 className="my-4">Edit a Manager</h1>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" value={manager.username} name="username" onChange={handleManager}  />
                      </CInputGroup>                      
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput placeholder="Department" value={manager.department} name="department" onChange={handleManager}  />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <select value={manager.location} name="location" onChange={handleManager} className="form-control">
                      <option value="">Please Select a Location</option>
                        {locations.map((f,i)=> (
                          <>
                        <option value={f} key={i}>{f}</option>
                        </>
                        ))}
                      </select>
                        {/* <CFormInput placeholder="Location" defaultValue={manager.location} name="location" onChange={handleManager}  /> */}
                      </CInputGroup>
                    <CInputGroup className="mb-3">
                    <label>Employees</label>  
                    <select value={employee} onChange={e=>setemployee(e.target.value)} className="form-control">
                      <option value="">Please Select Employees</option>
                        {employeesList?.filter(f=> !manager.employees.includes(f.username)).map((st,i)=>(
                          <>
                        <option value={st.username} key={i}>{st.username}</option>
                        </>
                        ))}
                      </select>
                      <button className={`btn btn-success ${employee ? '' : 'disabled'}`} onClick={handleEmployee}>Add Employee</button>
                    </CInputGroup>
                    <ul className="list-group mb-3">
                    <label></label>
                      {manager.employees?.map(e=>(
                        <Fade>
                        <li className="list-group-item d-flex justify-content-between">
                        <h5 className='text-capitalize'>{e}</h5>
                        <span className="badge badge-danger badge-pill text-black gi-5x"  role="button" onClick={()=>handleDeleteEmployee(e)}>x</span>
                        </li>
                        </Fade>
                      ))}
                      </ul>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' onSubmit={handleSubmit}>
                          Submit
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

export default EditManagers
