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

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const locations = [
  "Islamabad" ,
  "Lahore" ,
  "Karachi" 
];

const action = [
  "Active" ,
  "Inactive" ,
];

const EditEmployees = ({history}) => {
  const params = useParams();
  const [user, setuser] = useState({username:'',location:'',day:'',time:'',active:'Active',manager:'',supporting:'',role:'employee', skills: [],technologies: [] })
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false)
  const [permission, setpermission] = useState("")
  const [singleTech, setsingleTech] = useState("")
  const [statusCheck, setstatusCheck] = useState([])
  const [technologiesArray, settechnologiesArray] = useState([])
  const [managersList, setmanagersList] = useState([])

  const getAllManagers = async () => {
    try {
      const id = JSON.parse(localStorage.getItem("user"))._id
      const managers = await axios.get(`/users/managers/${id}`);
      setmanagersList(managers.data.user)
      // setmanagersList(managers)
    }
    catch(e) {
      console.log(e);
    }
  }

  const getSkills = async () => {
    try {
      const skills = await axios.get(`/skills/6320cbbd78b2d2731c890680`);
      setstatusCheck(skills.data.skill[0].skills)
    }
    catch(e) {
      console.log(e);
    }
  }

  const getTechnologies = async () => {
    try {
      const Technologies = await axios.get(`/technologies/634938e58b9e47870c56e30b`);
      // console.log(Technologies.data.technology[0].technologies)
      settechnologiesArray(Technologies.data.technology[0].technologies)
    }
    catch(e) {
      console.log(e);
    }
  }

  const getSingleEmployee = async () => {
    try {
      let employee = await axios.get(`/users/single/${params.id}`);
      employee = employee.data.user
      setuser({...user,username:employee.username,location:employee?.data[0].location,active:employee.active,
      manager:employee.manager,supporting:employee.supporting,day:employee?.data[2].day,time:employee?.data[3].time,
    skills:employee?.data[1].skills,technologies:employee?.data[4].technologies})
      // settechnologiesArray(Technologies.data.technology[0].technologies)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSkills()
    getAllManagers()
    getTechnologies()
    getSingleEmployee()
  }, [])
  
    
  const handleSubmit = async(e) => {
    e.preventDefault();

    // if(user.username.trim() === '' || user.password.trim() === '') {
    //   // console.log("first")
    //   setVisible(true)
    //   return 
    // }
    try {
  const data = await axios.put(`/users/edit/${params.id}`,{
      "username":user.username,
      "role": user.role,
      "active":user.active,
      "manager":user.manager,
      "supporting": user.supporting,
      "data": [{
          "location":user.location
      },{
          "skills": user.skills
      },{
        "day": user.day
    },{
      "time": user.time
    },{
      "technologies": user.technologies
    }
    ]
    });
    return toast.success("Employee edited successfully")
  }catch(e) {
    console.log(e);
  }
  } 
  
  const handlePermission = e => {
    e.preventDefault()
    setuser({...user,skills:[...user.skills,permission]})
    setpermission("")
  }

  const handleSingleTech = e => {
    e.preventDefault()
    setuser({...user,technologies:[...user.technologies,singleTech]})
    setsingleTech("")
  }
  
  const handleChange =  e => {
    setuser({...user,[e.target.name]:e.target.value})
  }

  const handleDelete = e => {
    let seat = user.skills.filter( s => {return (s !== e)})
    setuser({...user,skills:seat})
  }
  const handleDeleteTech = e => {
    let seat = user.technologies.filter( s => {return (s !== e)})
    setuser({...user,technologies:seat})
  }

  console.log(user)
  return (
    <>
    <AppSidebar />
    <div className="wrapper bg-light min-vh-100 d-flex flex-column align-items-center create">
      <CContainer fluid>
      <AppHeader  /> 
        <CRow className="justify-content-end">
          <CCol md={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                <Link to='/employees'>Go Back</Link> 
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <h1 className="my-4">Edit an Employee</h1>
                    <CInputGroup className="mb-3">
                      <label >Title</label>
                      <CInputGroupText className="ml-5">
                        <CIcon icon={cilUser} className="ml-5" />
                      </CInputGroupText>
                      <CFormInput placeholder="Title" value={user.username} name="username" onChange={handleChange}  />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                    <label>Location</label>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <select value={user.location} name="location" onChange={handleChange} className="form-control">
                      <option value="">Please Select a Location</option>
                        {locations.map((f,i)=> (
                          <>
                        <option value={f} key={i}>{f}</option>
                        </>
                        ))}
                      </select>
                      {/* <CFormInput placeholder="Location" defaultValue={user.location} name="location" onChange={handleChange}  /> */}
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                    <label>Active</label>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <select defaultValue={user.active} name="active" onChange={handleChange} className="form-control">
                      <option value="">Please Select</option>
                        {action.map((f,i)=> (
                          <>
                        <option value={f} key={i}>{f}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                    <label>Manager</label>
                    <select value={user.manager} name="manager" onChange={handleChange} className="form-control">
                      <option value="">Please Select Manager</option>
                        {managersList?.map((f,i)=> (
                          <>
                        <option value={f.username} key={i}>{f.username}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                    <label>Supporting Manager</label>
                    <select value={user.supporting} name="supporting" onChange={handleChange} className="form-control">
                      <option value="">Please Select a Supporting Manager</option>
                        {managersList?.map((f,i)=> (
                          <>
                        <option value={f.username} key={i}>{f.username}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                    <label>Day</label>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <select value={user.day} name="day" onChange={handleChange} className="form-control">
                      <option value="">Please Select a Day</option>
                        {days.map((f,i)=> (
                          <>
                        <option value={f} key={i}>{f}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <label>Time</label>
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="time" name="time" value={user.time}  onChange={handleChange}
                        placeholder="Time"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                    <label>Skill</label>  
                    <select value={permission} onChange={e=>setpermission(e.target.value)} className="form-control">
                      <option value="">Please Select a Skill</option>
                        {statusCheck.filter(f=> !user.skills.includes(f)).map((st,i)=>(
                          <>
                        <option value={st} key={i}>{st}</option>
                        </>
                        ))}
                      </select>
                      <button className={`btn btn-success ${permission ? '' : 'disabled'}`} onClick={handlePermission}>Add Skill</button>
                    </CInputGroup>
                   
                    <ul className="list-group mb-3">
                    <label></label>
                      {user.skills?.map(permission=>(
                        <li className="list-group-item d-flex justify-content-between" role="button">
                        <h5 className='text-capitalize'>{permission}</h5>
                        <span className="badge badge-danger badge-pill text-black gi-5x"  role="button" onClick={()=>handleDelete(permission)}>x</span>
                        </li>
                      ))}
                      </ul>
                  <CInputGroup className="mb-3">
                    <label>Technology</label>  
                    <select value={singleTech} onChange={e=>setsingleTech(e.target.value)} className="form-control">
                      <option value="">Please Select a Technology</option>
                        {technologiesArray.filter(f=> !user.technologies.includes(f)).map((st,i)=>(
                          <>
                        <option value={st} key={i}>{st}</option>
                        </>
                        ))}
                      </select>
                      <button className={`btn btn-success ${singleTech ? '' : 'disabled'}`} onClick={handleSingleTech}>Add Tech</button>
                  </CInputGroup> 
                  <ul className="list-group mb-3">
                  <label></label>
                      {user.technologies?.map(p=>(
                        <li className="list-group-item d-flex justify-content-between" role="button">
                        <h5 className='text-capitalize'>{p}</h5>
                        <span className="badge badge-danger badge-pill text-black gi-5x"  role="button" onClick={()=>handleDeleteTech(p)}>x</span>
                        </li>
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

export default EditEmployees
