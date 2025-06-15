import { ToastContainer,toast } from 'react-toastify'
import Login from './pages/Admin/Login'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AppContext'
import { useContext } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorList from './pages/Admin/DoctorList'
import { Routes, Route} from 'react-router-dom'

function App() {
  const { aToken } = useContext(AdminContext)

  return aToken? (

    <div className='bg-[#F8F9FD]'>
     
      <ToastContainer />
      <Navbar />
      <div>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorList/>} />
        </Routes>
      </div>
    </div>
  ):(
    <>
    <Login />
    </>
  )
}

export default App
