const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FeedModel = require("../models/feedModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/feed", upload.single("image"), async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const { content } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const feed = new FeedModel({
      content,
      image,
      user: req.session.user.id,
    });
    await feed.save();
    res.redirect("/feed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/feed", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const userId = req.session.user.id;

    const feedCount = await FeedModel.countDocuments({ user: userId });

    const feeds = await FeedModel.find().populate("user").exec();

    res.render("feed", { user: req.session.user, feeds, feedCount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
