import "./Dashboard.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
    >
      <div className="dashboard">

        <h1>
          Dashboard
        </h1>

        <p className="dashboard-subtitle">
          Bienvenido al Sistema de Gestión de Incidentes.
        </p>

        <div className="dashboard-placeholder">

          🚧 Dashboard en construcción

        </div>

      </div>
    </Layout>
  );
}
