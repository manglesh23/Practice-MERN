require("dotenv").config();
const express = require("express");
const router = require("./auth-router/router");

const { connectDB } = require("./db/db");
const app = express();
app.use(express.json());
app.use("/", router);

connectDB()
  .then(() => {
    app.listen("9000", () => {
      console.log("app is listining");
    });
  })
  .catch((e) => {
    console.log("Server Error");
    return {
      error: true,
      details: e,
    };
  });
