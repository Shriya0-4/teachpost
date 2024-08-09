const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const session = require("express-session");
const UserModel = require("./models/usermodel");
const ProjectModel = require("./models/projectModel");
const FeedModel = require("./models/feedModel");
app.use("/uploads", express.static("uploads"));

const projectRoutes = require("./routes/projects");
const feedRoutes = require("./routes/feed");

const PORT = process.env.PORT;

const mongoConnection = process.env.mongoConnection;
mongoose
  .connect(mongoConnection)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

app.use(projectRoutes);
app.use(feedRoutes);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/home", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  try {
    const userId = req.session.user.id;
    const projectCount = await ProjectModel.countDocuments({ user: userId });
    const feedCount = await FeedModel.countDocuments({ user: userId });

    const totalPosts = projectCount + feedCount;

    res.render("index", {
      user: req.session.user,
      totalPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/index", (req, res) => {
  res.render("index");
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: name });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = {
          id: user._id,
          username: user.username,
          email: user.email,
          profession: user.profession,
        };
        res.redirect("/home");
      } else {
        res.status(401)
          .send("Incorrect password. Please register if you don't have an account.");
        }
    } else {
      res.status(404).send("User not found. Please register.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/register", async (req, res) => {
  const { name, password, email, profession } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).send("User already exists. Please log in.");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username: name,
        password: hashedPassword,
        email,
        profession,
      });
      await user.save();
      req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        profession: user.profession,
      };
      res.redirect("/home");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
