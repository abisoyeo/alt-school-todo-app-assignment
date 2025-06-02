require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const connectEnsureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const path = require("path");
const app = express();

// Import user model and DB connector
const userModel = require("./models/userModel");
const db = require("./db");

// Import routes
const authRoutes = require("./routes/authRoute");
const todoRoutes = require("./routes/todoRoute");

const PORT = process.env.PORT || 3010;

// Connect to MongoDB
db.connectToMongoDB();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Trust the first proxy
app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Flash middleware for displaying messages
app.use(flash());

// Middleware to log session and user information for debugging
// app.use((req, res, next) => {
//   console.log("SESSION:", req.session);
//   console.log("USER:", req.user);
//   next();
// });

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Routes
// Redirect root ("/") to "/signup"
app.get("/", (req, res) => {
  res.redirect("/signup");
});
app.use("/", authRoutes); // Login, Signup, Logout routes
app.use("/todos", connectEnsureLogin.ensureLoggedIn(), todoRoutes); // Protected todo routes

// Middleware to set flash messages in res.locals for EJS templates
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
