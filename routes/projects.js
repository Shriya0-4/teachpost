const express = require("express");
const router = express.Router();
const ProjectModel = require("../models/projectModel");

router.get("/projects", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const userId = req.session.user.id;

    const projectCount = await ProjectModel.countDocuments({ user: userId });

    const projects = await ProjectModel.find().populate("user").exec();

    res.render("project", { user: req.session.user, projects, projectCount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/projects", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const { title, description, githubLink } = req.body;
  try {
    const project = new ProjectModel({
      title,
      description,
      githubLink,
      user: req.session.user.id,
    });
    await project.save();
    res.redirect("/projects");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
