import { useState } from "react";

import "./NuevaInvestigacion.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function NuevaInvestigacion({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    "Registro",
    "Identificación",
    "Análisis de causa",
    "Acciones inmediatas",
    "Plan de acción",
    "Evaluación de eficacia"
  ];

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

            <h2>

              {pasos[pasoActual]}

            </h2>

            <hr />

            <div className="placeholder">

              Aquí construiremos el formulario del paso
              <br /><br />

              <strong>

                {pasos[pasoActual]}

              </strong>

            </div>

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
