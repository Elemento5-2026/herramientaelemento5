import "./Identificacion.css";

export default function Identificacion() {

  return (

    <div className="identificacion">

      <div className="form-row">

        <label>Norma aplicable</label>

        <input
          type="text"
          value="ISO 45001"
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Procedencia</label>

        <input
          type="text"
          value="Seguridad Industrial"
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Macroproceso</label>

        <select>

          <option value="">Seleccione...</option>

        </select>

      </div>

      <div className="form-row">

        <label>Proceso</label>

        <select>

          <option value="">Seleccione...</option>

        </select>

      </div>

      <div className="form-row">

        <label>Nombre del indicador impactado</label>

        <input
          type="text"
          value="Incidentes"
          readOnly
        />

      </div>

      <div className="form-row">

        <label>Impacto</label>

        <select>

          <option value="">Seleccione...</option>

        </select>

      </div>

      <div className="form-row">

        <label>Turno</label>

        <select>

          <option value="">Seleccione...</option>

        </select>

      </div>

    </div>

  );

}
