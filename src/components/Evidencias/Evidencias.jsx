import { useRef, useState } from "react";
import "./Evidencias.css";

export default function Evidencias({

  titulo = "Evidencias",
  moduloOrigen,
  moduloId

}) {

  const inputRef = useRef(null);

  const [archivos, setArchivos] = useState([]);

  const seleccionarArchivos = async (e) => {

    if (!moduloId) {

      alert(
        "Primero debe guardar la información antes de agregar evidencias."
      );

      e.target.value = "";

      return;

    }

    const nuevosArchivos = Array.from(e.target.files);

    setArchivos((anteriores) => [

      ...anteriores,
      ...nuevosArchivos

    ]);

    console.log("Módulo:", moduloOrigen);
    console.log("ID:", moduloId);
    console.log("Archivos:", nuevosArchivos);

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
          disabled={!moduloId}
          onClick={() => inputRef.current.click()}
        >

          Seleccionar archivos

        </button>

        {!moduloId && (

          <p
            style={{
              marginTop: "10px",
              color: "#b91c1c",
              fontSize: "13px"
            }}
          >

            Primero guarde la descripción para poder agregar evidencias.

          </p>

        )}

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
