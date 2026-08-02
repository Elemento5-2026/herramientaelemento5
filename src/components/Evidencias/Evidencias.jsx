import "./Evidencias.css";

export default function Evidencias({

  titulo = "Evidencias",
  archivos = [],
  onSeleccionarArchivos,
  onEliminarArchivo

}) {

  return (

    <div className="evidencias">

      <h3>{titulo}</h3>

      <div className="dropzone">

        <div className="dropzone-icon">
          📷
        </div>

        <h4>Agregar evidencias</h4>

        <p>

          Puede subir imágenes, documentos PDF u otros archivos
          relacionados con la investigación.

        </p>

        <input
          id="input-evidencias"
          type="file"
          multiple
          hidden
          onChange={onSeleccionarArchivos}
        />

        <button
          type="button"
          className="btn-upload"
          onClick={() =>
            document
              .getElementById("input-evidencias")
              .click()
          }
        >

          Seleccionar archivos

        </button>

      </div>

      <div className="lista-evidencias">

        <h4>Archivos cargados</h4>

        {archivos.length === 0 ? (

          <p className="sin-archivos">

            Aún no se han agregado evidencias.

          </p>

        ) : (

          archivos.map((archivo, index) => (

            <div
              key={index}
              className="archivo-item"
            >

              <div>

                📎 {archivo.nombre_original || archivo.name}

              </div>

              <button
                type="button"
                className="btn-eliminar"
                onClick={() => onEliminarArchivo(index)}
              >

                🗑

              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );

}
