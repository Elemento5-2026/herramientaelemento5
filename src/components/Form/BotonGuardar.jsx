import "./BotonGuardar.css";

export default function BotonGuardar({
  texto = "Guardar",
  onClick,
  disabled = false
}) {

  return (

    <div className="boton-guardar">

      <button
        className="btn-primary"
        onClick={onClick}
        disabled={disabled}
      >
        💾 {texto}
      </button>

    </div>

  );

}
