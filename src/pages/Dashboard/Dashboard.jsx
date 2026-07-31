import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      <h1>
        Dashboard
      </h1>

      <p className="subtitle">
        Gestión de Incidentes
      </p>

      <div className="cards">

        <div className="card">
          <h3>CPT</h3>
          <span>12</span>
        </div>

        <div className="card">
          <h3>SPT</h3>
          <span>18</span>
        </div>

        <div className="card">
          <h3>PA</h3>
          <span>25</span>
        </div>

        <div className="card">
          <h3>CMD</h3>
          <span>4</span>
        </div>

        <div className="card">
          <h3>Acciones Abiertas</h3>
          <span>31</span>
        </div>

      </div>

      <div className="placeholder">

        Próximamente:
        <br />
        Indicadores
        <br />
        Gráficas
        <br />
        Tendencias
        <br />
        Incidentes recientes

      </div>

    </div>
  );
}
