const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: [true, "Please enter a body"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("Todo", TodoSchema);

module.exports = TodoModel;
