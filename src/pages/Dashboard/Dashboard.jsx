import "./Dashboard.css";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";

export default function Dashboard() {
  return (
    <Layout
      header={<Header />}
      sidebar={<Sidebar />}
    >
      <div className="dashboard">

        <h1>Dashboard</h1>

        <p className="dashboard-subtitle">
          Bienvenido al Sistema de Gestión de Incidentes.
        </p>

        <div className="cards">

          <StatCard
            title="CPT"
            value={0}
            subtitle="Este mes"
          />

          <StatCard
            title="SPT"
            value={0}
            subtitle="Este mes"
          />

          <StatCard
            title="PA"
            value={0}
            subtitle="Este mes"
          />

          <StatCard
            title="CMD"
            value={0}
            subtitle="Este mes"
          />

          <StatCard
            title="Acciones"
            value={0}
            subtitle="Pendientes"
          />

        </div>

        <div className="dashboard-placeholder">
          Próximamente aquí veremos gráficas, indicadores e incidentes recientes.
        </div>

      </div>
    </Layout>
  );
}
