const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const path = require("path");
require("dotenv").config();
const app = express();

// Import your user model and DB connector
const userModel = require("./models/userModel");
const db = require("./db");

// Use Static File
app.use(express.static("public"));

// Import routes
const authRoutes = require("./routes/authRoute");
const todoRoutes = require("./routes/todoRoute");

const PORT = process.env.PORT || 3010;

// Connect to MongoDB
db.connectToMongoDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Routes
app.use("/", authRoutes); // Login, Signup, Logout routes
app.use("/todos", connectEnsureLogin.ensureLoggedIn(), todoRoutes); // Protected
// app.use("/todos", todoRoutes); // Protected

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: err.message || "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
