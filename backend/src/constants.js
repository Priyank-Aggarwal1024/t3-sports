const dotenv = require("dotenv");
dotenv.config();

const DB_NAME = "T3Sports";

const allowedOrigins = process.env.ORIGINS.split(",");

const port = process.env.PORT || 3001;

const API_KEY = "12345678-abcd-90ef-ghij-klmnopqrstuv";
// const API_KEY = '123-abc-456-def';

module.exports = {
  DB_NAME,
  allowedOrigins,
  port,
  API_KEY,
};
