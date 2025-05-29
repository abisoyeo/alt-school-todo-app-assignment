const Todo = require("../models/todoModel");

exports.getAllTodos = async (req, res, next) => {
  try {
    const { todoStatus } = req.query;

    const filter = { user: req.user._id };

    // Always exclude deleted tasks
    filter.status = { $ne: "deleted" };

    // Apply additional filtering if status is provided
    if (todoStatus === "completed") filter.status = "completed";
    else if (todoStatus === "pending") filter.status = "pending";

    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    res.render("todos", {
      todos,
      username: req.user.username,
      statusFilter: filter.status,
      error: null,
    });
  } catch (error) {
    res.render("todos", {
      todos: [],
      username: req.user.username,
      statusFilter: null,
      error: "Error fetching todos",
    });
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({ ...req.body, user: req.user._id });
    // res.status(201).json(todo);
    res.redirect("/todos");
  } catch (error) {
    res.render("todos", {
      todos: [],
      username: req.user.username,
      statusFilter: null,
      error: "Error creating todos",
    });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status },
      { new: true }
    );
    if (!todo)
      return res.status(404).json({ msg: "Todo not found or not yours" });
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.render("todos", {
      todos: [],
      username: req.user.username,
      statusFilter: null,
      error: "Error updating todos",
    });
  }
};
