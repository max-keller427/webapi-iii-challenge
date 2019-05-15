const express = require("express");

const router = express.Router();

const Post = require("./postDb.js");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.get(req.query);
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving the posts"
    });
  }
});

router.get("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
