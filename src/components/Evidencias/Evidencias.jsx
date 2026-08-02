import { useRef } from "react";
import imageCompression from "browser-image-compression";
import "./Evidencias.css";

export default function Evidencias({

  titulo = "Evidencias",

  archivos = [],

  setArchivos

}) {

  const inputRef = useRef(null);

  const seleccionarArchivos = async (e) => {

    const seleccionados = Array.from(e.target.files);

    const nuevosArchivos = [];

    for (const archivo of seleccionados) {

      if (archivo.type.startsWith("image/")) {

        try {

          const archivoComprimido = await imageCompression(

            archivo,

            {

              maxSizeMB: 0.5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
              initialQuality: 0.8

            }

          );

          console.log(

            `${archivo.name}: ${(archivo.size / 1024 / 1024).toFixed(2)} MB → ${(archivoComprimido.size / 1024 / 1024).toFixed(2)} MB`

          );

          nuevosArchivos.push(archivoComprimido);

        } catch (error) {

          console.error("Error al comprimir imagen:", error);

          nuevosArchivos.push(archivo);

        }

      } else {

        nuevosArchivos.push(archivo);

      }

    }

    setArchivos([

      ...archivos,
      ...nuevosArchivos

    ]);

    e.target.value = "";

  };

  const eliminarArchivo = (index) => {

    setArchivos(

      archivos.filter((_, i) => i !== index)

    );

  };

  return (

    <div className="evidencias">

      <h3>{titulo}</h3>

      <div className="dropzone">

        <div className="dropzone-icon">

          📷

        </div>

        <h4>

          Agregar evidencias

        </h4>

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

        <h4>

          Archivos cargados ({archivos.length})

        </h4>

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

                <br />

                <small>

                  {archivo.size >= 1024 * 1024
                    ? `${(archivo.size / 1024 / 1024).toFixed(2)} MB`
                    : `${(archivo.size / 1024).toFixed(0)} KB`}

                </small>

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
