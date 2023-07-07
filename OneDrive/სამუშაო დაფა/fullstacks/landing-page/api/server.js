const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("./User");
const cors = require("cors");
const routes = require("./Router");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongo Database...");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
