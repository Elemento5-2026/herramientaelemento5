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

            {investigacion.macroproceso?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Proceso

          </label>

          <span>

            {investigacion.proceso?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Clasificación del incidente

          </label>

          <span>

            {investigacion.clasificacion?.nombre || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Turno

          </label>

          <span>

            {investigacion.turno?.nombre || "-"}

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
