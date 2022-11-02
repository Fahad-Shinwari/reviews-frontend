import React,{useState,useEffect,useRef} from 'react'
import { Link,useParams  } from 'react-router-dom'
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
const Reviews = () => {
  const params = useParams();
  const [employees, setemployees] = useState({comment:'',review:'',ratingValue:0,supporting:'',employeeName:'',skills:[],technologies:[],employeeId:params.id,managerId:'',admin:true})
  const [visible, setVisible] = useState(false)
  const [reviewsList, setreviewsList] = useState([])
  const [managersList, setmanagersList] = useState([])
  const [statusCheck, setstatusCheck] = useState([])
  const [permission, setpermission] = useState("")
  const [employeeData, setemployeeData] = useState({})
  const [technologiesArray, settechnologiesArray] = useState([])
  const [singleTech, setsingleTech] = useState("")
  const [tempArray, settempArray] = useState([])

  const getSingleManager = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const employee = await axios.get(`/reviews/${params.id}`);
      console.log("datas",employee.data)
      setreviewsList(employee.data.review)
      // setemployees(employee.data.userList)
    }
    catch(e) {
      console.log(e);
    }
  }

  const getSingleUser = async () => {
    try {
      const employee = await axios.get(`/users/single/${params.id}`);
      setemployeeData(employee.data.user)
      console.log("whyyy",employee)
      // setemployees({...employees,employeeName:employee.data.user.username})
      if(managersList.length>0) {
        const manager = managersList?.filter(m=>m.username == employee?.data.user.manager)
        const supporting = managersList?.filter(m=>m.username == employee?.data.user.supporting)
        setemployees({...employees,managerId:manager[0]?._id,supporting:supporting[0]?._id,employeeName:employee.data.user.username})
        console.log(manager,supporting,managersList)
      }
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
    getSingleUser()
  }, [managersList])
  
  useEffect(() => {
    getSingleManager()
    getAllManagers()
    // getSkills()
    getSingleUser()
    getTechnologies()
  }, [])

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(employees.comment.trim() === '' || employees.review.trim() === '') {
      return toast.error("Complete the fields") 
    }
    try {
      const employee = await axios.post(`/reviews/`,employees);
      // setVisible(true)
      getSingleManager()
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = e => {
    console.log(e.target.value)
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

  const handleDeleteTech = async(e) => {
    const Technologies = await axios.get(`/technologies/`);
    let tech = Technologies.data.technology
    let seat = employees.technologies.filter( s => {return (s !== e)})
     let data = tech.map(t=>t.technologies.indexOf(e))
     const no = data.indexOf(0)
     const datas = tech[no].skillName

     console.log("why",no,datas)
     let dataTwo = statusCheck.filter(t=>!datas.includes(t))
     setstatusCheck(dataTwo)
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
    let data = tempArray.filter(t=>t.technologies==singleTech)
    data = data[0].skillName
    data.push(...statusCheck)
    console.log(data,statusCheck)
    data = new Set(data)
    setstatusCheck(data)
    setsingleTech("")
  }
console.log("hi",employees)
  return (
    <>
    <AppSidebar />
    <div className="bg-light wrapper min-vh-100 d-flex flex-row create manager">
      <CContainer fluid>
        <AppHeader />
        <CRow className="justify-content-center">
          <CCol md={12}>
          <Link to='/employees' className='mt-4'>Go Back</Link> 
            <h2 className="my-4 text-capitalize">Add A Review for {employeeData.username}</h2>
             <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm type="submit" onSubmit={handleSubmit}>
                    <p className="text-medium-emphasis">Give a review</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <textarea class="form-control" id="exampleFormControlTextarea1" rows="4" name="comment" onChange={handleChange} required></textarea>
                    </CInputGroup>
                    <p className="text-medium-emphasis">Give Star</p>
                    {/* <CFormCheck
                      type="radio"
                      name="review"
                      id="Excellent"
                      value="Excellent"
                      label="Excellent"
                      onChange={handleChange}
                    />
                    <CFormCheck
                      id="mac"
                      value="Good"
                      name="review"
                      type="radio"
                      label="Good"
                      onChange={handleChange}
                    /> */}
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
                    <div className='d-flex justify-content-between'>
                    <div className='left'>  
                    <p className="text-medium-emphasis mt-3">Manager</p>
                    <CInputGroup className="mb-4">
                    <select value={employees.managerId} className="form-control">
                        {managersList?.map((f,i)=> (
                          <>
                        {f.username == employeeData.manager && <option value={f._id} key={i}>{f.username}</option>}
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    </div>
                    <div  className='right'>
                    <p className="text-medium-emphasis mt-3">Supporting Manager</p>
                    <CInputGroup className="mb-4">
                    <select value={employees.supporting} className="form-control">
                        {managersList?.map((f,i)=> (
                          <>
                        {f.username == employeeData.supporting && <option value={f._id} key={i}>{f.username}</option>}
                        </>
                        ))}
                      </select>
                    </CInputGroup>
                    </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                    
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
                  <div className='left'>  
                    <p className="text-medium-emphasis">Skill</p>
                    <CInputGroup className="mb-3">
                    <select value={permission} onChange={e=>setpermission(e.target.value)} className="form-control">
                      <option value="">Please Select a Skill</option>
                        {statusCheck?.filter(f=> !employees.skills.includes(f)).map((st,i)=>(
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
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default Reviews