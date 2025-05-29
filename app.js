const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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

// Trust the first proxy
app.set("trust proxy", 1);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // session expires in 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Middleware to log session and user information for debugging
app.use((req, res, next) => {
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);
  next();
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Redirect root ("/") to "/signup"
app.get("/", (req, res) => {
  res.redirect("/signup");
});

// Routes
app.use("/", authRoutes); // Login, Signup, Logout routes
app.use("/todos", connectEnsureLogin.ensureLoggedIn(), todoRoutes); // Protected todo routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: err.message || "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
