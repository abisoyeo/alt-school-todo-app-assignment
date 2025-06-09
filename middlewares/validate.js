module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (!error) return next();

    const errorMsg = error.details[0].message;

    req.flash("error", errorMsg);

    // Redirect based on path
    if (req.originalUrl.startsWith("/todos")) return res.redirect("/todos");
    if (req.originalUrl.startsWith("/signup")) return res.redirect("/signup");
    if (req.originalUrl.startsWith("/login")) return res.redirect("/login");

    return res.redirect("back");
  };
};
