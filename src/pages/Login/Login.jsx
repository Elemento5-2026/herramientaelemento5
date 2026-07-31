import "./Login.css";

export default function Login({ setScreen }) {
  return (
    <div className="login">

      <div className="login-card">

        <div className="logo">
          GRUPO AG
        </div>

        <h1>
          Elemento 5
        </h1>

        <p className="subtitle">
          Gestión de Incidentes
        </p>

        <p className="version">
          Versión 1.0
        </p>

        <div className="form">

          <label>
            Usuario
          </label>

          <input
            type="text"
            placeholder="Ingrese su código"
          />

          <label>
            Contraseña
          </label>

          <input
            type="password"
            placeholder="Ingrese su contraseña"
          />

          <button
            onClick={() => setScreen("dashboard")}
          >
            INGRESAR
          </button>

        </div>

        <div className="footer">
          © Grupo AG
        </div>

      </div>

    </div>
  );
}
