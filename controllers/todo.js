const Todo = require("../models/todo");

exports.getTodo = async (req, res, next) => {
  try {
    const { todoStatus } = req.query;

    const filter = { user: req.user._id };

    // Exclude deleted tasks
    filter.status = { $ne: "deleted" };

    // Additional filtering if status is provided
    if (todoStatus === "completed") filter.status = "completed";
    else if (todoStatus === "pending") filter.status = "pending";

    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    res.render("todos", {
      todos,
      username: req.user.username,
      statusFilter: filter.status,
      error: req.flash("error") || [],
    });
  } catch (error) {
    req.flash("error", "Failed to get todos.");
    res.redirect("/todos");
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.user._id });

    res.redirect("/todos");
  } catch (error) {
    req.flash("error", "Failed to create todo. Please try again.");
    res.redirect("/todos");
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!todo) {
      req.flash("error", "Todo not found or you don't have permission.");
      return res.redirect("/todos");
    }
    res.status(200).end();
  } catch (error) {
    req.flash("error", "Something went wrong while updating.");
    res.redirect("/todos");
  }
};
