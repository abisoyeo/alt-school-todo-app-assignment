const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Todo = require("../models/todoModel");

let agent;
let user;
let cookie;

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1/todo_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register and login a test user
  user = new User({ username: "testuser" });
  await User.register(user, "testpass");

  agent = request.agent(app);
  await agent
    .post("/login")
    .type("form")
    .send({ username: "testuser", password: "testpass" })
    .then((res) => {
      cookie = res.headers["set-cookie"];
    });
});

afterAll(async () => {
  await User.deleteMany();
  await Todo.deleteMany();
  await mongoose.connection.close();
});

describe("Todo Routes", () => {
  let todoId;

  test("POST /todos - creates a new todo", async () => {
    const res = await agent
      .post("/todos")
      .set("Cookie", cookie)
      .send({ title: "Test Todo" });
    expect(res.statusCode).toBe(302); // redirected to /todos
  });

  test("GET /todos - fetches user todos", async () => {
    const res = await agent.get("/todos").set("Cookie", cookie);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Test Todo");
    const todos = await Todo.find();
    todoId = todos[0]._id;
  });

  test("PATCH /todos/:id - update todo status", async () => {
    const res = await agent
      .patch(`/todos/${todoId}`)
      .set("Cookie", cookie)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Updated successfully");
  });

  test("PATCH /todos/:id - fail update if not user’s todo", async () => {
    const newUser = new User({ username: "hacker" });
    await User.register(newUser, "hackpass");
    const otherAgent = request.agent(app);
    await otherAgent
      .post("/login")
      .type("form")
      .send({ username: "hacker", password: "hackpass" });

    const res = await otherAgent
      .patch(`/todos/${todoId}`)
      .send({ status: "deleted" });
    expect(res.statusCode).toBe(404);
  });
});
