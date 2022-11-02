import React, { Component, Suspense } from 'react'
import { HashRouter,BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminRoute from './AdminRoute'
import ManagerRoute from './ManagerRoute'
import './scss/style.scss'
import Reviews from './views/pages/manager/Reviews'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const ManagerDashboard = React.lazy(() => import('./views/pages/manager/ManagerDashboard'))
const CreateUsers = React.lazy(() => import('./views/pages/admin/createUsers'))
const CreateManagers = React.lazy(() => import('./views/pages/admin/CreateManagers'))
const AllEmployees = React.lazy(() => import('./views/pages/admin/AllEmployees'))
const AllManagers = React.lazy(() => import('./views/pages/admin/AllManagers'))
const EmployeeReview = React.lazy(() => import('./views/pages/admin/Reviews'))
const EditEmployees = React.lazy(() => import('./views/pages/admin/EditEmployees'))
const EditManagers = React.lazy(() => import('./views/pages/admin/EditManagers'))
const Reports = React.lazy(() => import('./views/pages/admin/Reports'))

class App extends Component {
  render() {
    return [
      <ToastContainer key="toasts" autoClose={ 3500 } hideProgressBar />,
      <BrowserRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route element={<AdminRoute />}>
              <Route exact path="/create/employee" element={<CreateUsers />} />
              <Route exact path="/create/managers" element={<CreateManagers />} />
              <Route exact path="/employees" element={<AllEmployees />} />
              <Route exact path="/managers" element={<AllManagers />} />
              <Route exact path="/admin/reviews/:id" element={<EmployeeReview />} />
              <Route exact path="/admin/employee/edit/:id" element={<EditEmployees />} />
              <Route exact path="/admin/manager/edit/:id" element={<EditManagers />} />
              <Route exact path="/admin/report/:id" element={<Reports />} />
              <Route exact path="*" element={<DefaultLayout />} />
            </Route>
            <Route exact path="/reviews/:id" name="Reviews" element={<Reviews />} />
            <Route element={<ManagerRoute />}>
              <Route exact path="/manager" element={<ManagerDashboard />} />
            </Route>
            {/* <ManagerRoute exact path="/manager" name="Manager Dashboard" element={<ManagerDashboard />} /> */}
            
          </Routes>
        </Suspense>
      </BrowserRouter>
    ]
  }
}

export default App
