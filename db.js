const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

// connect to mongodb
async function connectToMongoDB() {
  await mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
}
//   // Close connection on app termination
//   process.on("SIGINT", async () => {
//     await mongoose.connection.close();
//     console.log("MongoDB connection closed due to app termination");
//     process.exit(0);
//   });

module.exports = { connectToMongoDB };
