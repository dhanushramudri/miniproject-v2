import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import hospitalAdminModel from "../models/hospitalAdminModel.js";
// API for admin login
// const loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(email + password, process.env.JWT_SECRET);
//       console.log("jwt secret is ", process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch the hospital admin by email
    const admin = await hospitalAdminModel.findOne({ email, isApproved: true });

    // Check if admin exists and is approved
    if (!admin) {
      return res.json({
        success: false,
        message: "Admin not found or not approved",
      });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log("passwordMatch", passwordMatch);

    if (!passwordMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    // Generate JWT token with the admin's email as the payload
    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for adding Doctor
const addDoctor = async (req, res) => {
  console.log(req.body);  // Check if form data is properly sent
  console.log(req.file);  // Check if image file is sent
  
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      adminId,  // Ensure you're using 'adminId'
      hospitalName
    } = req.body;
    const imageFile = req.file;
    console.log(adminId,hospitalName)

    // Debugging for missing fields
    let missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!speciality) missingFields.push("speciality");
    if (!degree) missingFields.push("degree");
    if (!experience) missingFields.push("experience");
    if (!about) missingFields.push("about");
    if (!fees) missingFields.push("fees");
    if (!address) missingFields.push("address");
    if (!adminId) missingFields.push("adminId");
    if (!hospitalName) missingFields.push("hospitalName");
    if (!imageFile) missingFields.push("image");

    if (missingFields.length > 0) {
      return res.json({ 
        success: false, 
        message: `Missing the following details: ${missingFields.join(', ')}` 
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Prepare doctor data
    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
       adminId, 
      hospitalName,
      fees,
      address: JSON.parse(address), 
      date: Date.now(), 
    };

    // Save the doctor
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctorsByAdmin = async (req, res) => {
  try {
    // Get adminId from request body
    const { adminId } = req.body;

    // Find all doctors where adminId matches
    const doctors = await doctorModel.find({ adminId: adminId })
      .select("-password")
      .populate('adminId', 'hospitalName email'); // Optionally populate admin details

    res.json({ 
      success: true, 
      doctors 
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// hospital

// Register hospital admin request
// export const registerHospitalAdmin = async (req, res) => {
//   try {
//     const {
//       hospitalName,
//       adminName,
//       email,
//       phone,
//       registrationNumber,
//       address,
//       password,
//       description,
//     } = req.body;

//     // Validate required fields
//     if (
//       !hospitalName ||
//       !adminName ||
//       !email ||
//       !phone ||
//       !registrationNumber ||
//       !address ||
//       !password
//     ) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     // Validate email format
//     if (!validator.isEmail(email)) {
//       return res.json({ success: false, message: "Invalid email format" });
//     }

//     // Check if email already exists
//     const existingAdmin = await hospitalAdminModel.findOne({ email });
//     if (existingAdmin) {
//       return res.json({ success: false, message: "Email already registered" });
//     }

//     // Check if registration number already exists
//     const existingRegNumber = await hospitalAdminModel.findOne({
//       registrationNumber,
//     });
//     if (existingRegNumber) {
//       return res.json({
//         success: false,
//         message: "Registration number already exists",
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new hospital admin
//     const newHospitalAdmin = new hospitalAdminModel({
//       hospitalName,
//       adminName,
//       email,
//       phone,
//       registrationNumber,
//       address,
//       password: hashedPassword,
//       description,
//     });

//     await newHospitalAdmin.save();
//     res.json({
//       success: true,
//       message: "Registration request submitted successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// };

const registerHospitalAdmin = async (req, res) => {
  try {
    const {
      hospitalName,
      adminName,
      email,
      phone,
      registrationNumber,
      address,
      password,
      description,
    } = req.body;

    // Validate required fields
    if (
      !hospitalName ||
      !adminName ||
      !email ||
      !phone ||
      !registrationNumber ||
      !address ||
      !password
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Check if email already exists
    const existingAdmin = await hospitalAdminModel.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Check if registration number already exists
    const existingRegNumber = await hospitalAdminModel.findOne({
      registrationNumber,
    });
    if (existingRegNumber) {
      return res.json({
        success: false,
        message: "Registration number already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new hospital admin
    const newHospitalAdmin = new hospitalAdminModel({
      hospitalName,
      adminName,
      email,
      phone,
      registrationNumber,
      address,
      password: hashedPassword,
      description,
    });

    await newHospitalAdmin.save();
    res.json({
      success: true,
      message: "Registration request submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// hospitalAdminController.js
const approveAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Update the admin document in the database
    const updatedAdmin = await hospitalAdminModel.findByIdAndUpdate(
      adminId,
      {
        isApproved: true,
        approvedBy: process.env.ADMIN_EMAIL,
        approvedAt: new Date(),
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedAdmin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Hospital admin approved successfully",
      updatedAdmin, // Send back the updated admin data
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const rejectAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;
    const admin = await hospitalAdminModel.findById(adminId);

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    await hospitalAdminModel.findByIdAndDelete(adminId);

    res.json({
      success: true,
      message: "Hospital admin rejected successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getAllHospitalRegistrations = async (req, res) => {
  try {
    const allRegistrations = await hospitalAdminModel.find({});
    res.json({ success: true, allRegistrations });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await hospitalAdminModel.find({ isApproved: false });
    res.json({ success: true, pendingAdmins });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getCurrentAdminDetails = async (req, res) => {
  try {
    // Get the token from the authorization header
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    // Decode the JWT token to get the admin's email and ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, id } = decoded;

    // Find the admin in the database using the ID
    const admin = await hospitalAdminModel.findById(id);
    // console.log(admin)

    // Check if admin exists
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    // Return the admin details (excluding the password)
    const adminDetails = {
      id:admin.id,
      hospitalName: admin.hospitalName,
      adminName: admin.adminName,
      email: admin.email,
      phone: admin.phone,
      registrationNumber: admin.registrationNumber,
      address: admin.address,
      description: admin.description,
      isApproved: admin.isApproved,
      approvedBy: admin.approvedBy,
      approvedAt: admin.approvedAt,
    };

    res.json({ success: true, admin: adminDetails });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getAvailability = () => {
  res.json({ success: true, message: "Availability" });
};

export {
  loginAdmin,
  appointmentsAdmin,
  getAvailability,
  getCurrentAdminDetails,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  registerHospitalAdmin,
  getAllHospitalRegistrations,
  approveAdmin,
  allDoctorsByAdmin,
  rejectAdmin,
  getPendingAdmins,
};
