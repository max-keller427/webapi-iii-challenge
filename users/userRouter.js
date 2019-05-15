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

router.post("/:id/posts", validateUserId, (req, res) => {});

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

router.get("/:id", validateUserId, (req, res) => {});

router.get("/:id/posts", validateUserId, (req, res) => {});

router.delete("/:id", validateUserId, (req, res) => {});

router.put("/:id", validateUserId, (req, res) => {});

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
      next();
    } else {
      res.status(400).json({ message: "missing user data" });
    }
  } catch (err) {
    res.status(400).json({ message: "missing required name field" });
  }
}

function validatePost(req, res, next) {}

module.exports = router;
