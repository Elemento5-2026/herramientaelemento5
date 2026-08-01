import { useState } from "react";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Investigaciones from "../pages/Investigaciones/Investigaciones.jsx";

export default function AppNavigator() {

  const [screen, setScreen] = useState("login");

  switch (screen) {

    case "dashboard":
      return (
        <Dashboard
          setScreen={setScreen}
        />
      );

    case "investigaciones":
      return (
        <Investigaciones
          setScreen={setScreen}
        />
      );

    default:
      return (
        <Login
          setScreen={setScreen}
        />
      );

  }

}
