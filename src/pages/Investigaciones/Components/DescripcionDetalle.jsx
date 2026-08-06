export default function DescripcionDetalle({

  investigacion

}) {

  return (

    <div className="detalle-card">

      <h2>

        Descripción del incidente

      </h2>

      <div className="detalle-grid">

        <div className="detalle-item">

          <label>

            Descripción del incidente

          </label>

          <span>

            {investigacion.descripcion?.descripcion_incidente || "-"}

          </span>

        </div>

        <div className="detalle-item">

          <label>

            Parte del cuerpo lesionada

          </label>

          <span>

            {investigacion.descripcion?.parte_cuerpo_lesionada_id || "-"}

          </span>

        </div>

      </div>

      <div
        className="detalle-item"
        style={{ marginTop: "20px" }}
      >

        <label>

          Evidencias

        </label>

        {investigacion.descripcion?.evidencias?.length > 0 ? (

          <div className="evidencias-grid">

            {investigacion.descripcion.evidencias.map((archivo) => (

              <a
                key={archivo.id}
                href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/investigaciones/${archivo.ruta_storage}`}
                target="_blank"
                rel="noreferrer"
              >
                {archivo.nombre_original}
              </a>

            ))}

          </div>

        ) : (

          <span>

            No hay evidencias.

          </span>

        )}

      </div>

    </div>

  );

}
