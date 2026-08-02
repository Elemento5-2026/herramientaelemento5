import { useState } from "react";

import "./NuevaInvestigacion.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import Encabezado from "./Components/Encabezado";
import Identificacion from "./Components/Identificacion";
import Descripcion from "./Components/Descripcion";
import AccionesInmediatas from "./Components/AccionesInmediatas";
import ArbolCausas from "./Components/ArbolCausas";
import PlanAccion from "./Components/PlanAccion";

export default function NuevaInvestigacion({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);

  const [formulario, setFormulario] = useState({

    // Encabezado

    codigo_controlado: "",

    participantes: "",

    elaborado_nombre: "",
    elaborado_puesto: "",
    elaborado_gerencia: "",
    elaborado_area: "",
    elaborado_fecha: "",

    revisado_nombre: "",
    revisado_puesto: "",
    revisado_gerencia: "",
    revisado_area: "",
    revisado_fecha: "",

    aprobado_nombre: "",
    aprobado_puesto: "",
    aprobado_gerencia: "",
    aprobado_area: "",
    aprobado_fecha: "",

    // Identificación

    macroproceso_id: "",
    proceso_id: "",
    clasificacion_incidente_id: "",
    turno_id: "",

    indicador_impactado: "Incidentes",

    // Descripción

    descripcion_incidente: "",
    parte_cuerpo_lesionada_id: ""

  });

  const pasos = [

    "Encabezado",
    "Identificación",
    "Descripción",
    "Acciones inmediatas",
    "Análisis de causa",
    "Plan de acción"

  ];

  const renderPaso = () => {

    switch (pasoActual) {

      case 0:
        return (

          <Encabezado
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      case 1:
        return (

          <Identificacion
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      case 2:
        return (

          <Descripcion
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      case 3:
        return (

          <AccionesInmediatas
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      case 4:
        return (

          <ArbolCausas
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      case 5:
        return (

          <PlanAccion
            formulario={formulario}
            setFormulario={setFormulario}
          />

        );

      default:
        return null;

    }

  };

  return (

    <Layout
      header={<Header />}
      sidebar={
        <Sidebar
          screen="investigaciones"
          setScreen={setScreen}
        />
      }
    >

      <div className="nueva-investigacion">

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() => setScreen("investigaciones")}
            >
              ← Volver a investigaciones
            </button>

            <h1>Nueva investigación</h1>

            <p>

              Complete la información para registrar la investigación.

            </p>

          </div>

        </div>

        <div className="wizard-layout">

          <aside className="wizard-sidebar">

            {pasos.map((paso, index) => (

              <button
                key={index}
                className={
                  index === pasoActual
                    ? "wizard-item active"
                    : "wizard-item"
                }
                onClick={() => setPasoActual(index)}
              >

                <span className="wizard-number">

                  {index + 1}

                </span>

                <span>

                  {paso}

                </span>

              </button>

            ))}

          </aside>

          <section className="wizard-content">

            <h2>{pasos[pasoActual]}</h2>

            <hr />

            {renderPaso()}

          </section>

        </div>

        <div className="wizard-footer">

          <button
            className="btn-secondary"
            disabled={pasoActual === 0}
            onClick={() => setPasoActual(pasoActual - 1)}
          >

            ← Anterior

          </button>

          {pasoActual < pasos.length - 1 ? (

            <button
              className="btn-primary"
              onClick={() => setPasoActual(pasoActual + 1)}
            >

              Siguiente →

            </button>

          ) : (

            <button
              className="btn-primary"
            >

              Guardar TF

            </button>

          )}

        </div>

      </div>

    </Layout>

  );

}
