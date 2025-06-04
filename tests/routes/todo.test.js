const request = require("supertest");
const app = require("../../app");
const { connectToMongoDB, disconnectFromMongoDB, cleanupDB } = require("../db");
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Todo = require("../../models/todoModel");

let agent;
let user;

beforeAll(async () => {
  // Register and login a test user
  user = new User({ username: "testuser" });
  await User.register(user, "testpass");

  agent = request.agent(app);
  const loginRes = await agent
    .post("/login")
    .type("form")
    .send({ username: "testuser", password: "testpass" });

  expect(loginRes.statusCode).toBe(302);
  expect(loginRes.headers.location).toBe("/todos");
});

describe("Todo Routes", () => {
  let todoId;

  test("POST /todos - creates a new todo", async () => {
    const res = await agent.post("/todos").send({
      title: "Test Todo",
      body: "This is the body of the test todo.",
    });
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/todos");

    const createdTodo = await Todo.findOne({
      title: "Test Todo",
      user: user._id,
    });
    expect(createdTodo).toBeDefined();
    expect(createdTodo.title).toBe("Test Todo");
    expect(createdTodo.body).toBe("This is the body of the test todo.");
    expect(createdTodo.user.toString()).toBe(user._id.toString());
    todoId = createdTodo._id;
  });

  test("GET /todos - fetches user todos", async () => {
    const res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Test Todo");
    expect(res.text).toContain("<h1>Welcome back, testuser</h1>");
  });

  test("PATCH /todos/:id - update todo status", async () => {
    const res = await agent
      .patch(`/todos/${todoId}`)
      .send({ status: "completed" });

    expect(res.statusCode).toBe(302);
    const updatedTodo = await Todo.findById(todoId);
    expect(updatedTodo.status).toBe("completed");
  });

  test("PATCH /todos/:id - fail update if not user’s todo", async () => {
    const newUser = new User({ username: "hacker" });
    await User.register(newUser, "hackpass");

    const otherAgent = request.agent(app);

    const hackerLoginRes = await otherAgent
      .post("/login")
      .type("form")
      .send({ username: "hacker", password: "hackpass" });

    expect(hackerLoginRes.statusCode).toBe(302);
    expect(hackerLoginRes.headers.location).toBe("/todos");

    // Attempt to update the 'testuser's todo using the 'hacker's agent
    const res = await otherAgent
      .patch(`/todos/${todoId}`) // todoId belongs to 'testuser'
      .send({ status: "deleted" });

    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/todos");
  });
});
