import "./Firma.css";

export default function Firma({
    titulo,
    prefijo,
    formulario,
    gerencias,
    handleChange
}) {

    return (

        <div className="firma-row">

            <label>{titulo}:</label>

            <input
                type="text"
                name={`${prefijo}_nombre`}
                value={formulario[`${prefijo}_nombre`]}
                onChange={handleChange}
                placeholder="Nombre"
            />

            <label>Puesto:</label>

            <input
                type="text"
                name={`${prefijo}_puesto`}
                value={formulario[`${prefijo}_puesto`]}
                onChange={handleChange}
                placeholder="Puesto"
            />

            <label>Gerencia:</label>

            <select
                name={`${prefijo}_gerencia`}
                value={formulario[`${prefijo}_gerencia`]}
                onChange={handleChange}
            >

                <option value="">Seleccione...</option>

                {gerencias.map((g) => (

                    <option
                        key={g.id}
                        value={g.id}
                    >
                        {g.nombre}
                    </option>

                ))}

            </select>

            <label>Área:</label>

            <input
                type="text"
                name={`${prefijo}_area`}
                value={formulario[`${prefijo}_area`]}
                onChange={handleChange}
                placeholder="Área"
            />

            <label>Fecha:</label>

            <input
                type="date"
                name={`${prefijo}_fecha`}
                value={formulario[`${prefijo}_fecha`]}
                onChange={handleChange}
            />

        </div>

    );

}
