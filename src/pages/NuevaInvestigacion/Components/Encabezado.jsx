import { useState } from "react";
import "./styles/Encabezado.css";

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

        <label>Código Controlado del Tratamiento de Falla por Incidente</label>

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

        <textarea
          rows="3"
          name="participantes"
          value={formulario.participantes}
          onChange={handleChange}
          placeholder="Ejemplo: Pablo Hernández, José Suruy, Alejandro Fonseca..."
        />

      </div>

      <div className="bloque">

        <h3>Elaboró</h3>

        <div className="grid-5">

          <input
            type="text"
            placeholder="Nombre"
            name="elaborado_nombre"
            value={formulario.elaborado_nombre}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Puesto"
            name="elaborado_puesto"
            value={formulario.elaborado_puesto}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Gerencia"
            name="elaborado_gerencia"
            value={formulario.elaborado_gerencia}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Área"
            name="elaborado_area"
            value={formulario.elaborado_area}
            onChange={handleChange}
          />

          <input
            type="date"
            name="elaborado_fecha"
            value={formulario.elaborado_fecha}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="bloque">

        <h3>Revisó</h3>

        <div className="grid-5">

          <input
            type="text"
            placeholder="Nombre"
            name="revisado_nombre"
            value={formulario.revisado_nombre}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Puesto"
            name="revisado_puesto"
            value={formulario.revisado_puesto}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Gerencia"
            name="revisado_gerencia"
            value={formulario.revisado_gerencia}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Área"
            name="revisado_area"
            value={formulario.revisado_area}
            onChange={handleChange}
          />

          <input
            type="date"
            name="revisado_fecha"
            value={formulario.revisado_fecha}
            onChange={handleChange}
          />

        </div>

      </div>

      <div className="bloque">

        <h3>Aprobó</h3>

        <div className="grid-5">

          <input
            type="text"
            placeholder="Nombre"
            name="aprobado_nombre"
            value={formulario.aprobado_nombre}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Puesto"
            name="aprobado_puesto"
            value={formulario.aprobado_puesto}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Gerencia"
            name="aprobado_gerencia"
            value={formulario.aprobado_gerencia}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Área"
            name="aprobado_area"
            value={formulario.aprobado_area}
            onChange={handleChange}
          />

          <input
            type="date"
            name="aprobado_fecha"
            value={formulario.aprobado_fecha}
            onChange={handleChange}
          />

        </div>

      </div>

    </div>

  );

}
