import { useState } from "react";

import "./NuevaInvestigacion.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import Encabezado from "./components/Encabezado";
import Identificacion from "./components/Identificacion";
import Descripcion from "./components/Descripcion";
import AccionesInmediatas from "./components/AccionesInmediatas";
import ArbolCausas from "./components/ArbolCausas";
import PlanAccion from "./components/PlanAccion";

export default function NuevaInvestigacion({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);
  const [investigacionId, setInvestigacionId] = useState(null);

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
            investigacionId={investigacionId}
            setInvestigacionId={setInvestigacionId}
          />
        );

      case 1:
        return (
          <Identificacion
            investigacionId={investigacionId}
          />
        );

      case 2:
        return (
          <Descripcion
            investigacionId={investigacionId}
          />
        );

      case 3:
        return (
          <AccionesInmediatas
            investigacionId={investigacionId}
          />
        );

      case 4:
        return (
          <ArbolCausas
            investigacionId={investigacionId}
          />
        );

      case 5:
        return (
          <PlanAccion
            investigacionId={investigacionId}
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

          <div className="estado-header">

            <span className="estado borrador">
              Borrador
            </span>

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

          <button className="btn-primary">
            Guardar borrador
          </button>

          <button
            className="btn-primary"
            disabled={pasoActual === pasos.length - 1}
            onClick={() => setPasoActual(pasoActual + 1)}
          >
            Siguiente →
          </button>

        </div>

      </div>

    </Layout>

  );

}
