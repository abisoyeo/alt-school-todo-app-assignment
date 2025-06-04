# Todo App — AltSchool Backend Engineering Assignment

This project is a backend mini-project for **AltSchool Africa**. It is a session-based Todo application built with **Node.js, Express, MongoDB, Passport.js**, and **EJS**. The app allows users to manage personal tasks securely and view/update them in a simple web UI.

## Objective

Implement user authentication and protected CRUD operations for managing personal Todo tasks — meeting AltSchool’s requirements for backend session-based login and testing.

## Features

- User signup & login with hashed passwords
- Session-based auth using Passport Local
- Flash message support for form errors
- Protected Todo CRUD endpoints
- Soft delete (marking as deleted)
- Server-side rendering with EJS
- Basic route testing using Jest & Supertest

## Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **Passport.js (Local Strategy via `passport-local-mongoose`)**
- **Sessions stored with `connect-mongo`**
- **Templating:** EJS
- **Testing:** Jest + Supertest

## Setup Instructions

1. **Clone & install:**

   ```bash
   git clone https://github.com/abisoyeo/alt-school-todo-app-assignment.git
   cd todo-app
   npm install
   ```

2. **Create `.env`:**

   ```env
   MONGODB_URI=your_mongodb_uri
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   ```

3. **Run the app:**

   ```bash
   npm start
   ```

   Visit: [http://localhost:3000](http://localhost:3000)

## Run Tests

```bash
npm test
```

## Main Routes

| Method | Route      | Description              |
| ------ | ---------- | ------------------------ |
| GET    | /signup    | Show signup form         |
| POST   | /signup    | Register user            |
| GET    | /login     | Show login form          |
| POST   | /login     | Authenticate user        |
| GET    | /todos     | Show user’s todos (auth) |
| POST   | /todos     | Add new todo             |
| PATCH  | /todos/:id | Update todo status       |
| PATCH  | /todos/:id | Soft-delete todo         |
| GET    | /logout    | Logout user              |

## Live Demo

Deployed on: [Render](https://abisoye-altschool-todo-app-assignment.onrender.com/todos)

---

## About

Built as part of coursework to demonstrate session handling, validation, middleware, and EJS templating.
