const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const validate = require("../middlewares/validate");
const {
  createTodoSchema,
  updateTodoSchema,
} = require("../validators/todoValidator");

router.get("/", todoController.getTodo);
router.post("/", validate(createTodoSchema), todoController.createTodo);
router.patch("/:id", validate(updateTodoSchema), todoController.updateTodo);

module.exports = router;
