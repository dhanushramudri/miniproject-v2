import React, { useState, useEffect, useContext } from "react";
import {
  AlertCircle,
  Hospital,
  Phone,
  Mail,
  IdCard,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { AdminContext } from "../context/AdminContext";

const AdminDetails = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { registrations, getAllRegistrations } = useContext(AdminContext);

  useEffect(() => {
    getAllRegistrations();
  }, []);

  console.log(registrations);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg flex items-center gap-2 text-yellow-700">
        <AlertCircle className="h-5 w-5" />
        <span>No admin data found</span>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-6 text-white">
          <div className="flex items-center gap-4">
            <Hospital className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold">{adminData.hospitalName}</h1>
              <p className="text-blue-100">Hospital Administration Portal</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Admin Status */}
          <div className="mb-6 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Approved by {adminData.approvedBy} on{" "}
              {formatDate(adminData.approvedAt)}
            </span>
          </div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Personal Information
              </h2>

              <div className="flex items-center gap-3">
                <IdCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Admin Name</p>
                  <p className="font-medium text-gray-800">
                    {adminData.adminName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{adminData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">{adminData.phone}</p>
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Hospital Information
              </h2>

              <div className="flex items-center gap-3">
                <IdCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-800">
                    {adminData.registrationNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-800">
                    {adminData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Registered On</p>
                  <p className="font-medium text-gray-800">
                    {formatDate(adminData.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {adminData.description && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Description
              </h2>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {adminData.description}
              </p>
            </div>
          )}

          {/* Doctors Count */}
          {adminData.doctors && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Registered Doctors
              </h2>
              <p className="text-gray-600">
                Total doctors registered:{" "}
                <span className="font-medium">
                  {adminData.doctors?.length || 0}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
