import { useState } from "react";
import "./Encabezado.css";
import { guardarEncabezado } from "../../../services/investigacionesService";

export default function Encabezado() {

  const [formulario, setFormulario] = useState({

    codigo_controlado: "",

    participantes: "",

    elaborado_nombre: "",
    elaborado_puesto: "",
    elaborado_gerencia: "",
    elaborado_area: "",
    elaborado_fecha: "",

    revisado_nombre: "",
    revisado_puesto: "",
    revisado_gerencia: "",
    revisado_area: "",
    revisado_fecha: "",

    aprobado_nombre: "",
    aprobado_puesto: "",
    aprobado_gerencia: "",
    aprobado_area: "",
    aprobado_fecha: ""

  });


  const guardar = async () => {

    try {

      const data = await guardarEncabezado(formulario);

      console.log(data);

      alert("Encabezado guardado correctamente.");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });

  };

  return (

    <div className="encabezado">

      <div className="form-group">

        <label>Código controlado del Tratamiento de Falla por Incidente</label>

        <input
          type="text"
          name="codigo_controlado"
          value={formulario.codigo_controlado}
          onChange={handleChange}
          placeholder="Lo asigna Excelencia Operativa"
        />

      </div>

      <div className="form-group">

        <label>Participantes</label>

        <div className="catalogo-placeholder">

          Aquí irá el selector múltiple de participantes.

        </div>

      </div>

      <div className="firma-row">

        <label>Elaboró:</label>

        <input
          type="text"
          name="elaborado_nombre"
          value={formulario.elaborado_nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <label>Puesto:</label>

        <select
          name="elaborado_puesto"
          value={formulario.elaborado_puesto}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Gerencia:</label>

        <select
          name="elaborado_gerencia"
          value={formulario.elaborado_gerencia}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Área:</label>

        <select
          name="elaborado_area"
          value={formulario.elaborado_area}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Fecha:</label>

        <input
          type="date"
          name="elaborado_fecha"
          value={formulario.elaborado_fecha}
          onChange={handleChange}
        />

      </div>

      <div className="firma-row">

        <label>Revisó:</label>

        <input
          type="text"
          name="revisado_nombre"
          value={formulario.revisado_nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <label>Puesto:</label>

        <select
          name="revisado_puesto"
          value={formulario.revisado_puesto}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Gerencia:</label>

        <select
          name="revisado_gerencia"
          value={formulario.revisado_gerencia}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Área:</label>

        <select
          name="revisado_area"
          value={formulario.revisado_area}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Fecha:</label>

        <input
          type="date"
          name="revisado_fecha"
          value={formulario.revisado_fecha}
          onChange={handleChange}
        />

      </div>

      <div className="firma-row">

        <label>Aprobó:</label>

        <input
          type="text"
          name="aprobado_nombre"
          value={formulario.aprobado_nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />

        <label>Puesto:</label>

        <select
          name="aprobado_puesto"
          value={formulario.aprobado_puesto}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Gerencia:</label>

        <select
          name="aprobado_gerencia"
          value={formulario.aprobado_gerencia}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Área:</label>

        <select
          name="aprobado_area"
          value={formulario.aprobado_area}
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
        </select>

        <label>Fecha:</label>

        <input
          type="date"
          name="aprobado_fecha"
          value={formulario.aprobado_fecha}
          onChange={handleChange}
        />

      </div>

      <div style={{ marginTop: "30px" }}>
        <button className="btn-primary" onClick={guardar}>💾 Guardar encabezado</button>
      </div>
    </div>

  );

}
