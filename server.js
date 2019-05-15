const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const server = express();

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());

server.use("/api/users", userRouter);
server.use("/api/posts", postRouter);

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request ${req.url} URL ${new Date()}`);
  next();
}

module.exports = server;
