import { useRef, useState } from "react";
import "./PlanAccion.css";

export default function PlanAccion({

  formulario,
  setFormulario

}) {

  const fileInputsRef = useRef({});

  const [imagenVista, setImagenVista] = useState(null);

  //---------------------------------------------------------
  // AGREGAR ACCIÓN
  //---------------------------------------------------------

  const agregarAccion = () => {

    setFormulario({

      ...formulario,

      plan_accion: [

        ...formulario.plan_accion,

        {

          numero: formulario.plan_accion.length + 1,

          causa: "",

          que_hacer: "",

          como: "",

          responsable: "",

          fecha_propuesta: "",

          fecha_inicio: "",

          fecha_fin: "",

          evidencia: null

        }

      ]

    });

  };

  //---------------------------------------------------------
  // ACTUALIZAR CAMPO
  //---------------------------------------------------------

  const actualizarCampo = (

    index,

    campo,

    valor

  ) => {

    const acciones = [

      ...formulario.plan_accion

    ];

    acciones[index][campo] = valor;

    setFormulario({

      ...formulario,

      plan_accion: acciones

    });

  };

  //---------------------------------------------------------
  // ELIMINAR
  //---------------------------------------------------------

  const eliminarAccion = (index) => {

    const acciones = formulario.plan_accion

      .filter((_, i) => i !== index)

      .map((item, i) => ({

        ...item,

        numero: i + 1

      }));

    setFormulario({

      ...formulario,

      plan_accion: acciones

    });

  };

  //---------------------------------------------------------
  // EVIDENCIA
  //---------------------------------------------------------

  const seleccionarImagen = (

    e,

    index

  ) => {

    const archivo = e.target.files[0];

    if (!archivo) return;

    actualizarCampo(

      index,

      "evidencia",

      archivo

    );

  };

  //---------------------------------------------------------
  // ESTADO
  //---------------------------------------------------------

  const obtenerEstado = (accion) => {

    if (accion.fecha_fin)

      return {

        texto: "🟢 Finalizada",

        color: "#28a745"

      };

    if (accion.fecha_inicio)

      return {

        texto: "🟡 En ejecución",

        color: "#ffc107"

      };

    if (

      accion.fecha_propuesta &&

      new Date(accion.fecha_propuesta) < new Date()

    )

      return {

        texto: "🔴 Atrasada",

        color: "#dc3545"

      };

    return {

      texto: "⚪ Pendiente",

      color: "#6c757d"

    };

  };

  return (

    <>
        <div className="plan-accion">

        <div className="plan-header">

          <button
            type="button"
            className="btn-primary"
            onClick={agregarAccion}
          >

            + Agregar acción

          </button>

        </div>

        <table className="tabla-plan">

          <thead>

            <tr>

              <th>#</th>
              <th>Causa</th>
              <th>¿Qué hacer?</th>
              <th>¿Cómo?</th>
              <th>Responsable</th>
              <th>Fecha propuesta</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th>Evidencia</th>
              <th>Estado</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            {formulario.plan_accion.length === 0 ? (

              <tr>

                <td
                  colSpan="11"
                  style={{
                    textAlign: "center"
                  }}
                >

                  No hay acciones registradas.

                </td>

              </tr>

            ) : (

              formulario.plan_accion.map((accion, index) => {

                const estado = obtenerEstado(accion);

                return (

                  <tr key={index}>

                    <td>

                      {accion.numero}

                    </td>

                    <td>

                      <textarea
                        rows={2}
                        placeholder="Causa raíz..."
                        value={accion.causa}
                        onChange={(e) =>
                          actualizarCampo(
                            index,
                            "causa",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <textarea
                        rows={2}
                        placeholder="¿Qué hacer?"
                        value={accion.que_hacer}
                        onChange={(e) =>
                          actualizarCampo(
                            index,
                            "que_hacer",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <textarea
                        rows={2}
                        placeholder="¿Cómo?"
                        value={accion.como}
                        onChange={(e) =>
                          actualizarCampo(
                            index,
                            "como",
                            e.target.value
                          )
                        }
                      />

                    </td>

                    <td>

                      <input
                        type="text"
                        placeholder="Responsable"
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
                        value={accion.fecha_propuesta}
                        onChange={(e) =>
                          actualizarCampo(
                            index,
                            "fecha_propuesta",
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
                        ref={(el) =>
                          (fileInputsRef.current[index] = el)
                        }
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
                              setImagenVista(
                                accion.evidencia
                              )
                            }
                          >

                            📷 {accion.evidencia.name}

                          </button>

                          <br />

                          <button
                            type="button"
                            className="btn-upload"
                            onClick={() =>
                              fileInputsRef.current[index]?.click()
                            }
                          >

                            🔄 Cambiar

                          </button>

                        </div>

                      )}

                    </td>

                    <td>

                      <span
                        style={{
                          fontWeight: 600,
                          color: estado.color
                        }}
                      >

                        {estado.texto}

                      </span>

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

                );

              })

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
