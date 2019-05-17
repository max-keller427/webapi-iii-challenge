const express = require("express");

const router = express.Router();

db = require("./userDb.js");

router.post("/", validateUser, async (req, res) => {
  try {
    const post = await db.insert(req.body);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: "Error adding user" });
  }
});

router.post("/:id/posts", validateUser, validatePost, async (req, res) => {
  const postInfo = { ...req.body, post_id: req.params.id };

  try {
    const post = await db.insert(postInfo);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error adding post" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await db.get();
    if (users.length) {
      res.status(200).json(users);
    } else {
      res.status(400).json({ message: "No users found" });
    }
  } catch (err) {
    res.status(400).json({ message: "Server Down" });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const posts = await db.getUserPosts(req.params.id);
    console.log(req.params.id);
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ message: "unable to find posts" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const count = await db.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "user has been removed" });
    } else {
      res.status(404).json({ message: "user cannot be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error removing user" });
  }
});

router.put("/:id", validateUserId, async (req, res) => {
  try {
    const user = await db.update(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user cannot be found" });
    }
  } catch (err) {
    res.status(500).json({ message: "error updating user" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await db.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  } catch (err) {
    res.status(500).json({ message: "The request could not be processed" });
  }
}

async function validateUser(req, res, next) {
  try {
    if (req.body && Object.keys(req.body).length) {
      if (req.body.name !== "") {
        next();
      }
    } else {
      res.status(400).json({ message: "missing user data" });
    }
  } catch (err) {
    res.status(400).json({ message: "missing required name field" });
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
