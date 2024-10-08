import { useRoutes } from "react-router-dom";
import "./App.css";
import Launch from "./screens/Launch Screen/Launch";
import Signin from "./screens/AuthScreens/SignIn/Signin";
import Signup from "./screens/AuthScreens/Signup/Signup";
import ForgotPassword from "./screens/AuthScreens/ForgotPassword/ForgotPass";
import NewPassword from "./screens/AuthScreens/NewPassword/NewPass";
import PropertyScreen from "./screens/OtherScreens/PropertyScreen/PropertyScreen";

function App() {
  const routes = useRoutes([
    { path: "/", element: <Launch /> },
    { path: "/signin", element: <Signin /> },
    { path: "/signup", element: <Signup /> },
    { path: "/forgotpassword", element: <ForgotPassword /> },
    { path: "/resetpassword", element: <NewPassword /> },
    { path: "/details", element: <PropertyScreen /> },
  ]);
  return <div>{routes}</div>;
}

export default App;
