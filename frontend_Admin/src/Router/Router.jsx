import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import Signin from "../Pages/Signin";
import Profile from "../Pages/Profile";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import { AdminRoute, PrivateRoute } from "./RouteGuards";
import AllOrders from "../Pages/AllOrders";
import Order from "../Pages/Order";
import Analytics from "../Pages/Analytics";
import EditCustomer from "../components/EditCustomer";
import AssignOrder from "../components/AssignOrder";
import Create from "../Pages/Create";
import AssignedOrder from "../Pages/AssignedOrder";
import LedgerComponent from "../Pages/Ledger";
import OrderDetailPage from "../Pages/OrderDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },

      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/all-orders",
            element: <AllOrders />,
          },
          {
            path: "/show-order/:id",
            element: <OrderDetailPage />,
          },
          {
            path: "/analytics",
            element: <Analytics />,
          },
          {
            path: "/orders/assigned/:id",
            element: <AssignOrder />,
          },
          {
            path: "/assigned-order",
            element: <AssignedOrder />,
          },
        ],
      },
      {
        path: "/",
        element: <AdminRoute />,
        children: [
          {
            path: "/create",
            element: <Create />,
          },
          {
            path: "/edit-customer/:id",
            element: <EditCustomer />,
          },
          {
            path: "/order",
            element: <Order />,
          },
          {
            path: "/ledger",
            element: <LedgerComponent />,
          },
        ],
      },
    ],
  },
]);

export default router;
