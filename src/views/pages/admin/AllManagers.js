import React,{useState,useEffect,useRef} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import Modal from 'react-modal';
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
import { cilAddressBook, cilAvTimer, cilLockLocked, cilPencil, cilUser } from '@coreui/icons'
import moment from 'moment';
import { AppHeader, AppSidebar } from 'src/components';
import DataTable from 'react-data-table-component';

const map = {
  'Monday': 1,'Tuesday': 2,'Wednesday': 3,'Thursday': 4,'Friday': 5,'Saturday': 6,
  'Sunday': 7
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '70%'
  },
};

const statusCheck = [
  { name: "manager" },
  { name: "employee" },
  { name: "admin" },
];
const activeCheck = [
  { name: "Active" },
  { name: "Inactive" },
];

const columns = [
  {
    name: '',
    selector: row => row.role=='employee' ? <><Link to={`/admin/reviews/${row._id}`}><CIcon icon={cilAvTimer} className="me-3"/></Link><Link to={`/admin/employee/edit/${row._id}`}><CIcon icon={cilPencil} className="me-3" /></Link><Link to={`/admin/report/${row._id}`}><CIcon icon={cilAddressBook} /></Link></> : 
    row.role=='manager' ? <Link to={`/admin/manager/edit/${row._id}`}><CIcon icon={cilPencil} /></Link> : '',
  },
  {
      name: 'Username',
      selector: row => row.username,
      sortable:true
  },
  {
      name: 'Location',
      selector: row => row.data.map((s)=>s.location),
      sortable:true
  }
];

const AllEmployees = () => {
  const [user, setuser] = useState({username:'',location:'',day:'',time:'',active:'Active',manager:'',supporting:'',role:'employee', skills: [],technologies: [] })
  const [employees, setemployees] = useState([])
  const [filterData, setfilterData] = useState()
  const [role, setrole] = useState(null)
  const [action, setaction] = useState(null)
  const [name, setname] = useState(null)
  const [pending, setPending] = useState(true);


  const getSingleManager = async () => {
    // let movieData = moment().day("Sunday");
    // console.log(movieData)
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const employee = await axios.get(`/users/all`);
      console.log(employee.data.user)
      let result = employee.data.user;
      result=result.filter(i => i.role=='manager')
      setemployees(result)
      setPending(false);
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getSingleManager()
  }, [])
  useEffect(() => {
    //Filter options updated so apply all filters here
    let result = employees;
    // if(role) {
    //   result=result.filter(i => i.role==role)
    // }
    if(action) {
      result=result.filter(i => i.active==action)
    }
    if(name) {
      result = result.filter(
        (item) =>
          item.username.toLowerCase().search(name.toLowerCase().trim()) !==
          -1
      );
    }
    setfilterData(result);
}, [role,action,name,employees ]);

  // const handleChangeRole = e => {
  //     setrole(e.target.value);
  // }
  const handleChangeName = e => {
    setname(e.target.value);
  }

  const handleChangeActive = e => {
    setaction(e.target.value);
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
            <h1 className="text-center mb-4">{filterData ? filterData.length : employees.length} Record/s Found</h1>
            <div className='d-flex filters mb-5'>
            <CFormInput placeholder="Search Name" value={name} name="name" onChange={handleChangeName}  />
           
            {/* <select name="role" onChange={handleChangeRole} value={role} className="form-control">
            <option value="">Please Select a Role</option>
              {statusCheck?.map((st,i)=>(
                <>
              <option value={st.name} key={i}>{st.name}</option>
              </>
              ))}
            </select> */}
            <select name="action" onChange={handleChangeActive} value={action} className="form-control ms-5">
            <option value="">Select Active or Inactive</option>
              {activeCheck?.map((st,i)=>(
                <>
              <option value={st.name} key={i}>{st.name}</option>
              </>
              ))}
            </select>
            </div>
            <DataTable
              columns={columns}
              data={filterData}
              progressPending={pending}
            />
            {/* <table className="table mb-5 table-striped">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Username</th><th></th><th></th>
                  <th scope="col">Location</th><th></th><th></th><th></th>
                </tr>
              </thead>
             
              <tbody> 
              {filterData && filterData?.map(e=>(  
                <>
                <tr key={e._id}>
                <td><h5>{e.role=='employee' ? <><Link to={`/admin/reviews/${e._id}`}><CIcon icon={cilAvTimer} className="me-3"/></Link><Link to={`/admin/employee/edit/${e._id}`}><CIcon icon={cilPencil} className="me-3" /></Link><Link to={`/admin/report/${e._id}`}><CIcon icon={cilAddressBook} /></Link></> :
                e.role=='manager' ? <Link to={`/admin/manager/edit/${e._id}`}><CIcon icon={cilPencil} /></Link> : ''}</h5></td>
                <td><h5 className="text-capitalize">{e.username}</h5></td>
                {e.data.map((s)=>(         
                  <>
                  <td> <h5> {s.day}</h5></td>
                  <td><h5> {s.time && moment(s.time, ["HH:mm"]).format("hh:mm a")}</h5></td>
                  <td><h5> {s.location}</h5></td>
                  </>
                ))}
                </tr>  
                </>
                ))
                }
              </tbody>
              </table>  */}
          </CCol>
        </CRow>
      </CContainer>
    </div>
    </>
  )
}

export default AllEmployees