import "./Sidebar.css";

export default function Sidebar() {
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

        <button className="menu-item active">
          📊 Dashboard
        </button>

        <button className="menu-item">
          📁 Incidentes
        </button>

        <button className="menu-item">
          🔍 Investigaciones
        </button>

        <button className="menu-item">
          ✅ Acciones
        </button>

        <button className="menu-item">
          📚 Lecciones Aprendidas
        </button>

        <button className="menu-item">
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
