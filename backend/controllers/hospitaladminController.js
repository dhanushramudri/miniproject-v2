export const loginHospitalAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await hospitalAdminModel.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check if admin is approved
    if (!admin.isApproved) {
      return res.json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
