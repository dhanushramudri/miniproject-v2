import React, { useState, useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { AlertCircle, ArrowLeft, Hospital } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'


const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegistration, setShowRegistration] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");

  const { setDToken } = useContext(DoctorContext);
  const navigate = useNavigate()
  const { setAToken } = useContext(AdminContext);
  const backendUrl = "http://localhost:4000";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const endpoint =
        state === "Admin" ? "/api/admin/login" : "/api/doctor/login";

      const response = await fetch(backendUrl + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        if (state === "Admin") {
          setAToken(data.token);
          navigate('/')
          localStorage.setItem("aToken", data.token);
        } else {
          setDToken(data.token);
          navigate('/')

          localStorage.setItem("dToken", data.token);
        }
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  // ... rest of the component remains the same ...
  const handleRegistrationClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowRegistration(true);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 w-full ">
      <div
        className={`
        transform transition-all duration-300 ease-in-out
        ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        flex flex-col gap-6 p-8 bg-white rounded-xl shadow-xl w-full max-w-2xl
      `}
      >
        {showRegistration ? (
          <HospitalAdminRegistration
            setShowRegistration={setShowRegistration}
          />
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <Hospital className="w-12 h-12 text-primary" />
              <h2 className="text-3xl font-bold text-gray-800">
                <span className="text-primary">{state}</span> Login
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div
              className="relative cursor-pointer group"
              onClick={handleRegistrationClick}
            >
              <div className="text-center p-4 bg-blue-50 rounded-lg transition-all duration-200 group-hover:bg-blue-100">
                <p className="text-primary font-medium">
                  Register as an Admin to Manage Your Hospital
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Create an account to start managing your hospital efficiently
                </p>
              </div>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="border border-gray-300 rounded-lg w-full p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border border-gray-300 rounded-lg w-full p-3 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button className="bg-primary text-white w-full py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02]">
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              {state === "Admin" ? (
                <>
                  Doctor Login?{" "}
                  <span
                    onClick={() => setState("Doctor")}
                    className="text-primary underline cursor-pointer hover:text-blue-700"
                  >
                    Click here
                  </span>
                </>
              ) : (
                <>
                  Admin Login?{" "}
                  <span
                    onClick={() => setState("Admin")}
                    className="text-primary underline cursor-pointer hover:text-blue-700"
                  >
                    Click here
                  </span>
                </>
              )}
            </p>

            <p className="text-center text-sm text-gray-600">
                  User Login?{" "}

                  <Link to={'/ulogin'} className='text-primary underline cursor-pointer hover:text-blue-700'>
                      Click here
                  </Link>
             
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const HospitalAdminRegistration = ({ setShowRegistration }) => {
  const [formData, setFormData] = useState({
    hospitalName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    registrationNumber: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/admin/register-hospital-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(
          "Registration request submitted successfully. Please wait for super admin approval."
        );
        setShowRegistration(false);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setShowRegistration(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Hospital Admin Registration
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2 text-red-700 mb-6 animate-fade-in">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hospital Name *
            </label>
            <input
              type="text"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Admin Name *
            </label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hospital Registration Number *
          </label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hospital Address *
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us about your hospital..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50 transform hover:scale-[1.02]"
        >
          {loading ? "Submitting..." : "Submit Registration Request"}
        </button>
      </form>
    </div>
  );
};

export default Login;
