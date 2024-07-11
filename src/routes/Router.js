import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import FullLayout from "../layouts/FullLayout";
import ForgotPassword from "../views/ui/ForgotPassword.js";
import ResetPassword from "../views/ui/ResetPassword.js";
import Users from "../views/ui/Users.js";

/***** Pages ****/
const Starter = lazy(() => import("../views/Starter.js"));
const Contacts = lazy(() => import("../views/Contacts.js"));
const Products = lazy(() => import("../views/ui/Products"));
const Categories = lazy(() => import("../views/ui/Categories.js"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Testimonials = lazy(() => import("../views/ui/Testimonials.js"));
const Orders = lazy(() => import("../views/ui/Orders.js"));
const OrderDetail = lazy(() => import("../views/ui/OrderDetail.js"));
const Login = lazy(() => import("../views/ui/Login"));
const Register = lazy(() => import("../views/ui/Register"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", exact: true, element: <Login /> },
      { path: "/register", exact: true, element: <Register /> },
      { path: "/forgot-password", exact: true, element: <ForgotPassword /> },
      { path: "/reset-password/:token", exact: true, element: <ResetPassword /> },
    ],
  },
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <ProtectedRoute><Starter /></ProtectedRoute> },
      { path: "/contacts", exact: true, element: <ProtectedRoute><Contacts /></ProtectedRoute> },
      { path: "/users", exact: true, element: <ProtectedRoute><Users /></ProtectedRoute> },
      { path: "/products", exact: true, element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: "/categories", exact: true, element: <ProtectedRoute><Categories /></ProtectedRoute> },
      { path: "/cards", exact: true, element: <ProtectedRoute><Cards /></ProtectedRoute> },
      { path: "/testimonials", exact: true, element: <ProtectedRoute><Testimonials /></ProtectedRoute> },
      { path: "/orders", exact: true, element: <ProtectedRoute><Orders /></ProtectedRoute> },
      { path: "/orders/:orderNumber", exact: true, element: <ProtectedRoute><OrderDetail /></ProtectedRoute> },
    ],
  },
];

export default ThemeRoutes;
