import { useState } from "react";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";

import ReporteIncidentes from "../pages/ReporteIncidentes/ReporteIncidentes";
import NuevoReporteIncidente from "../pages/ReporteIncidentes/NuevoReporteIncidente";
import IncidenteDetalle from "../pages/ReporteIncidentes/IncidenteDetalle";

import Investigaciones from "../pages/Investigaciones/Investigaciones";
import NuevaInvestigacion from "../pages/NuevaInvestigacion/NuevaInvestigacion";
import InvestigacionDetalle from "../pages/Investigaciones/InvestigacionDetalle";

export default function AppNavigator() {

  const [screen, setScreen] = useState("login");

  const [investigacionSeleccionada, setInvestigacionSeleccionada] =
    useState(null);

  const [incidenteSeleccionado, setIncidenteSeleccionado] =
    useState(null);

  // ============================================
  // NUEVO: Estado para el modo de investigación
  // ============================================
  const [investigacionModo, setInvestigacionModo] = useState('create'); // 'create' | 'edit' | 'view'

  // ============================================
  // NUEVO: Función auxiliar para navegar a investigación
  // ============================================
  const navegarAInvestigacion = (investigacionId, modo = 'edit') => {
    setInvestigacionSeleccionada(investigacionId);
    setInvestigacionModo(modo);
    setScreen("nuevaInvestigacion");
  };

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
          setIncidenteSeleccionado={setIncidenteSeleccionado}
          setInvestigacionSeleccionada={setInvestigacionSeleccionada}
          setInvestigacionModo={setInvestigacionModo}
          navegarAInvestigacion={navegarAInvestigacion}
        />
      );

    case "nuevoReporteIncidente":
      return (
        <NuevoReporteIncidente
          setScreen={setScreen}
        />
      );

    case "incidenteDetalle":
      return (
        <IncidenteDetalle
          setScreen={setScreen}
          incidenteId={incidenteSeleccionado}
        />
      );

    case "investigaciones":
      return (
        <Investigaciones
          setScreen={setScreen}
          setInvestigacionSeleccionada={setInvestigacionSeleccionada}
          setInvestigacionModo={setInvestigacionModo}
          navegarAInvestigacion={navegarAInvestigacion}
        />
      );

    // ============================================
    // MODIFICADO: Ahora recibe mode
    // ============================================
    case "nuevaInvestigacion":
      return (
        <NuevaInvestigacion
          setScreen={setScreen}
          investigacionId={investigacionSeleccionada}
          mode={investigacionModo}
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
