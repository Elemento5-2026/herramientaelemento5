import { useMemo, useState, useCallback } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from "reactflow";

import "reactflow/dist/style.css";

import "./ArbolCausas.css";

import Nodo from "./Nodo";

export default function ArbolCausas() {

  const nodeTypes = useMemo(() => ({
    causa: Nodo
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      type: "causa",
      position: { x: 500, y: 80 },
      data: {
        label: "Lesión en el dedo meñique de la mano izquierda"
      }
    }
  ]);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const agregarHijo = () => {

    if (!nodoSeleccionado) return;

    const padre = nodes.find(n => n.id === nodoSeleccionado);

    const nuevoId = Date.now().toString();

    const nuevoNodo = {

      id: nuevoId,

      type: "causa",

      position: {

        x: padre.position.x,

        y: padre.position.y + 220

      },

      data: {

        label: ""

      }

    };

    const nuevaLinea = {

      id: `${padre.id}-${nuevoId}`,

      source: padre.id,

      target: nuevoId

    };

    setNodes((nds) => [...nds, nuevoNodo]);

    setEdges((eds) => [...eds, nuevaLinea]);

  };

  return (

    <div className="arbol-causas">

      <div className="leyenda">

        <div className="leyenda-item fisica">

          Condición física

        </div>

        <div className="leyenda-item procedimiento">

          Procedimiento / Sistema

        </div>

        <div className="leyenda-item comportamiento">

          Comportamiento

        </div>

      </div>

      {nodoSeleccionado && (

        <div
          style={{
            marginBottom: 15
          }}
        >

          <button
            className="btn-primary"
            onClick={agregarHijo}
          >

            ➕ Agregar causa

          </button>

        </div>

      )}

      <div className="canvas-arbol">

        <ReactFlow

          nodes={nodes}

          edges={edges}

          nodeTypes={nodeTypes}

          onNodesChange={onNodesChange}

          onEdgesChange={onEdgesChange}

          onConnect={onConnect}

          onNodeClick={(e, node) =>
            setNodoSeleccionado(node.id)
          }

          onPaneClick={() =>
            setNodoSeleccionado(null)
          }

          fitView

        >

          <Background />

          <MiniMap />

          <Controls />

        </ReactFlow>

      </div>

    </div>

  );

}
