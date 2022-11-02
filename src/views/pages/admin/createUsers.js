import React,{useState,useEffect,useRef} from 'react'
import { Link } from 'react-router-dom'
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
import { loginUser } from '../../../redux'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { AppHeader, AppSidebar } from 'src/components'
import { toast } from 'react-toastify';

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

const CreateUsers = ({history}) => {
  const [user, setuser] = useState({username:'',location:'',day:'',time:'',active:'Active',manager:'',supporting:'',role:'employee', skills: [],technologies: [] })
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false)
  const [permission, setpermission] = useState("")
  const [singleTech, setsingleTech] = useState("")
  const [statusCheck, setstatusCheck] = useState([])
  const [technologiesArray, settechnologiesArray] = useState([])
  const [tempArray, settempArray] = useState([])
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

  const getTechnologies = async () => {
    try {
      // const Technologies = await axios.get(`/skills/6320cbbd78b2d2731c890680`);
      const Technologies = await axios.get(`/technologies/`);
      console.log(Technologies.data.technology)
      let tech = Technologies.data.technology
      let result=[]
      for(const c of tech) {
        result.push(c.technologies)
      }
      settechnologiesArray(result)
      settempArray(tech)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    // getSkills()
    getAllManagers()
    getTechnologies()
  }, [])
  
    
  const handleSubmit = async(e) => {
    e.preventDefault();

    // if(user.username.trim() === '' || user.password.trim() === '') {
    //   // console.log("first")
    //   setVisible(true)
    //   return 
    // }
  const data = await axios.post(`/users/register`,{
      "username":user.username,
      "role": user.role,
      "password":"123456fF$",
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
    return toast.success("User created successfully")
  } 
  
  const handlePermission = e => {
    e.preventDefault()
    setuser({...user,skills:[...user.skills,permission]})
    setpermission("")
  }

  const handleSingleTech = e => {
    e.preventDefault()
    setuser({...user,technologies:[...user.technologies,singleTech]})
    let data = tempArray.filter(t=>t.technologies==singleTech)
    data = data[0].skillName
    data.push(...statusCheck)
    console.log(data,statusCheck)
    data = new Set(data)
    setstatusCheck(data)
    setsingleTech("")
  }
  
  const handleChange =  e => {
    setuser({...user,[e.target.name]:e.target.value})
  }

  const handleDelete = e => {
    let seat = user.skills.filter( s => {return (s !== e)})
    setuser({...user,skills:seat})
  }
  const handleDeleteTech = async(e) => {
    const Technologies = await axios.get(`/technologies/`);
    let tech = Technologies.data.technology
    let seat = user.technologies.filter( s => {return (s !== e)})
     let data = tech.map(t=>t.technologies.indexOf(e))
     const no = data.indexOf(0)
     const datas = tech[no].skillName

     console.log("why",no,datas)
     let dataTwo = statusCheck.filter(t=>!datas.includes(t))
     setstatusCheck(dataTwo)
     setuser({...user,technologies:seat})
  }

  console.log(statusCheck)
  return (
    <>
    <AppSidebar />
    <div className="wrapper bg-light min-vh-100 d-flex flex-column align-items-center create">
      <CContainer fluid>
      <AppHeader  />  
      <CAlert color="success" dismissible visible={visible} onClose={() => setVisible(false)}>
        User Created Successfully
      </CAlert>
        <CRow className="justify-content-end">
          <CCol md={12}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <h1 className="mb-4">Create an Employee</h1>
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
                      <select defaultValue={user.location} name="location" onChange={handleChange} className="form-control">
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
                        type="time" name="time"  onChange={handleChange}
                        placeholder="Time"
                      />
                    </CInputGroup>
                    
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
                  <CInputGroup className="mb-3">
                    <label>Skill</label>  
                    <select value={permission} onChange={e=>setpermission(e.target.value)} className="form-control">
                      <option value="">Please Select a Skill</option>
                        {statusCheck?.filter(f=> !user.skills.includes(f)).map((st,i)=>(
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

export default CreateUsers
