import { Handle, Position } from "reactflow";

export default function Nodo({ data, selected }) {
  const colorBorde = {

  fisica: "#28a745",

  procedimiento: "#dc3545",

  comportamiento: "#ffc107"

}[data.tipo] || (selected ? "#0d6efd" : "#d9d9d9");

  return (

    <>

      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0
        }}
      />

      <div
        style={{
          width: 320,
          background: "#fff",
          border: `2px solid ${colorBorde}`,
          borderRadius: 12,
          padding: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,.10)"
        }}
      >

        <textarea

  rows={4}

  placeholder="Escriba la causa..."

  value={data.label}

  onChange={(e) =>
    data.onChange(e.target.value)
  }

  style={{

    width: "100%",

    height: 90,

    border: "1px solid #d9d9d9",

    borderRadius: 8,

    padding: 12,

    resize: "none",

    fontSize: 14,

    fontWeight: 500,

    fontFamily: "Segoe UI",

    lineHeight: "22px",

    textAlign: "center",

    display: "flex",

    justifyContent: "center",

    boxSizing: "border-box",

    outline: "none"

  }}

/>
{data.tipo && (

  <div
    style={{
      marginTop: 10,
      textAlign: "center",
      fontWeight: 600,
      fontSize: 13,
      color: colorBorde
    }}
  >

    {data.tipo === "fisica" && "🟢 Condición física"}

    {data.tipo === "procedimiento" && "🔴 Procedimiento / Sistema"}

    {data.tipo === "comportamiento" && "🟠 Comportamiento"}

  </div>

)}

{selected && (

  <>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 10,
        marginTop: 12
      }}
    >

      <button
        type="button"
        className="btn-primary"
        onClick={data.onAgregarHijo}
      >
        ➕
      </button>

      {data.parentId && (

        <button
          type="button"
          className="btn-delete"
          onClick={data.onEliminar}
        >
          🗑
        </button>

      )}

    </div>

    <button
      type="button"
      style={{
        marginTop: 10,
        width: "100%",
        padding: "8px",
        borderRadius: 8,
        border: "1px solid #0d6efd",
        background: "#fff",
        color: "#0d6efd",
        cursor: "pointer",
        fontWeight: 600
      }}
    >
      🎯 Asignar como causa raíz
    </button>

  </>

)}

      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0
        }}
      />

    </>

  );

}
