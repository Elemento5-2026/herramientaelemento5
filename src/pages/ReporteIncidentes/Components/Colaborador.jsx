export default function Colaborador({

  formulario,
  setFormulario

}) {

  return (

    <div className="form-grid">

      <div className="form-group full">

        <label>

          Nombre del colaborador lesionado

        </label>

        <input
          type="text"
          placeholder="Ingrese el nombre del colaborador"
          value={formulario.nombre_colaborador}
          onChange={(e)=>
            setFormulario({
              ...formulario,
              nombre_colaborador:e.target.value
            })
          }
        />

      </div>

    </div>

  );

}
