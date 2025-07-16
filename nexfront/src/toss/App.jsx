import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { CheckoutPage } from "./Checkout.jsx";
import { SuccessPage } from "./Success.jsx";
import { FailPage } from "./Fail.jsx";
import LoginPage from "./login/page";
import LoginPageSucess from "./loginsuccess/pages.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CheckoutPage />,
  },
  {
    path: "success",
    element: <SuccessPage />,
  },
  {
    path: "fail",
    element: <FailPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "loginsuccess",
    element: <LoginPageSucess />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
