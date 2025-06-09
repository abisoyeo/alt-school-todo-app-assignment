const mongoose = require("mongoose");
const { connectToMongoDB, disconnectFromMongoDB, cleanupDB } = require("./db");

// Global Test setup
process.env.NODE_ENV = "test";

beforeAll(async () => {
  await connectToMongoDB();
});

afterAll(async () => {
  try {
    await cleanupDB();

    if (mongoose.connection.readyState === 1) {
      await disconnectFromMongoDB();
    }

    jest.clearAllTimers();
  } catch (error) {
    console.error("Cleanup error:", error);
  }
});
