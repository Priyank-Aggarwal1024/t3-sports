const mongoose = require("mongoose");
const { DB_NAME } = require("../constants.js");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI.endsWith("/")
      ? `${process.env.MONGODB_URI}${DB_NAME}`
      : `${process.env.MONGODB_URI}/${DB_NAME}`;

    const connectionInstance = await mongoose.connect(uri);
    console.log(
      `\nMongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
