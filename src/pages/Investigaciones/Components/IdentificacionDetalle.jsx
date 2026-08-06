export default function IdentificacionDetalle({

  investigacion

}) {

  return (

    <div className="detalle-card">

      <h2>

        Identificación

      </h2>

      <div className="detalle-grid">

        <div className="detalle-item">

          <label>

            Macroproceso

          </label>

          <span>

            {investigacion.catalogo_macroprocesos?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Proceso

          </label>

          <span>

            {investigacion.catalogo_procesos?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Clasificación del incidente

          </label>

          <span>

            {investigacion.catalogo_tipos_incidente?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Turno

          </label>

          <span>

            {investigacion.catalogo_turnos?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Indicador impactado

          </label>

          <span>

            {investigacion.indicador_impactado || "-"}

          </span>

        </div>

      </div>

    </div>

  );

}
