# Express.js Backend API

This project is an Express.js-based backend API designed for a web application. It provides a wide range of functionalities including user authentication, product management, order processing, and image handling with ImageKit. The backend is connected to a MongoDB database and supports multiple API routes.

## Features
- User Authentication (Signup, Login, Google Sign-In, Sign Out, Update Password, Token Verification)
- Product Management (Create, Read, Update, Delete)
- Order Management (Create, Fulfill, Update, Delete, Assign Orders)
- Collection Management (Add/Remove Products, CRUD Operations)
- Customer Management (Search, CRUD Operations)
- Warehouse and Stock Management (Add/Remove Products, Transfer Stocks, Update Quantities)
- Ledger Management (Create, Read, Update)
- Image Upload and Authentication using ImageKit

## Technologies Used
- Express.js
- MongoDB
- ImageKit
- Chalk (for colorful console logs)
- Cookie-Parser
- CORS Middleware

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB instance running

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-repo/your-project.git
cd your-project
```
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongo_db_uri
PORT=5000
JWT_KEY=your_jwt_key
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
ORIGINS=http://localhost:3000,http://your-frontend-domain.com
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NIMBUS_API_KEY=your_nimbus_api_key
NODEMAILER_PASS=your_nodemailer_password
NODEMAILER_EMAIL=your_nodemailer_email
```

### Running the Server
```bash
npm start
```

### API Endpoints
| Method | Endpoint                     | Description                   |
|--------|-----------------------------|-------------------------------|
| GET    | /                            | Server status                 |
| POST   | /api/auth/signup             | User registration             |
| POST   | /api/auth/signin             | User login                    |
| POST   | /api/auth/google             | Google login                  |
| GET    | /api/auth/signout            | User logout                   |
| POST   | /api/auth/updatePassword/:email | Update user password      |
| GET    | /api/auth/check-token        | Verify user token             |
| GET    | /api/user/get-users          | Get all users (Admin only)    |
| GET    | /api/user/get-user/:email    | Get user by email             |
| GET    | /api/user/get-user-by-id/:id | Get user by ID                |
| DELETE | /api/user/delete/:id        | Delete user (Admin only)      |
| POST   | /api/user/update/:id        | Update user profile image     |
| GET    | /api/products               | Get all products              |
| POST   | /api/products               | Add new product               |
| GET    | /api/products/:id           | Get product by ID             |
| PUT    | /api/products/:id           | Update product                |
| DELETE | /api/products/:id          | Delete product                |
| GET    | /api/orders                 | Get all orders                |
| POST   | /api/orders/create          | Create a new order            |
| GET    | /api/orders/assigned        | Get assigned orders           |
| GET    | /api/orders/:id             | Get order by ID               |
| PUT    | /api/orders/fulfill/:id     | Fulfill an order              |
| PUT    | /api/orders/update/:id      | Update an order               |
| DELETE | /api/orders/:id            | Delete an order               |
| GET    | /api/collections            | Get all collections           |
| POST   | /api/collections           | Create a new collection       |
| GET    | /api/collections/:name     | Get collection by name        |
| PUT    | /api/collections/:id       | Update collection             |
| DELETE | /api/collections/:id      | Delete collection             |
| PUT    | /api/collections/:id/add-product | Add product to collection |
| PUT    | /api/collections/:id/remove-product | Remove product from collection |
| GET    | /api/customers              | Get all customers             |
| POST   | /api/customers/create      | Create a customer (Admin only)|
| POST   | /api/customers/search      | Search for customers (Admin only)|
| PUT    | /api/customers/customer/:id| Update customer (Admin only)  |
| DELETE | /api/customers/customer/:id| Delete customer (Admin only)  |
| GET    | /api/warehouses            | Get all warehouses            |
| POST   | /api/warehouses/create    | Create a warehouse (Admin only)|
| PUT    | /api/warehouses/add-product/:id | Add product to warehouse (Admin only)|
| PUT    | /api/warehouses/remove-product/:id | Remove product from warehouse (Admin only)|
| PUT    | /api/warehouses/edit-product-quantity/:id | Edit warehouse product quantity (Admin only)|
| DELETE | /api/warehouses/:id      | Delete warehouse (Admin only) |
| GET    | /api/stocks               | View all stocks (Admin only)  |
| POST   | /api/stocks/update       | Update stock (Admin only)     |
| POST   | /api/stocks/transfer     | Transfer stock (Admin only)   |
| GET    | /api/ledger               | Get all ledgers               |
| POST   | /api/ledger/create      | Create ledger (Admin only)    |
| PUT    | /api/ledger/:id         | Update ledger (Admin only)    |
| GET    | /product/imagekit/auth   | ImageKit auth params          |

### Error Handling
The app uses centralized error handling and returns JSON responses with proper status codes and error messages.

### Contributing
Feel free to fork the repository and submit pull requests.

### License
This project is licensed under the MIT License.

