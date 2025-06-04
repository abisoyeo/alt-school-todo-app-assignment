require("dotenv").config();
const app = require("./app");
const db = require("./db");

const PORT = process.env.PORT || 3010;

// Connect to MongoDB and start the server
db.connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to MongoDB and start server:",
      err.message
    );
    process.exit(1);
  });
