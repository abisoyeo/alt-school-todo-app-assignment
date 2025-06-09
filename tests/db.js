require("dotenv").config();
const mongoose = require("mongoose");

const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(TEST_MONGODB_URI);

    await mongoose.connection.db.dropDatabase();

    console.log("Connected to test database:", TEST_MONGODB_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  } catch (err) {
    console.error("MongoDB disconnection error:", err);
    throw err;
  }
}

async function cleanupDB() {
  await mongoose.connection.collection("todos").deleteMany({});
}

module.exports = { connectToMongoDB, disconnectFromMongoDB, cleanupDB };
