import express from "express";
import cookieParser from "cookie-parser";
import { port, allowedOrigins } from "./src/constants.js";
import connectDB from "./src/db/index.js";
import userRouter from "./src/routes/user.route.js";
import authRouter from "./src/routes/auth.route.js";
import orderRouter from "./src/routes/order.route.js";
import productRouter from "./src/routes/product.route.js";
import collectionRouter from "./src/routes/collection.route.js";
import customerRouter from "./src/routes/customer.route.js";
import chalk from "chalk"; // Importing chalk

// Create an Express app
const app = express();

// Middleware for CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware for parsing request bodies and cookies
app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB()
  .then(() => {
    // Set up routes
    app.use("/api/user", userRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/products", productRouter);
    app.use("/api/collections", collectionRouter);
    app.use("/api/customers", customerRouter);

    // Default route
    app.get("/", (req, res) => {
      res.send("Server is up and running!");
    });

    // Start the server
    app.listen(port, () => {
      console.log(chalk.green(`Server is running on port ${port}`)); // Colorful success message
    });
  })
  .catch((err) => {
    console.error(chalk.red("MongoDB connection failed:"), chalk.yellow(err.message));
    process.exit(1); // Exit the process with failure
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(chalk.red(err.stack)); // Colorful error stack trace
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
