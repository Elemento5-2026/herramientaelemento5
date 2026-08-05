import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import "./ReporteIncidentes.css";

export default function ReporteIncidentes({ setScreen }) {

  const [incidentes, setIncidentes] = useState([]);

  useEffect(() => {

    // Más adelante cargaremos desde Supabase
    setIncidentes([]);

  }, []);

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

      <div className="reporte-incidentes">

        <div className="page-header">

          <div>

            <h1>

              Reporte de Incidentes

            </h1>

            <p>

              Administración de incidentes reportados por SISO.

            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
              onClick={() =>
                setScreen("nuevoReporteIncidente")
              }
            >

              ➕ Reportar incidente

            </button>

          </div>

        </div>

        <div className="filters">

          <input
            type="text"
            placeholder="🔍 Buscar incidente..."
          />

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Código</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Dirección</th>
                <th>Sede</th>
                <th>Sección</th>
                <th>Colaborador</th>
                <th>Clasificación</th>
                <th>Daño</th>
                <th>Investigación</th>

              </tr>

            </thead>

            <tbody>

              {incidentes.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    style={{ textAlign: "center" }}
                  >

                    No hay incidentes registrados.

                  </td>

                </tr>

              ) : (

                incidentes.map((incidente) => (

                  <tr key={incidente.id}>

                    <td>{incidente.codigo}</td>

                    <td>{incidente.fecha}</td>

                    <td>{incidente.hora}</td>

                    <td>{incidente.direccion}</td>

                    <td>{incidente.sede}</td>

                    <td>{incidente.seccion}</td>

                    <td>{incidente.colaborador}</td>

                    <td>{incidente.clasificacion}</td>

                    <td>{incidente.dano}</td>

                    <td>

                      <button
                        className="btn-link"
                      >

                        🟢 Realizar TF

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>

  );

}
