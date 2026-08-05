export default function DatosIncidente({

  incidente,
  setIncidente,

  tiposIncidente,
  danos

}) {

  return (

    <div className="card">

      <h2>

        Incidente

      </h2>

      <div className="form-grid">

        <div className="form-group">

          <label>

            Fecha

          </label>

          <input

            type="date"

            value={incidente.fecha || ""}

            disabled

          />

        </div>

        <div className="form-group">

          <label>

            Hora

          </label>

          <input

            type="time"

            value={incidente.hora?.substring(0,5) || ""}

            disabled

          />

        </div>

        <div className="form-group">

          <label>

            Clasificación

          </label>

          <select

            value={incidente.tipo_incidente_id || ""}

            onChange={(e)=>

              setIncidente({

                ...incidente,

                tipo_incidente_id:e.target.value

              })

            }

          >

            <option value="">

              Pendiente

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

            value={incidente.dano_id || ""}

            onChange={(e)=>

              setIncidente({

                ...incidente,

                dano_id:e.target.value

              })

            }

          >

            <option value="">

              Pendiente

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

            value={incidente.descripcion || ""}

            onChange={(e)=>

              setIncidente({

                ...incidente,

                descripcion:e.target.value

              })

            }

          />

        </div>

      </div>

    </div>

  );

}
