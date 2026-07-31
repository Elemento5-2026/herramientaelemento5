import "./Header.css";

export default function Header() {
  return (
    <header className="header">

      <div>

        <h2 className="header-title">
          Elemento 5
        </h2>

        <p className="header-subtitle">
          Gestión de Incidentes
        </p>

      </div>

      <div className="header-user">

        <div className="header-name">
          Pablo Hernández
        </div>

        <div className="header-role">
          Administrador
        </div>

      </div>

    </header>
  );
}
