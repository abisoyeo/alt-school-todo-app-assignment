require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const connectEnsureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const path = require("path");
const userModel = require("./models/user");

const app = express();

// Import routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

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
if (process.env.NODE_ENV === "test") {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
      },
    })
  );
} else {
  // MongoStore for production/development
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
}

// Flash middleware for displaying messages
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Routes
app.get("/", (req, res) => {
  res.redirect("/signup");
});
app.use("/", authRoutes);
app.use("/todos", connectEnsureLogin.ensureLoggedIn(), todoRoutes); // Protected todo routes

// Middleware to set flash messages
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});

module.exports = app;
