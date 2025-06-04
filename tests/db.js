require("dotenv").config();
const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;

// Connect to mongodb
async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    // let uri;
    // Use in-memory MongoDB for tests
    // mongoServer = await MongoMemoryServer.create();
    // uri = mongoServer.getUri();

    await mongoose.connect(TEST_MONGODB_URI);

    // Drop the database to ensure it's completely clean for the test suite
    await mongoose.connection.db.dropDatabase();

    console.log("Connected to test database:", TEST_MONGODB_URI);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  try {
    // Close mongoose connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }

    // Stop memory server if it exists
    // if (mongoServer) {
    //   await mongoServer.stop();
    //   console.log("Stopped MongoDB Memory Server");
    //   mongoServer = null;
    // }
  } catch (err) {
    console.error("MongoDB disconnection error:", err);
    throw err;
  }
}

async function cleanupDB() {
  // Clear all collections between tests
  // const collections = mongoose.connection.collections;
  // for (const key in collections) {
  //   const collection = collections[key];
  //   await collection.deleteMany({});
  // }
  // Clear todos collection
  await mongoose.connection.collection("todos").deleteMany({});
}
module.exports = { connectToMongoDB, disconnectFromMongoDB, cleanupDB };
