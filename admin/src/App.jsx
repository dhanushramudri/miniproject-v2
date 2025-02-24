import React, { useContext } from "react";
import { DoctorContext } from "./context/DoctorContext";
import { AdminContext } from "./context/AdminContext";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import UserNavbar from "./components/UserNavbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import AdminRegisteration from "./pages/Admin/AdminRegisteration";
import AdminDetails from "./components/AdminDetails";
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Verify from './pages/Verify'

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className="bg-[#F8F9FD] flex justify-center items-center flex-col ">
      <ToastContainer />
      { aToken || dToken ? <Navbar /> :<UserNavbar />}
      
      <div className="flex items-start w-full ">
        <Sidebar />
        <Routes>
              <Route path="/" element={ aToken ? ( <AdminDetails /> ) : dToken ? ( <DoctorDashboard /> ) : ( <Home /> )  } />
              <Route path='/login'  element={<Login />} />
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllAppointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<DoctorsList />} />
              <Route path="/approve-admin" element={<AdminRegisteration />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor-appointments" element={<DoctorAppointments />} />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path='/' element={<Home />} />
              <Route path='/doctors' element={<Doctors />} />
              <Route path='/doctors/:speciality' element={<Doctors />} />
              <Route path='/ulogin' element={<UserLogin />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/appointment/:docId' element={<Appointment />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/verify' element={<Verify />} />
        </Routes>
      </div>
    </div>
  )
};

export default App;
