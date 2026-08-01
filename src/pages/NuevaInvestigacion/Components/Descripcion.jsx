import "./Descripcion.css";

export default function Descripcion() {

  return (

    <div className="descripcion">

      <div className="form-row">

        <label>Descripción del incidente</label>

        <textarea
          rows="8"
          placeholder="Describa detalladamente el incidente..."
        />

      </div>

      <div className="form-row">

        <label>Parte del cuerpo lesionada</label>

        <select>

          <option value="">Seleccione...</option>

        </select>

      </div>

      <div className="form-row">

        <label>Evidencias fotográficas</label>

        <div className="dropzone">

          <div className="dropzone-icon">
            📷
          </div>

          <h3>Agregar fotografías</h3>

          <p>

            Arrastre imágenes aquí o haga clic para seleccionarlas.

          </p>

          <button className="btn-upload">

            Seleccionar archivos

          </button>

        </div>

      </div>

    </div>

  );

}
