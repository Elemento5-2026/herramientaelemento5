import "./Sidebar.css";

export default function Sidebar({ screen, setScreen }) {
  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-logo">
          GRUPO AG
        </div>

        <div className="sidebar-system">
          Elemento 5
        </div>

        <div className="sidebar-version">
          Gestión de Incidentes
        </div>

      </div>

      <nav className="sidebar-menu">

        <button
          className={`menu-item ${screen === "dashboard" ? "active" : ""}`}
          onClick={() => setScreen("dashboard")}
        >
          📊 Dashboard
        </button>

        <button
          className={`menu-item ${screen === "incidentes" ? "active" : ""}`}
          onClick={() => setScreen("incidentes")}
        >
          📁 Incidentes
        </button>

        <button
          className={`menu-item ${screen === "investigaciones" ? "active" : ""}`}
          onClick={() => setScreen("investigaciones")}
        >
          🔍 Investigaciones
        </button>

        <button
          className={`menu-item ${screen === "lecciones" ? "active" : ""}`}
          onClick={() => setScreen("lecciones")}
        >
          📚 Lecciones Aprendidas
        </button>

        <button
          className={`menu-item ${screen === "administracion" ? "active" : ""}`}
          onClick={() => setScreen("administracion")}
        >
          ⚙ Administración
        </button>

      </nav>

      <div className="sidebar-footer">

        <div>
          Elemento 5
        </div>

        <div className="sidebar-copy">
          © Grupo AG
        </div>

      </div>

    </aside>
  );
}
