import React, { useState, useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./App.css";
import Launch from "./screens/Launch Screen/Launch";
import Signin from "./screens/AuthScreens/SignIn/Signin";
import Signup from "./screens/AuthScreens/Signup/Signup";
import ForgotPassword from "./screens/AuthScreens/ForgotPassword/ForgotPass";
import NewPassword from "./screens/AuthScreens/NewPassword/NewPass";
import PropertyScreen from "./screens/OtherScreens/PropertyScreen/PropertyScreen";
import ChatScreen from "./screens/OtherScreens/Chatscreen/ChatScreen";
import LoggedIn from "./screens/OtherScreens/LoggedIn/LoggedIn";
import PlaceProperty from "./components/PlaceProperty/PlaceProperty";
import ListedProperties from "./components/ListedProps/ListedProperties";
import AdminDashboard from "./screens/Admin/AdminDashboard";
import Myproperty from "./components/MyProperty/Myproperty";
import Messages from "./components/Messagess/Messages";
import ResendEmail from "./screens/AuthScreens/ResendVerifyEmail/ResendEmail";
import { setupAxiosInterceptors } from "./Features/utils";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    setupAxiosInterceptors(dispatch);

    // Cleanup function
    return () => {
      // Remove interceptors or perform any cleanup if needed
    };
  }, [dispatch]);

  const routes = useRoutes([
    { path: "/", element: <Launch /> },
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },
    { path: "/resend", element: <ResendEmail /> },
    { path: "/forgotpassword", element: <ForgotPassword /> },
    { path: "/resetpassword", element: <NewPassword /> },
    { path: "/details", element: <PropertyScreen /> },
    { path: "/chat", element: <ChatScreen /> },
    { path: "/home", element: <LoggedIn /> },
    { path: "/place-property", element: <PlaceProperty /> },
    { path: "/listed-properties", element: <ListedProperties /> },
    { path: "/admin", element: <AdminDashboard /> },
    { path: "/property", element: <Myproperty /> },
    { path: "/messages", element: <Messages /> },
  ]);
  return <div>{routes}</div>;
}

export default App;
