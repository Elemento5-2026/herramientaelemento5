import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import supabase from "../../lib/supabase";

import "./Investigaciones.css";

export default function Investigaciones({ setScreen }) {

  const [investigaciones, setInvestigaciones] = useState([]);

  useEffect(() => {

    async function cargarInvestigaciones() {

      const { data, error } = await supabase
        .from("investigaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {

        console.error(error);
        return;

      }

      setInvestigaciones(data);

    }

    cargarInvestigaciones();

  }, []);

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

      <div className="investigaciones">

        <div className="page-header">

          <div>

            <h1>Investigaciones</h1>

            <p>
              Administración de investigaciones de incidentes.
            </p>

          </div>

          <div className="page-actions">

            <button
              className="btn-primary"
              onClick={() => setScreen("nuevaInvestigacion")}
            >
              ➕ Nueva investigación
            </button>

          </div>

        </div>

        <div className="filters">

          <input
            type="text"
            placeholder="🔍 Buscar investigación..."
          />

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Código</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Dirección</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Elaboró</th>

              </tr>

            </thead>

            <tbody>

              {investigaciones.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{ textAlign: "center" }}
                  >

                    No hay investigaciones registradas.

                  </td>

                </tr>

              ) : (

                investigaciones.map((investigacion) => (

                  <tr
                    key={investigacion.id}
                  >

                    <td>

                      {investigacion.codigo_controlado}

                    </td>

                    <td>

                      {investigacion.created_at
                        ?.substring(0, 10)}

                    </td>

                    <td>

                      -

                    </td>

                    <td>

                      -

                    </td>

                    <td>

                      -

                    </td>

                    <td>

                      <span className="estado borrador">

                        {investigacion.estado}

                      </span>

                    </td>

                    <td>

                      {investigacion.elaborado_nombre}

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
