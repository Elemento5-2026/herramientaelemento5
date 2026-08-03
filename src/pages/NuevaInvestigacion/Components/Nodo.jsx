import { Handle, Position } from "reactflow";

export default function Nodo({ data }) {

  return (

    <>

      <Handle
        type="target"
        position={Position.Top}
      />

      <div
        style={{
          width: 320,
          background: "#fff",
          border: "2px solid #222",
          borderRadius: 12,
          padding: 14,
          boxShadow: "0 3px 10px rgba(0,0,0,.12)"
        }}
      >

        <textarea

          rows={4}

          placeholder="Escriba la causa..."

          defaultValue={data.label}

          style={{
            width: "100%",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
            padding: 10,
            resize: "none",
            fontSize: 14,
            boxSizing: "border-box"
          }}

        />

      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />

    </>

  );

}
