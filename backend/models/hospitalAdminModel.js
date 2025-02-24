import mongoose from "mongoose";

const hospitalAdminSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String }, // Super admin email who approved
  approvedAt: { type: Date },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "doctor" }], // Reference to doctors added by this admin
  createdAt: { type: Date, default: Date.now },
});

const hospitalAdminModel = mongoose.model("hospitalAdmin", hospitalAdminSchema);
export default hospitalAdminModel;
