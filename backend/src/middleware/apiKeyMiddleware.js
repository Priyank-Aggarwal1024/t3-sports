// src/middleware/apiKeyMiddleware.js
const { API_KEY } = require("../constants.js");

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey && apiKey === API_KEY) {
    return next();
  }

  res.status(401).json({ message: "Unauthorized: Invalid API key" });
};

module.exports = apiKeyMiddleware;
