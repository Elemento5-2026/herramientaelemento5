import { useRef } from "react";
import "./Evidencias.css";

export default function Evidencias({

  titulo = "Evidencias",

  archivos = [],

  setArchivos

}) {

  const inputRef = useRef(null);

  const seleccionarArchivos = (e) => {

    const nuevosArchivos = Array.from(e.target.files);

    setArchivos((anteriores) => [

      ...anteriores,
      ...nuevosArchivos

    ]);

    e.target.value = "";

  };

  const eliminarArchivo = (index) => {

    setArchivos((anteriores) =>
      anteriores.filter((_, i) => i !== index)
    );

  };

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
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={seleccionarArchivos}
        />

        <button
          type="button"
          className="btn-upload"
          onClick={() => inputRef.current.click()}
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

                📎 {archivo.name}

              </div>

              <button
                type="button"
                className="btn-eliminar"
                onClick={() => eliminarArchivo(index)}
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
