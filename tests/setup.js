const mongoose = require("mongoose");
const { connectToMongoDB, disconnectFromMongoDB, cleanupDB } = require("./db");

// Global test setup
process.env.NODE_ENV = "test";

beforeAll(async () => {
  await connectToMongoDB();
});

afterAll(async () => {
  try {
    await cleanupDB();

    // Close mongoose connections
    if (mongoose.connection.readyState === 1) {
      await disconnectFromMongoDB();
    }

    // Clear all timers
    jest.clearAllTimers();
  } catch (error) {
    console.error("Cleanup error:", error);
  }
});

// Clean up between tests (uncomment if using inMemoryDb)
// afterEach(async () => {
//   if (mongoose.connection.readyState === 1) {
//     await cleanupDB();
//   }
// });
