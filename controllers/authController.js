const passport = require("passport");
const userModel = require("../models/userModel");

exports.getLogin = (req, res) => {
  res.render("login", { error: req.flash("error") || [] });
};
exports.getSignup = (req, res) => {
  res.render("signup", { error: req.flash("error") || [] });
};

exports.signupUser = (req, res) => {
  const user = req.body;
  userModel.register(
    new userModel({ username: user.username }),
    user.password,
    (err, user) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/signup");
      }
      passport.authenticate("local")(req, res, () => res.redirect("/todos"));
    }
  );
};

exports.loginUser = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
  successRedirect: "/todos",
});

exports.logoutUser = (req, res) => req.logout(() => res.redirect("/login"));
