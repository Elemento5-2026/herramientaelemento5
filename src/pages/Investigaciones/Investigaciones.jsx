import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

import "./Investigaciones.css";

export default function Investigaciones({ setScreen }) {
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
            <p>Administración de investigaciones de incidentes.</p>
          </div>

          <button className="btn-primary">
            + Nueva investigación
          </button>

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

              <tr>
                <td>TF-2026-0001</td>
                <td>31/07/2026</td>
                <td>CPT</td>
                <td>Industrial</td>
                <td>Trefilación</td>
                <td>Borrador</td>
                <td>Pablo Hernández</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
}
