import React,{useState,useEffect,useRef} from 'react'
import { Link,useParams  } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { io } from "socket.io-client";
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
const Reviews = () => {
  const params = useParams();
  const [employees, setemployees] = useState({comment:'',review:'',ratingValue:0,supporting:'',employeeName:'',skills:[],technologies: [],employeeId:params.id,managerId:''})
  const [visible, setVisible] = useState(false)
  const [reviewsList, setreviewsList] = useState([])
  const [managersList, setmanagersList] = useState([])
  const [statusCheck, setstatusCheck] = useState([])
  const [permission, setpermission] = useState("")
  const [managerName, setmanagerName] = useState(JSON.parse(localStorage.getItem("user")).username)
  const socket = useRef();
  const [admin] = useState("6317b0389c91221c54759fcb")
  const [username, setusername] = useState("")
  const [employeeData, setemployeeData] = useState({})
  const [singleTech, setsingleTech] = useState("")
  const [technologiesArray, settechnologiesArray] = useState([])

  useEffect(() => {
    socket.current = io("http://localhost:5000",{transports: ['websocket'], upgrade: false});
}, []);

  const getSingleManager = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const manager = JSON.parse(localStorage.getItem("user"))._id
    // console.log(manager)
    try {
      const employee = await axios.get(`/reviews/${JSON.parse(localStorage.getItem("user"))._id}/${params.id}`);
      // console.log("datas",employee.data)
      console.log("yeyey",employee.data.review)
      setreviewsList(employee.data.review)
      setemployees({...employees,managerId:manager})
      // setemployees(employee.data.userList)
    }
    catch(e) {
      console.log(e);
    }
  }

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
  const getUsername = async () => {
    try {
      const managers = await axios.get(`/users/single/${params.id}`);
      setusername(managers.data.user.username)
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

  const getSingleUser = async () => {
    try {
      const employee = await axios.get(`/users/single/${params.id}`);
      // console.log("whyyy",employee)
      setemployeeData(employee.data.user)
      // console.log(managersList)
      // setemployees({...employees,employeeName:employee.data.user.username})
      if(managersList.length>0) {
        // const manager = managersList?.filter(m=>m.username == employee?.data.user.manager)
        const supporting = managersList?.filter(m=>m.username == employee?.data.user.supporting)
        setemployees({...employees,supporting:supporting[0]?._id,employeeName:employee.data.user.username})
        console.log(supporting,managersList)
      }
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

  useEffect(() => {
    getSingleUser()
  }, [managersList])
  
  useEffect(() => {
    // getSingleUser()
    getSingleManager()
    getSkills()
    getUsername()
    getAllManagers()
    getTechnologies()
  }, [])

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(employees.comment.trim() === '' || employees.review.trim() === '') {
      return toast.error("Complete all the fields")
    }
    try {
      const employee = await axios.post(`/reviews/`,employees);
      socket.current.emit("added-review", {
        manager: managerName,
        admin:admin,
        rating: employees.review,
        username
      });
      // setVisible(true)
      getSingleManager()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = e => {
    setemployees({...employees,[e.target.name]:e.target.value})
    if(e.target.value == 'Excellent') {
      setemployees({...employees,ratingValue:5,review:'Excellent'})
    }else if(e.target.value == 'Good'){
      setemployees({...employees,ratingValue:4,review:'Good'})
    }else if(e.target.value == 'Average'){
      setemployees({...employees,ratingValue:2,review:'Average'})
    }else if(e.target.value == 'Bad'){
      setemployees({...employees,ratingValue:1,review:'Bad'})
    }
  }

  const handleDelete = e => {
    let seat = employees.skills.filter( s => {return (s !== e)})
    setemployees({...employees,skills:seat})
  }
  const handleDeleteTech = e => {
    let seat = employees.technologies.filter( s => {return (s !== e)})
    setemployees({...employees,technologies:seat})
  }

  const handlePermission = e => {
    e.preventDefault()
    setemployees({...employees,skills:[...employees.skills,permission]})
    setpermission("")
  }
  const handleSingleTech = e => {
    e.preventDefault()
    setemployees({...employees,technologies:[...employees.technologies,singleTech]})
    setsingleTech("")
  }
console.log("man list",employees,JSON.parse(localStorage.getItem("user"))._id)
  return (
    <>
    <AppSidebar />
    <div className="bg-light wrapper min-vh-100 d-flex flex-row create manager">
      <CContainer fluid>
        <AppHeader />
        <CRow className="justify-content-center">
          <CCol md={12}>
          <Link to='/manager' className='mt-4'>Go Back</Link> 
            <h2 className="my-4">Add A Review for {employeeData.username} </h2>
             <CCardGroup>
              <CCard className="p-5">
                <CCardBody>
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <p className="text-medium-emphasis">Give a review </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="4" name="comment" onChange={handleChange} required></textarea>
                    </CInputGroup>
                    <p className="text-medium-emphasis">Give Star</p>
                    <CInputGroup className="mb-4">
                    <select value={employees.review} name="review" onChange={handleChange} className="form-control">
                      <option value="">Please Select a review</option>
                        {rating.map((f,i)=> (
                          <>
                        <option value={f} key={i}>{f}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <p className="text-medium-emphasis mt-3">Supporting Manager</p>
                    <CInputGroup className="mb-4">
                    <select value={employees.supporting} name="supporting" onChange={handleChange} className="form-control">
                      <option value="">Please Selecting Manager</option>
                        {managersList?.map((f,i)=> (
                          <>
                        <option value={f._id} key={i}>{f.username}</option>
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    <div className='d-flex justify-content-between'>
                    <div className='left'> 
                    <p className="text-medium-emphasis">Skill</p>
                    <CInputGroup className="mb-3">
                    <select value={permission} onChange={e=>setpermission(e.target.value)} className="form-control">
                      <option value="">Please Select a Skill</option>
                        {statusCheck.filter(f=> !employees.skills.includes(f)).map((st,i)=>(
                          <>
                        <option value={st} key={i}>{st}</option>
                        </>
                        ))}
                      </select>
                      <button className={`btn btn-success ${permission ? '' : 'disabled'}`} onClick={handlePermission}>Add Skill</button>
                    </CInputGroup>
                    <ul className="list-group mb-3">
                      {employees.skills?.map(permission=>(
                        <Fade>
                        <li className="list-group-item d-flex justify-content-between" role="button">
                        <h5 className='text-capitalize'>{permission}</h5>
                        <span className="badge badge-danger badge-pill text-black gi-5x"  role="button" onClick={()=>handleDelete(permission)}>x</span>
                        </li>
                        </Fade>
                      ))}
                      </ul>
                      </div>
                      <div className='right'> 
                      <p className="text-medium-emphasis">Technology</p>  
                      <CInputGroup className="mb-3">
                    <select value={singleTech} onChange={e=>setsingleTech(e.target.value)} className="form-control">
                      <option value="">Please Select a Technology</option>
                        {technologiesArray.filter(f=> !employees.technologies.includes(f)).map((st,i)=>(
                          <>
                        <option value={st} key={i}>{st}</option>
                        </>
                        ))}
                      </select>
                      <button className={`btn btn-success ${singleTech ? '' : 'disabled'}`} onClick={handleSingleTech}>Add Tech</button>
                  </CInputGroup> 
                  <ul className="list-group mb-3">
                      {employees.technologies?.map(p=>(
                        <li className="list-group-item d-flex justify-content-between" role="button">
                        <h5 className='text-capitalize'>{p}</h5>
                        <span className="badge badge-danger badge-pill text-black gi-5x"  role="button" onClick={()=>handleDeleteTech(p)}>x</span>
                        </li>
                      ))}
                  </ul> 
                  </div>
                  </div>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' onSubmit={handleSubmit}>
                          Add Review
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
            <h1 className="my-5 ml-3">Your Reviews</h1>
            {reviewsList.slice(0).reverse().map((r)=>(
              <div className="d-flex justify-content-between employees">
                <h6><span className="comment">{r.comment}</span> with a rating <span className={r.review == 'Excellent' ? 'excellent' : r.review == 'Good' ? 'good' : r.review == 'Average' ? 'average': r.review == 'Bad' ? 'bad': ''}>{r.review}</span> </h6>
                <h6>{moment(r.createdAt).fromNow()}</h6>
              </div>
            ))}
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Reviews