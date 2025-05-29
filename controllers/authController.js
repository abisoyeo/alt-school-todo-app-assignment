const passport = require("passport");
const userModel = require("../models/userModel");

exports.getLogin = (req, res) => res.render("login");
exports.getSignup = (req, res) => res.render("signup");

exports.signupUser = (req, res) => {
  const user = req.body;
  userModel.register(
    new userModel({ username: user.username }),
    user.password,
    (err, user) => {
      if (err) return res.status(400).send(err);
      passport.authenticate("local")(req, res, () => res.redirect("/todos"));
    }
  );
};

exports.loginUser = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/todos",
});

exports.logoutUser = (req, res) => req.logout(() => res.redirect("/login"));
