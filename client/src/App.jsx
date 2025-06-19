import React from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes} from 'react-router-dom'
import Home from './pages/Home.jsx';
import Doctors from './pages/Doctors.jsx';
import MyAppointment from './pages/MyAppointment.jsx';
import MyProfille from './pages/MyProfile.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import Footer from './components/Footer.jsx';
import Appointment from './pages/Appointment.jsx';

const App = () => {

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/my-profile" element={<MyProfille />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment/:docId" element={<Appointment/>} />
        <Route path="/appointment" element={<MyAppointment/>} />
      </Routes>
      <Footer/>    
    </div>
    
  )
}

export default App