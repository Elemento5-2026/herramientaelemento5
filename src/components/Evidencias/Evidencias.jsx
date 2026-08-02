import { useRef, useState } from "react";
import "./Evidencias.css";

export default function Evidencias({

  titulo = "Evidencias"

}) {

  const inputRef = useRef(null);

  const [archivos, setArchivos] = useState([]);

  const comprimirImagen = (archivo) => {

    return new Promise((resolve) => {

      if (!archivo.type.startsWith("image/")) {

        resolve(archivo);

        return;

      }

      const reader = new FileReader();

      reader.onload = (e) => {

        const img = new Image();

        img.onload = () => {

          const maxWidth = 1600;
          const maxHeight = 1600;

          let { width, height } = img;

          if (width > height && width > maxWidth) {

            height = height * (maxWidth / width);
            width = maxWidth;

          } else if (height > maxHeight) {

            width = width * (maxHeight / height);
            height = maxHeight;

          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(

            (blob) => {

              const archivoComprimido = new File(

                [blob],

                archivo.name,

                {

                  type: "image/jpeg",
                  lastModified: Date.now()

                }

              );

              console.log(
                `${archivo.name}: ${(archivo.size / 1024 / 1024).toFixed(2)} MB → ${(archivoComprimido.size / 1024 / 1024).toFixed(2)} MB`
              );

              resolve(archivoComprimido);

            },

            "image/jpeg",

            0.80

          );

        };

        img.src = e.target.result;

      };

      reader.readAsDataURL(archivo);

    });

  };

  const seleccionarArchivos = async (e) => {

    const seleccionados = Array.from(e.target.files);

    const nuevosArchivos = [];

    for (const archivo of seleccionados) {

      const archivoFinal = await comprimirImagen(archivo);

      nuevosArchivos.push(archivoFinal);

    }

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

        <h4>Archivos cargados ({archivos.length})</h4>

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

                  {(archivo.size / 1024).toFixed(0)} KB

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
