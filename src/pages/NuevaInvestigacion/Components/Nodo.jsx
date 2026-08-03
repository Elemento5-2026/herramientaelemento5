import { Handle, Position } from "reactflow";

export default function Nodo({ data, selected }) {

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
          border: selected
            ? "2px solid #0d6efd"
            : "2px solid #d9d9d9",
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

        {selected && (

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
