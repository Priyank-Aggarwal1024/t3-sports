import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import Signin from "../Pages/Signin";
import Profile from "../Pages/Profile";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import { PrivateRoute } from "./RouteGuards";
import AllOrders from "../Pages/AllOrders";
import EditEvent from "../Pages/EditEvent";
import axios from "axios";
import DetailedList from "../Pages/DetailedList";
import BusinessPage from "../Pages/BusinessPage";
import Order from "../Pages/Order";
import ProductList from "../Pages/ProductList";
import Customer from "../components/Customer";
import CreateCustomer from "../components/CreateCustomer";
import Analytics from "../Pages/Analytics";
import CreateWarehouse from "../components/CreateWarehouse";
import EditCustomer from "../components/EditCustomer";

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
            path: "/customer",
            element: <CreateCustomer />,
          },
          {
            path: "/edit-customer/:id",
            element: <EditCustomer />,
          },
          {
            path: "/manage",
            element: <ProductList />,
          },
          {
            path: "/all-orders",
            element: <AllOrders />,
          },
          {
            path: "/order",
            element: <Order />,
          },
          {
            path: "/create-warehouse",
            element: <CreateWarehouse />
          },
          {
            path: "/analytics",
            element: <Analytics />,
          },
          {
            path: "/business/:id",
            element: <BusinessPage />,
            loader: async ({ params }) => {
              const response = await axios.get(
                `/api/business/all-listings/${params.id}`
              );
              const myBusiness = response.data;

              // Replace http with https in image URLs
              if (Array.isArray(myBusiness.bannerImages)) {
                myBusiness.bannerImages = myBusiness.bannerImages.map((imageUrl) =>
                  imageUrl && imageUrl.startsWith("http:") ? imageUrl.replace("http:", "https:") : imageUrl
                );
              }

              // Check if profileImage is a string before calling startsWith
              if (typeof myBusiness.profileImage === 'string') {
                myBusiness.profileImage = myBusiness.profileImage.startsWith("http:") ? myBusiness.profileImage.replace("http:", "https:") : myBusiness.profileImage;
              }

              return myBusiness;
            },
          },
          {
            path: "/edit-event/:id",
            element: <EditEvent />,
            loader: async ({ params }) => {
              const response = await axios.get(
                `/api/business/all-listings/${params.id}`
              );
              return response.data;
            },
          },
        ],
      },
    ],
  },
]);

export default router;
