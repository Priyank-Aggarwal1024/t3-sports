const express = require("express");
const cookieParser = require("cookie-parser");
const { port, allowedOrigins } = require("./src/constants.js");
const connectDB = require("./src/db/index.js");
const userRouter = require("./src/routes/user.route.js");
const authRouter = require("./src/routes/auth.route.js");
const orderRouter = require("./src/routes/order.route.js");
const productRouter = require("./src/routes/product.route.js");
const collectionRouter = require("./src/routes/collection.route.js");
const customerRouter = require("./src/routes/customer.route.js");
const warehouseRoutes = require("./src/routes/warehouse.route.js");
const stockRoutes = require("./src/routes/stock.route.js");
const ledgerRoutes = require("./src/routes/ledger.route.js");
const chalk = require("chalk");
const ImageKit = require("imagekit");
const apiKeyMiddleware = require("./src/middleware/apiKeyMiddleware.js");
const { verifyToken } = require("./src/utils/verifyUser.js");

// Create an Express app
const app = express();
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY, // Replace with your ImageKit Public API Key
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // Replace with your ImageKit Private API Key
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // Replace with your ImageKit URL endpoint
});
// Middleware for CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware for parsing request bodies and cookies
app.use(express.json());
// app.use(router);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
connectDB()
  .then(() => {
    // Set up routes
    app.use("/api/auth", authRouter);
    app.use(apiKeyMiddleware);
    app.use(verifyToken);
    app.use("/api/user", userRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/products", productRouter);
    app.use("/api/collections", collectionRouter);
    app.use("/api/customers", customerRouter);
    app.get("/product/imagekit/auth", (req, res) => {
      const authenticationParameters = imagekit.getAuthenticationParameters();
      res.json(authenticationParameters);
    });
    app.use("/api/warehouses", warehouseRoutes);
    app.use("/api/stocks", stockRoutes);
    app.use("/api/ledger", ledgerRoutes);

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
    console.error(
      chalk.red("MongoDB connection failed:"),
      chalk.yellow(err.message)
    );
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
