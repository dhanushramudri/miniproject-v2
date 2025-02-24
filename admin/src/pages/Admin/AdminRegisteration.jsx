import React, { useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const AdminRegistration = () => {
  const { registrations, getAllRegistrations, approveAdmin, rejectAdmin } =
    useContext(AdminContext);

  useEffect(() => {
    getAllRegistrations();
  }, [getAllRegistrations]); // Add getAllRegistrations to dependency array

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8 max-w-7xl my-10 mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Hospital Registrations
      </h2>
      {registrations.length === 0 ? (
        <p className="text-xl text-gray-600">
          No hospital registrations found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {registrations.map((registration) => (
            <div
              key={registration._id}
              className="bg-gray-50 border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {registration.hospitalName}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Admin:</strong> {registration.adminName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {registration.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {registration.phone}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    registration.isApproved
                      ? "text-green-500"
                      : "text-yellow-500"
                  } font-semibold`}
                >
                  {registration.isApproved ? "Approved" : "Pending"}
                </span>
              </p>
              {registration.isApproved && registration.approvedAt && (
                <p className="text-sm text-gray-600">
                  <strong>Approved on:</strong>{" "}
                  {formatDate(registration.approvedAt)}
                </p>
              )}
              <p className="text-sm text-gray-600">
                <strong>Registration Number:</strong>{" "}
                {registration.registrationNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {registration.address}
              </p>
              {registration.description && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Description:</strong> {registration.description}
                </p>
              )}

              <div className="mt-4">
                {!registration.isApproved ? (
                  <button
                    onClick={() => approveAdmin(registration._id)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                  >
                    Approve Admin
                  </button>
                ) : (
                  <button
                    onClick={() => rejectAdmin(registration._id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                  >
                    Remove Admin Access
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRegistration;
