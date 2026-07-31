import "./Login.css";

export default function Login() {
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
          Sistema Corporativo de Gestión de Incidentes
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

          <button>
            Ingresar
          </button>

        </div>

        <div className="footer">

          Grupo AG

          <br />

          Elemento 5 · Versión 1.0

        </div>

      </div>

    </div>
  );
}
