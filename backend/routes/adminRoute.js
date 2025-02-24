import express from "express";
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  registerHospitalAdmin,
  getAvailability,
  getAllHospitalRegistrations,
  approveAdmin,
  rejectAdmin,
  getCurrentAdminDetails,
  allDoctorsByAdmin,
  
} from "../controllers/adminController.js";
import { changeAvailablity } from "../controllers/doctorController.js";
import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/register-hospital-admin", registerHospitalAdmin);
adminRouter.get(
  "/all-hospital-registrations",
  authAdmin,
  getAllHospitalRegistrations
);
adminRouter.post("/approve-admin", authAdmin, approveAdmin);
adminRouter.post("/reject-admin", authAdmin, rejectAdmin);
adminRouter.get("/profile", getCurrentAdminDetails);

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post('/getdoctors-by-admin',authAdmin,allDoctorsByAdmin);

adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.get("/get-availability", authAdmin, getAvailability);

export default adminRouter;
