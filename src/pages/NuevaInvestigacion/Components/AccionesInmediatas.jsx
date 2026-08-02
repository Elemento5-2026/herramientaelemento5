import { useRef, useState } from "react";
import "./AccionesInmediatas.css";

export default function AccionesInmediatas({

  formulario,
  setFormulario

}) {

  const fileInputsRef = useRef({});

  const [imagenVista, setImagenVista] = useState(null);

  const agregarAccion = () => {

    setFormulario({

      ...formulario,

      acciones_inmediatas: [

        ...formulario.acciones_inmediatas,

        {

          numero: formulario.acciones_inmediatas.length + 1,
          accion_inmediata: "",
          responsable: "",
          fecha_inicio: "",
          fecha_fin: "",
          evidencia: null

        }

      ]

    });

  };

  const actualizarCampo = (index, campo, valor) => {

    const acciones = [...formulario.acciones_inmediatas];

    acciones[index][campo] = valor;

    setFormulario({

      ...formulario,

      acciones_inmediatas: acciones

    });

  };

  const eliminarAccion = (index) => {

    const acciones = formulario.acciones_inmediatas
      .filter((_, i) => i !== index)
      .map((item, i) => ({

        ...item,

        numero: i + 1

      }));

    setFormulario({

      ...formulario,

      acciones_inmediatas: acciones

    });

  };

  const seleccionarImagen = (e, index) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    actualizarCampo(index, "evidencia", archivo);

  };

  return (

    <>

      <div className="acciones-inmediatas">

        <div className="acciones-header">

          <button
            type="button"
            className="btn-primary"
            onClick={agregarAccion}
          >

            + Agregar acción inmediata

          </button>

        </div>

        <table className="tabla-acciones">

          <thead>

            <tr>

              <th>#</th>
              <th>Acción inmediata</th>
              <th>Responsable</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Evidencia</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            {formulario.acciones_inmediatas.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >

                  No hay acciones inmediatas registradas.

                </td>

              </tr>

            ) : (

              formulario.acciones_inmediatas.map((accion, index) => (

                <tr key={index}>

                  <td>

                    {accion.numero}

                  </td>

                  <td>

                    <textarea
                      rows="2"
                      value={accion.accion_inmediata}
                      onChange={(e) =>
                        actualizarCampo(
                          index,
                          "accion_inmediata",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <input
                      type="text"
                      value={accion.responsable}
                      onChange={(e) =>
                        actualizarCampo(
                          index,
                          "responsable",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <input
                      type="date"
                      value={accion.fecha_inicio}
                      onChange={(e) =>
                        actualizarCampo(
                          index,
                          "fecha_inicio",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <input
                      type="date"
                      value={accion.fecha_fin}
                      onChange={(e) =>
                        actualizarCampo(
                          index,
                          "fecha_fin",
                          e.target.value
                        )
                      }
                    />

                  </td>

                  <td>

                    <input
                      ref={(el) => fileInputsRef.current[index] = el}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        seleccionarImagen(e, index)
                      }
                    />
                                        {!accion.evidencia ? (

                      <button
                        type="button"
                        className="btn-upload"
                        onClick={() =>
                          fileInputsRef.current[index]?.click()
                        }
                      >

                        📷 Seleccionar

                      </button>

                    ) : (

                      <div>

                        <button
                          type="button"
                          className="btn-link"
                          onClick={() =>
                            setImagenVista(accion.evidencia)
                          }
                        >

                          {accion.evidencia.name}

                        </button>

                        <br />

                        <button
                          type="button"
                          className="btn-upload"
                          onClick={() =>
                            fileInputsRef.current[index]?.click()
                          }
                        >

                          Cambiar

                        </button>

                      </div>

                    )}

                  </td>

                  <td>

                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() =>
                        eliminarAccion(index)
                      }
                    >

                      🗑

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {imagenVista && (

        <div
          className="modal-imagen"
          onClick={() => setImagenVista(null)}
        >

          <img
            src={URL.createObjectURL(imagenVista)}
            alt="Evidencia"
            onClick={(e) => e.stopPropagation()}
          />

        </div>

      )}

    </>

  );

}
