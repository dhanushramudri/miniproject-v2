import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();


const AdminContextProvider = (props) => {
  // State for hospital admin registrations, initialized as an empty array
  const [registrations, setRegistrations] = useState([]);
  // Base URL for the backend API
  const backendUrl = "http://localhost:4000";

  // State for authentication token (aToken), fetched from localStorage if it exists
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  // State for appointments, initialized as an empty array
  const [appointments, setAppointments] = useState([]);
  // State for doctors data, initialized as an empty array
  const [doctors, setDoctors] = useState([]);
  // State for dashboard data, initialized as false (or can be set to a default value)
  const [dashData, setDashData] = useState(false);
  const [doctorsByAdmin,setDoctorsByAdmin] = useState([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState()

  // Function to get all hospital admin registrations from the backend API

  const getAllRegistrations = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/all-hospital-registrations`,
        { headers: { aToken } }
      );

      console.log("API Response:", data);

      if (data.success) {
        setRegistrations(data.allRegistrations || []); // Set the registrations if successful
        console.log("Setting registrations:", data.allRegistrations);
      } else {
        toast.error(data.message); // Display error if unsuccessful
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message); // Display error message in case of failure
    }
  };

  // Function to approve an admin
  // Approve hospital admin
  const approveAdmin = async (adminId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/approve-admin`,
        { adminId },
        { headers: { aToken } }
      );

      if (data.success) {
        // Update the local state with the updated admin data
        setRegistrations((prevRegistrations) =>
          prevRegistrations.map((registration) =>
            registration._id === adminId
              ? { ...registration, isApproved: true, approvedAt: new Date() }
              : registration
          )
        );

        // Fetch fresh data from the server to ensure everything is in sync
        await getAllRegistrations();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Approval error:", error);
    }
  };

  const rejectAdmin = async (adminId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/reject-admin`,
        { adminId },
        { headers: { aToken } }
      );

      if (data.success) {
        // Update the local state after rejecting an admin
        setRegistrations((prevRegistrations) =>
          prevRegistrations.filter(
            (registration) => registration._id !== adminId
          )
        );

        // Optionally, fetch fresh data to ensure synchronization
        await getAllRegistrations();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Rejection error:", error);
    }
  };

  // Function to get all doctors' data from the backend API
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors); // Store doctors' data in state
      } else {
        toast.error(data.message); // If not successful, display error message
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const fetchAdminDetails = async () => {
    try {
      const token = localStorage.getItem("aToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch("http://localhost:4000/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Check if the admin is approved
        if (!data.admin.isApproved) {
          throw new Error("Admin is not approved yet");
        }
  
        return data.admin; // Return admin details here
      } else {
        throw new Error(data.message || "Failed to fetch admin details");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getAllDoctorsByAdmin = async () => {
    try {
      // Get admin details first
      const adminDetails = await fetchAdminDetails();
      if (!adminDetails) {
        throw new Error("Failed to fetch admin details");
      }
      console.log("adminDetails", adminDetails);
  
      const { data } = await axios.post(
        `${backendUrl}/api/admin/getdoctors-by-admin`,
        {
          adminId: adminDetails.id, // Send adminId in request body
        },
        {
          headers: { aToken },
        }
      );
  
      if (data.success) {
        setDoctorsByAdmin(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching doctors:", error);
    }
  };
  


  // Function to change doctor's availability (enable/disable)
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message); // If successful, show success message
        getAllDoctors(); // Fetch updated list of doctors
      } else {
        toast.error(data.message); // If not successful, show error message
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to get all appointments from the backend API
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse()); // Store appointments in state (reversed)
      } else {
        toast.error(data.message); // If not successful, display error message
      }
    } catch (error) {
      toast.error(error.message); // Show error message in case of failure
      console.log(error);
    }
  };

  // Function to cancel an appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message); // If successful, show success message
        getAllAppointments(); // Fetch updated appointments
      } else {
        toast.error(data.message); // If not successful, show error message
      }
    } catch (error) {
      toast.error(error.message); // Show error message in case of failure
      console.log(error);
    }
  };

  // Function to get the dashboard data for the admin from the backend API
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        setDashData(data.dashData); // Store dashboard data in state
      } else {
        toast.error(data.message); // If not successful, display error message
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message); // Show error message in case of failure
    }
  };

  // The value that will be provided to all components using this context
  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    getDashData,
    cancelAppointment,
    getAllRegistrations,
    getAllDoctorsByAdmin,
    registrations,
    dashData,
    approveAdmin,
    doctorsByAdmin,
    rejectAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children} {/* Render child components */}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
