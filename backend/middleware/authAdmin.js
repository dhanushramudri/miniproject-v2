import jwt from "jsonwebtoken";
import hospitalAdminModel from "../models/hospitalAdminModel.js";

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Decode the JWT token
    const decodedToken = jwt.verify(atoken, process.env.JWT_SECRET);

    // Check if the decoded token contains email
    const adminEmail = decodedToken.email;

    // Fetch the admin from the database using the email
    const admin = await hospitalAdminModel.findOne({
      email: adminEmail,
      isApproved: true,
    });

    if (!admin) {
      return res.json({
        success: false,
        message: "Admin not found or not approved",
      });
    }

    // Attach the admin data to the request for further use (optional)
    req.admin = admin;

    // If token is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
