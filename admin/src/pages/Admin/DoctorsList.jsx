import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  DollarSign,
  BookOpen,
  Award,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const DoctorsList = () => {
  const { doctors,doctorsByAdmin, changeAvailability, aToken ,getAllDoctorsByAdmin} =

    useContext(AdminContext);
    const [adminData , setAdminData] = useState();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState();

  const availableTimeSlots = ["07:00 pm", "07:30 pm", "08:00 pm", "08:30 pm"];


  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("aToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          "http://localhost:4000/api/admin/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          // Check if the admin is approved
          if (!data.admin.isApproved) {
            throw new Error("Admin is not approved yet");
          }

          setAdminData(data.admin);
        } else {
          throw new Error(data.message || "Failed to fetch admin details");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  useEffect(() => {
    if (aToken) {
      // getAllDoctors();
      getAllDoctorsByAdmin();
    }
  }, [aToken,changeAvailability]);

 
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to get today's date in the format used in slots_booked
  const getTodayDateKey = () => {
    const today = new Date();
    return `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
  };

  // Function to check if a slot is booked
  const isSlotBooked = (doctor, time) => {
    const todayKey = getTodayDateKey();
    if (!doctor.slots_booked || !doctor.slots_booked[todayKey]) {
      return false;
    }
    return doctor.slots_booked[todayKey].some(
      (bookedTime) => bookedTime.toLowerCase() === time.toLowerCase()
    );
  };

  const TimeSlot = ({ time, isBooked }) => (
    <div
      className={`
        flex items-center gap-2 p-2 rounded-lg transition-all duration-300 transform hover:scale-105
        ${
          isBooked
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-green-50 text-green-600 border border-green-200"
        }
      `}
    >
      <div className="flex items-center gap-2">
        {isBooked ? (
          <XCircle className="w-4 h-4 animate-pulse" />
        ) : (
          <CheckCircle className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">{time}</span>
      </div>
    </div>
  );

  if (!doctorsByAdmin?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-gray-500">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">No doctors found in your hospital</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hospital Doctors</h1>
        <p className="text-gray-600">Total Doctors: {doctorsByAdmin.length}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctorsByAdmin.map((doctor, index) => (
          <div
            key={doctor._id || index}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Previous sections remain the same until slots section */}
            {/* Doctor Image Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
              {doctor.image ? (
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="w-24 h-24 text-gray-400" />
              )}
              <div className="absolute top-4 right-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doctor.available}
                    onChange={() => changeAvailability(doctor._id)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className={doctor.available? 'text-green-900 ms-3 text-sm font-medium ':'text-red-800 ms-3 text-sm font-medium'}>
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </label>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {doctor.name}
                </h3>
                <p className="text-primary font-medium">{doctor.speciality}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{doctor.email}</span>
                </div>

                {doctor.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                )}

                {doctor.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-1" />
                    <span className="text-sm">
                      {doctor.address.line1}, {doctor.address.line2}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">
                    Consultation Fee: ₹{doctor.fees}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">
                    Experience: {doctor.experience}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Degree: {doctor.degree}</span>
                </div>
              </div>

              {/* About Section */}
              {doctor.about && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    About
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {doctor.about}
                  </p>
                </div>
              )}

              {/* Enhanced Slots Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Today's Slots
                  </h4>
                  <span className="text-xs text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((time, idx) => (
                    <TimeSlot
                      key={idx}
                      time={time}
                      isBooked={isSlotBooked(doctor, time)}
                    />
                  ))}
                </div>
              </div>

              {/* Show Upcoming Bookings if any */}
              {doctor.slots_booked &&
                Object.keys(doctor.slots_booked).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Upcoming Bookings
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(doctor.slots_booked).map(
                        ([date, slots]) => (
                          <div
                            key={date}
                            className="text-sm p-2 bg-gray-50 rounded-lg"
                          >
                            <span className="font-medium text-gray-700">
                              {date.split("_").join("/")}:
                            </span>
                            <span className="text-gray-600 ml-2">
                              {Array.isArray(slots) ? slots.join(", ") : slots}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
