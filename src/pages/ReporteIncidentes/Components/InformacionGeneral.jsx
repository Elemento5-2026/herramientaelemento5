export default function InformacionGeneral({

  formulario,
  setFormulario,

  direcciones,
  sedes

}) {

  console.log("Direcciones:", direcciones);
  console.log("Sedes:", sedes);

  return (

    <div className="form-grid">

      <div className="form-group">

        <label>

          Dirección

        </label>

        <select
          value={formulario.direccion_id}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              direccion_id:e.target.value
            })
          }
        >

          <option value="">

            Seleccione...

          </option>

          {direcciones.map((direccion)=>(

            <option
              key={direccion.id}
              value={direccion.id}
            >

              {direccion.nombre}

            </option>

          ))}

        </select>

      </div>

      <div className="form-group">

        <label>

          Sede

        </label>

        <select
          value={formulario.sede_id}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              sede_id:e.target.value
            })
          }
        >

          <option value="">

            Seleccione...

          </option>

          {sedes.map((sede)=>(

            <option
              key={sede.id}
              value={sede.id}
            >

              {sede.nombre}

            </option>

          ))}

        </select>

      </div>

      <div className="form-group">

        <label>

          Sección

        </label>

        <input
          value={formulario.seccion}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              seccion:e.target.value
            })
          }
        />

      </div>

      <div className="form-group">

        <label>

          Ubicación

        </label>

        <input
          value={formulario.ubicacion}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              ubicacion:e.target.value
            })
          }
        />

      </div>

    </div>

  );

}
