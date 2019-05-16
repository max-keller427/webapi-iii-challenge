const express = require("express");

const router = express.Router();

const db = require("./postDb.js");

router.get("/", async (req, res) => {
  try {
    const posts = await db.get(req.query);
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving the posts"
    });
  }
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(201).json(req.post);
});

router.delete("/:id", validatePostId, async (req, res) => {
  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "post removed yo" });
    } else {
      res.status(404).json({ message: "the post does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: "error processing request" });
  }
});

router.put("/:id", validatePostId, validatePost, async (req, res) => {
  try {
    const post = await db.update(req.params.id, req.body);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post cant be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error processing request" });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;
    const post = await db.getById(id);
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(500).json({ message: "user id invalid" });
    }
  } catch (err) {
    res.status(500).json({ message: "the request couldnt be processed" });
  }
}

function validatePost(req, res, next) {
  if (req.body && Object.keys(req.body).length) {
    next();
  } else {
    res.status(500).json({ message: "please include a body" });
  }
}

module.exports = router;
