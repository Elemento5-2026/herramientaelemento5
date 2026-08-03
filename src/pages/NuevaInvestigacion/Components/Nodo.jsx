import { Handle, Position } from "reactflow";

export default function Nodo({ data }) {

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
          border: "2px solid #d9d9d9",
          borderRadius: 12,
          padding: 14,
          boxShadow: "0 2px 8px rgba(0,0,0,.10)"
        }}
      >

        <textarea

          rows={4}

          placeholder="Escriba la causa..."

          value={data.label}

          onChange={(e) => {

            if (data.onChange) {

              data.onChange(e.target.value);

            }

          }}

          style={{
            width: "100%",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            padding: 10,
            resize: "none",
            fontSize: 14,
            boxSizing: "border-box",
            outline: "none"
          }}

        />

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
