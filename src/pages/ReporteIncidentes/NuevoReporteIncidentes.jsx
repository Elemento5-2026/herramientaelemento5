import { useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import "./NuevoReporteIncidente.css";

export default function NuevoReporteIncidente({ setScreen }) {

  const [pasoActual, setPasoActual] = useState(0);

  const [formulario, setFormulario] = useState({

    direccion_id: "",
    sede_id: "",

    seccion: "",
    ubicacion: "",

    nombre_colaborador: "",

    fecha: "",
    hora: "",

    clasificacion_id: "",
    dano_id: "",

    descripcion: "",

    evidencias: []

  });

  const guardarReporte = async () => {

    console.log(formulario);

    alert("Aquí guardaremos el reporte en Supabase.");

  };

  const pasos = [

    "Información General",
    "Colaborador",
    "Incidente",
    "Evidencias"

  ];

  return (

    <Layout
      header={<Header />}
      sidebar={
        <Sidebar
          screen="reporteIncidentes"
          setScreen={setScreen}
        />
      }
    >

      <div className="nuevo-reporte-incidente">

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() =>
                setScreen("reporteIncidentes")
              }
            >
              ← Volver a Reporte de Incidentes
            </button>

            <h1>

              Reportar Incidente

            </h1>

            <p>

              Complete la información para registrar un nuevo incidente.

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

            <h2>

              {pasos[pasoActual]}

            </h2>

            <hr />

            {pasoActual === 0 && (

              <div className="form-grid">

                <div className="form-group">

                  <label>

                    Dirección

                  </label>

                  <select>

                    <option>

                      Seleccione...

                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>

                    Sede

                  </label>

                  <select>

                    <option>

                      Seleccione...

                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>

                    Sección

                  </label>

                  <input
                    value={formulario.seccion}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        seccion:e.target.value
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>

                    Ubicación

                  </label>

                  <input
                    value={formulario.ubicacion}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        ubicacion:e.target.value
                      })
                    }
                  />

                </div>

              </div>

            )}

            {pasoActual === 1 && (

              <div className="form-grid">

                <div className="form-group full">

                  <label>

                    Nombre del colaborador lesionado

                  </label>

                  <input
                    value={formulario.nombre_colaborador}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        nombre_colaborador:e.target.value
                      })
                    }
                  />

                </div>

              </div>

            )}

            {pasoActual === 2 && (

              <div className="form-grid">

                <div className="form-group">

                  <label>

                    Fecha

                  </label>

                  <input
                    type="date"
                    value={formulario.fecha}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        fecha:e.target.value
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>

                    Hora

                  </label>

                  <input
                    type="time"
                    value={formulario.hora}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        hora:e.target.value
                      })
                    }
                  />

                </div>

                <div className="form-group">

                  <label>

                    Clasificación

                  </label>

                  <select>

                    <option>

                      Seleccione...

                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>

                    Daño

                  </label>

                  <select>

                    <option>

                      Seleccione...

                    </option>

                  </select>

                </div>

                <div className="form-group full">

                  <label>

                    Descripción breve

                  </label>

                  <textarea
                    value={formulario.descripcion}
                    onChange={(e)=>
                      setFormulario({
                        ...formulario,
                        descripcion:e.target.value
                      })
                    }
                  />

                </div>

              </div>

            )}

            {pasoActual === 3 && (

              <div className="upload-box">

                <h3>

                  Evidencias

                </h3>

                <p>

                  Aquí se cargarán fotografías y archivos.

                </p>

              </div>

            )}
                      </section>

        </div>

        <div className="wizard-footer">

          <button
            className="btn-secondary"
            disabled={pasoActual === 0}
            onClick={() =>
              setPasoActual(pasoActual - 1)
            }
          >

            ← Anterior

          </button>

          {pasoActual < pasos.length - 1 ? (

            <button
              className="btn-primary"
              onClick={() =>
                setPasoActual(pasoActual + 1)
              }
            >

              Siguiente →

            </button>

          ) : (

            <button
              className="btn-primary"
              onClick={guardarReporte}
            >

              Guardar Reporte

            </button>

          )}

        </div>

      </div>

    </Layout>

  );

}
