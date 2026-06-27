require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/database");

connectToDb();

module.exports = app;