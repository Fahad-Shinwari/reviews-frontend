import React,{useState,useEffect} from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import moment from "moment";

var theMondays = [];

const events = [
  {
    start: moment('2022-10-14', 'YYYY-MM-DD').toDate(),
    end: moment('2022-10-14', 'YYYY-MM-DD').add(2, "hours").toDate(),
    title: "Cumple"
  },
];
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WidgetsDropdown = () => {
  console.log(theMondays)
  const [employeesList, setemployeesList] = useState([])
  const [bestPerforming, setbestPerforming] = useState([])
  const [allEvents, setAllEvents] = useState(events);

  const getTodayReviews = async () => {
    try {
      const employee = await axios.get(`/users/review/today`);
      // console.log(employee.data.review)
      // let zindo = employee.data.review
      // zindo.map(z=>{
      //   for ( var weeki = 0; weeki < 53; weeki++ ) {
      //     theMondays.push({ 
      //      start:moment(z.data[3].time, ["h:mm A"]).day(z.data[2].day).add( weeki * 7, 'days').toDate(),
      //      end: moment(z.data[3].time, ["h:mm A"]).add(30, 'minutes').day(z.data[2].day).add( weeki * 7, 'days').toDate(),
      //     title: z.username
      //    });
      // }
      // })
      
      setemployeesList(employee.data.review)
    }
    catch(e) {
      console.log(e);
    }
  }
  const getEmployeeReviews = async () => {
    try {
      const employee = await axios.get(`/users/employees/all`);
      console.log(employee.data.user)
      let zindo = employee.data.user
      zindo.map(z=>{
        for ( var weeki = 0; weeki < 53; weeki++ ) {
          theMondays.push({ 
           start:moment(z.data[3].time, ["h:mm A"]).day(z.data[2].day).add( weeki * 7, 'days').toDate(),
           end: moment(z.data[3].time, ["h:mm A"]).add(30, 'minutes').day(z.data[2].day).add( weeki * 7, 'days').toDate(),
          title: z.username
         });
      }
      })
    
    }
    catch(e) {
      console.log(e);
    }
  }

  const getAllReviews = async () => {
    try {
      const employee = await axios.get(`/reviews/all`);
      console.log("hiiii",employee.data.review)
      // const wow = employee.data.review.reduce((acc, obj) =>obj.employeeId=="6346b713b96c6d471c4d2be0" &&  acc + obj.ratingValue , 0);
    //   let result = employee.data.review?.reduce((r, { employeeId, ratingValue }) => {
    //     var temp = r.find(o => employeeId === o.employeeId);
    //     if (!temp) {
    //         r.push(temp = { employeeId, data: [] });
    //     }
    //     temp.data.push({ ratingValue });
    //     return r;
    // }, []);
    let sum = 0
    let result = employee.data.review?.reduce((r, { employeeName, ratingValue }) => {
      var temp = r.find(o => employeeName === o.employeeName);
      if (!temp) {
          r.push(temp = { employeeName, data: [], count:0 });
          sum = 0
      }
      sum += ratingValue
      temp.data = (sum);
      temp.count++
      return r;
  }, []);
  result = result.filter(r=>r.data = Number(r.data/r.count).toFixed(1))
  // console.log("nnjn",result.sort((a,b)=>b.data-a.data))
    // let best = result.sort((a,b)=>b.data-a.data)
    console.log("after",result)
    setbestPerforming(result)
    // let worst = result.sort((a,b)=>a.data-b.data)
    // setworstPerforming(worst)
    // const set = result?.map(m=>m.data.reduce((acc,obj)=> acc+obj.ratingValue,0)/m.data.length)
    // const setTwo = result?.map(m=>m.data.reduce((acc,obj)=> acc+obj.ratingValue,0))
    // console.log("dndn",set,setTwo)  
      // setemployeesList(employee.data.review)
    }
    catch(e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getTodayReviews()
    getAllReviews()
    getEmployeeReviews()
  }, [])
  console.log(theMondays)
  return (
    <CRow>
      {/* <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={
            <>
              26K{' '}
              <span className="fs-6 fw-normal">
                (-12.4% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Users"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-primary'),
                    data: [65, 59, 84, 84, 51, 55, 40],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: 30,
                    max: 89,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                    tension: 0.4,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={
            <>
              $6.200{' '}
              <span className="fs-6 fw-normal">
                (40.9% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Income"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: getStyle('--cui-info'),
                    data: [1, 18, 9, 17, 34, 22, 11],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    min: -9,
                    max: 39,
                    display: false,
                    grid: {
                      display: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 1,
                  },
                  point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={
            <>
              2.49{' '}
              <span className="fs-6 fw-normal">
                (84.7% <CIcon icon={cilArrowTop} />)
              </span>
            </>
          }
          title="Conversion Rate"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3"
              style={{ height: '70px' }}
              data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40],
                    fill: true,
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }}
            />
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={
            <>
              44K{' '}
              <span className="fs-6 fw-normal">
                (-23.6% <CIcon icon={cilArrowBottom} />)
              </span>
            </>
          }
          title="Sessions"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="p-0">
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>Action</CDropdownItem>
                <CDropdownItem>Another action</CDropdownItem>
                <CDropdownItem>Something else here...</CDropdownItem>
                <CDropdownItem disabled>Disabled action</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartBar
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                  'January',
                  'February',
                  'March',
                  'April',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(255,255,255,.2)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
                    barPercentage: 0.6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawTicks: false,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                },
              }}
            />
          }
        />
      </CCol> */}
      <h2 className='mb-3'>Calendar for all reviews</h2>
      <CCol sm={12} lg={12} className="my-4" style={{background:'white'}}>
      <Calendar events={theMondays} localizer={localizer} startAccessor="start" endAccessor="end" style={{ height: 500, margin: "50px" }} />
      </CCol>
      <CCol sm={12} lg={12} className="mb-4">
        <h2 className='mb-3'>Today's Reviews</h2>
        {employeesList?.map(e=>(
          <div className='card d-flex justify-content-between flex-row p-3'>
             <h5 className='text-capitalize'>{e.username}</h5>
             <Link to={`/admin/reviews/${e._id}`}><h5>Add Review</h5></Link>
          </div>
        ))}
      </CCol> 
      <CCol sm={12} lg={6}>
        <h2 className='my-3' style={{color:"#0b9600"}}>Top Performing Employees</h2>
        {bestPerforming?.sort((a,b)=>b.data-a.data).map(e=>(
          <div className='card d-flex justify-content-between flex-row p-3'>
             <h5 className='text-capitalize'>{e.employeeName}</h5>
             <h5>{e.data}</h5>
          </div>
        ))}
      </CCol> 
      <CCol sm={12} lg={6}>
        <h2 className='my-3' style={{color:"#f12121"}}>Worst Performing Employees</h2>
        {bestPerforming?.sort((a,b)=>a.data-b.data).map(e=>(
          <div className='card d-flex justify-content-between flex-row p-3'>
             <h5 className='text-capitalize'>{e.employeeName}</h5>
             <h5>{e.data}</h5>
          </div>
        ))}
      </CCol> 
    </CRow>
  )
}

export default WidgetsDropdown
