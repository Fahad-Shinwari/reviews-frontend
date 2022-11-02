import React,{useRef,useState,useEffect} from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownHeader,
  CDropdownDivider,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { io } from "socket.io-client";
import { cilBell,cilBellExclamation, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import  logo  from 'src/assets/images/logo.png'

// const logout=()=> {
//   localStorage.clear();
//   window.location.href = '#/login';
// }
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const socket = useRef();
  const [adminId] = useState(JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user"))._id : '' )
  const [admin] = useState("6317b0389c91221c54759fcb")
  const [notifications, setnotifications] = useState([])

  useEffect(() => {
    socket.current = io("http://localhost:5000",{transports: ['websocket'], upgrade: false});
    // const adminId = JSON.parse(localStorage.getItem("user"))._id
    if(adminId && adminId==admin){
      socket.current.emit("add-notifications", admin);
    }
}, [adminId]);

const updateNotifications = (c) => {
  setnotifications(notifications => [...notifications, c]);
}

useEffect(() => {
  if (socket.current) {
    socket.current.on("review-added", (details) => {   
      const c = {manager: details.manager,review: details.rating, employee:details.username}; 
      updateNotifications(c)
      // return toast.success(`Post ${details.blogId} Liked by:   ${details.user}`)
    });
  }
}, []);

// console.log(notifications)
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink role="button" onClick={logout}>Logout</CNavLink>
          </CNavItem>  */}
            {/* <CNavLink onClick={logout} component={NavLink}>
              Logout
            </CNavLink> */}
          {/* <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
         */}
        </CHeaderNav>
        {/* <li className="nav-item">
            <Link onClick={logout}  className='nav-link'>Log Out</Link>
          </li> */}
        <CHeaderNav>
           
          <CNavItem>
            {notifications.length == 0 ? <CNavLink>
              <CIcon icon={cilBell} size="lg" className='filled' />
            </CNavLink> : 
            // <CNavLink>
            //   <CIcon icon={cilBellExclamation} size="lg" className='filled' />{notifications.length}
            // </CNavLink>
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
                  <CIcon icon={cilBellExclamation} size="lg" className='filled' />{notifications.length}
              </CDropdownToggle>
              <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
                <CDropdownDivider />
                {notifications && notifications.slice(0).reverse().map(n=>
                  <h5><a class="dropdown-item"><span className="badge badge-danger">Manager</span> <span className="manager"> {n.manager} </span> <span className="badge badge-success">added</span> rating <span className="badge badge-success">{n.review}</span> on  <span className="manager"> {n.employee} </span></a><hr /></h5>  
                )}
              </CDropdownMenu>
            </CDropdown>
            }
          </CNavItem>
          {/*
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem> */}
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
