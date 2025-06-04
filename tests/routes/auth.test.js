const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/user");

let agent;
let testUser;

describe("Authentication Routes", () => {
  beforeAll(async () => {
    testUser = new User({ username: "authuser" });
    await User.register(testUser, "authpassword");

    agent = request.agent(app);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await User.deleteOne({ username: "authuser" });
    }
  });

  test("GET /login - fetches login page", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toBe(200);
  });

  test("GET /signup - fetches signup page", async () => {
    const response = await request(app).get("/signup");
    expect(response.statusCode).toBe(200);
  });

  test("GET /todos - redirects to login when not authenticated", async () => {
    const response = await request(app).get("/todos");
    expect(response.statusCode).toBe(302);
    expect(response.headers.location).toContain("/login");
  });

  describe("User Registration", () => {
    test("POST /signup - successfully registers a new user and redirects to /todos", async () => {
      const newUser = { username: "newuser", password: "newpassword" };
      const response = await request(app)
        .post("/signup")
        .type("form")
        .send(newUser);

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/todos");

      const createdUser = await User.findOne({ username: newUser.username });
      expect(createdUser).toBeDefined();
      expect(createdUser.username).toBe(newUser.username);

      await User.deleteOne({ username: newUser.username });
    });

    test("POST /signup - redirects to /signup on duplicate username", async () => {
      const response = await request(app)
        .post("/signup")
        .type("form")
        .send({ username: testUser.username, password: "somepassword" });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/signup");
    });

    test("POST /signup - redirects to /signup if password is missing", async () => {
      const response = await request(app)
        .post("/signup")
        .type("form")
        .send({ username: "userwithnopass" });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/signup");
    });
  });

  describe("User Login", () => {
    test("POST /login - successfully logs in a registered user and redirects to /todos", async () => {
      const response = await agent
        .post("/login")
        .type("form")
        .send({ username: testUser.username, password: "authpassword" });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/todos");

      const protectedRes = await agent.get("/todos");
      expect(protectedRes.statusCode).toBe(200);
      expect(protectedRes.text).toContain(`Welcome back, ${testUser.username}`);
    });

    test("POST /login - redirects to /login on incorrect password", async () => {
      const response = await agent
        .post("/login")
        .type("form")
        .send({ username: testUser.username, password: "wrongpassword" });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/login");
    });

    test("POST /login - redirects to /login on non-existent username", async () => {
      const response = await agent
        .post("/login")
        .type("form")
        .send({ username: "nonexistentuser", password: "anypassword" });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/login");
    });
  });

  describe("User Logout", () => {
    test("POST /logout - logs out the user and redirects to /login", async () => {
      await agent
        .post("/login")
        .type("form")
        .send({ username: testUser.username, password: "authpassword" });

      const response = await agent.post("/logout");

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe("/login");

      const protectedRes = await agent.get("/todos");
      expect(protectedRes.statusCode).toBe(302);
      expect(protectedRes.headers.location).toContain("/login");
    });
  });
});
