import "./PlanAccion.css";

export default function PlanAccion() {

  return (

    <div className="plan-accion">

      <div className="plan-header">

        <button className="btn-primary">

          + Agregar acción

        </button>

      </div>

      <table className="tabla-plan">

        <thead>

          <tr>

            <th>Causa raíz</th>
            <th>¿Qué hacer?</th>
            <th>¿Cómo?</th>
            <th>Responsable</th>
            <th>Fecha plan inicio</th>
            <th>Fecha plan fin</th>
            <th>Evidencias</th>
            <th></th>

          </tr>

        </thead>

        <tbody>

          <tr>

            <td>

              <select>

                <option value="">
                  Seleccione...
                </option>

              </select>

            </td>

            <td>

              <textarea
                rows="2"
                placeholder="¿Qué hacer?"
              />

            </td>

            <td>

              <textarea
                rows="2"
                placeholder="¿Cómo?"
              />

            </td>

            <td>

              <select>

                <option value="">
                  Seleccione...
                </option>

              </select>

            </td>

            <td>

              <input type="date" />

            </td>

            <td>

              <input type="date" />

            </td>

            <td>

              <button className="btn-upload">

                📷 Adjuntar

              </button>

            </td>

            <td>

              <button className="btn-delete">

                🗑

              </button>

            </td>

          </tr>

        </tbody>

      </table>

    </div>

  );

}
