import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connecting to MongoDB... Please wait.");

  try {
    // Attempt to connect to the MongoDB Atlas cluster
    await mongoose.connect(
      "mongodb+srv://dhanush_doctor:RESyXFPpjl2WzAPY@cluster0.06bmzbf.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
    );

    // Once connected, log the success
    console.log("MongoDB connected successfully!");
  } catch (error) {
    // If an error occurs, log the error
    console.error("Error connecting to MongoDB:", error);
  }
};

// Check the connection status directly through the connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

export default connectDB;
