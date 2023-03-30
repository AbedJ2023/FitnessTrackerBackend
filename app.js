require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const apiRouter = require("./api/index");
const client = require("./db/client");

// Setup your Middleware and API Router here
client.connect();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", apiRouter);

// app.get("/api/health", function (req, res) {
//   res.send({ message: "it is healthy" });
// });

module.exports = app;
