import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import "./IncidenteDetalle.css";

export default function IncidenteDetalle({

  setScreen,
  incidenteId

}) {

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

      <div className="incidente-detalle">

        <div className="page-header">

          <div>

            <button
              className="btn-link"
              onClick={() => setScreen("reporteIncidentes")}
            >

              ← Volver a Reporte de Incidentes

            </button>

            <h1>

              Detalle del Incidente

            </h1>

            <p>

              Código del incidente: <strong>{incidenteId}</strong>

            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
            >

              💾 Guardar Cambios

            </button>

            <button
              className="btn-primary"
            >

              📋 Iniciar TF

            </button>

          </div>

        </div>

        <div className="card">

          <h2>

            Información General

          </h2>

          <div className="form-grid">

            <div className="form-group">

              <label>

                Dirección

              </label>

              <input disabled />

            </div>

            <div className="form-group">

              <label>

                Sede

              </label>

              <input disabled />

            </div>

            <div className="form-group">

              <label>

                Sección

              </label>

              <input disabled />

            </div>

            <div className="form-group">

              <label>

                Ubicación

              </label>

              <input disabled />

            </div>

          </div>

        </div>

        <div className="card">

          <h2>

            Colaborador

          </h2>

          <div className="form-grid">

            <div className="form-group full">

              <label>

                Nombre del colaborador

              </label>

              <input disabled />

            </div>

          </div>

        </div>

        <div className="card">

          <h2>

            Incidente

          </h2>

          <div className="form-grid">

            <div className="form-group">

              <label>

                Fecha

              </label>

              <input disabled />

            </div>

            <div className="form-group">

              <label>

                Hora

              </label>

              <input disabled />

            </div>

            <div className="form-group">

              <label>

                Clasificación

              </label>

              <select>

                <option>

                  Pendiente

                </option>

              </select>

            </div>

            <div className="form-group">

              <label>

                Daño

              </label>

              <select>

                <option>

                  Pendiente

                </option>

              </select>

            </div>

            <div className="form-group full">

              <label>

                Descripción

              </label>

              <textarea
                rows={6}
              />

            </div>

          </div>

        </div>

      </div>

    </Layout>

  );

}
