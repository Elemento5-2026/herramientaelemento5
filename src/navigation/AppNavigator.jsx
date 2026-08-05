import { useState } from "react";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ReporteIncidentes from "../pages/ReporteIncidentes/ReporteIncidentes";
import NuevoReporteIncidente from "../pages/ReporteIncidentes/NuevoReporteIncidente";

import Investigaciones from "../pages/Investigaciones/Investigaciones";
import NuevaInvestigacion from "../pages/NuevaInvestigacion/NuevaInvestigacion";
import InvestigacionDetalle from "../pages/Investigaciones/InvestigacionDetalle";

export default function AppNavigator() {

  const [screen, setScreen] = useState("login");

  const [investigacionSeleccionada, setInvestigacionSeleccionada] =
    useState(null);

  switch (screen) {

    case "dashboard":
      return (
        <Dashboard
          setScreen={setScreen}
        />
      );

    case "reporteIncidentes":
      return (
        <ReporteIncidentes
          setScreen={setScreen}
        />
      );

    case "nuevoReporteIncidente":
      return (
        <NuevoReporteIncidente
          setScreen={setScreen}
        />
      );

    case "investigaciones":
      return (
        <Investigaciones
          setScreen={setScreen}
          setInvestigacionSeleccionada={setInvestigacionSeleccionada}
        />
      );

    case "nuevaInvestigacion":
      return (
        <NuevaInvestigacion
          setScreen={setScreen}
        />
      );

    case "investigacionDetalle":
      return (
        <InvestigacionDetalle
          setScreen={setScreen}
          investigacionId={investigacionSeleccionada}
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
