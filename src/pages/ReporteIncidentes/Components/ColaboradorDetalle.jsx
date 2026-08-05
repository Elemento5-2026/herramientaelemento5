export default function ColaboradorDetalle({

  incidente

}) {

  return (

    <div className="card">

      <h2>

        Colaborador

      </h2>

      <div className="form-grid">

        <div className="form-group full">

          <label>

            Nombre del colaborador

          </label>

          <input

            value={
              incidente.nombre_colaborador || ""
            }

            disabled

          />

        </div>

      </div>

    </div>

  );

}
