const mongoose = require("mongoose");
const User = require("./models/userModel");
const Todo = require("./models/todoModel");
const db = require("./db");
const passportLocalMongoose = require("passport-local-mongoose");

require("dotenv").config();

async function seed() {
  try {
    db.connectToMongoDB();

    await User.deleteMany();
    await Todo.deleteMany();

    // Create users with passport-local-mongoose
    const users = [
      new User({ username: "alice" }),
      new User({ username: "bob" }),
      new User({ username: "charlie" }),
    ];

    await Promise.all(
      users.map((u, i) => User.register(u, `password${i + 1}`))
    );

    const savedUsers = await User.find();

    const todos = [
      { title: "Buy milk", body: "From the store", user: savedUsers[0]._id },
      { title: "Clean room", body: "Vacuum and mop", user: savedUsers[1]._id },
      {
        title: "Study JS",
        body: "Review async/await",
        user: savedUsers[2]._id,
      },
      { title: "Laundry", body: "Wash clothes", user: savedUsers[0]._id },
      { title: "Workout", body: "Leg day", user: savedUsers[1]._id },
    ];

    await Todo.insertMany(todos);
    console.log("Seeding complete.");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
