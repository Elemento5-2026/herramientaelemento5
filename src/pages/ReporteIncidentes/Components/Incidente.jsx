export default function Incidente({

  formulario,
  setFormulario,

  tiposIncidente,
  danos

}) {

  return (

    <div className="form-grid">

      <div className="form-group">

        <label>

          Fecha

        </label>

        <input
          type="date"
          value={formulario.fecha}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              fecha:e.target.value
            })
          }
        />

      </div>

      <div className="form-group">

        <label>

          Hora

        </label>

        <input
          type="time"
          value={formulario.hora}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              hora:e.target.value
            })
          }
        />

      </div>

      <div className="form-group">

        <label>

          Tipo de incidente

        </label>

        <select
          value={formulario.tipo_incidente_id}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              tipo_incidente_id:e.target.value
            })
          }
        >

          <option value="">

            Seleccione...

          </option>

          {tiposIncidente.map((tipo)=>(

            <option
              key={tipo.id}
              value={tipo.id}
            >

              {tipo.nombre}

            </option>

          ))}

        </select>

      </div>

      <div className="form-group">

        <label>

          Daño

        </label>

        <select
          value={formulario.dano_id}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              dano_id:e.target.value
            })
          }
        >

          <option value="">

            Seleccione...

          </option>

          {danos.map((dano)=>(

            <option
              key={dano.id}
              value={dano.id}
            >

              {dano.codigo} - {dano.descripcion}

            </option>

          ))}

        </select>

      </div>

      <div className="form-group full">

        <label>

          Descripción del incidente

        </label>

        <textarea
          rows={6}
          placeholder="Describa brevemente lo ocurrido..."
          value={formulario.descripcion}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              descripcion:e.target.value
            })
          }
        />

      </div>

    </div>

  );

}
