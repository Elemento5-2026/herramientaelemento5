import { useMemo, useState, useCallback } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge
} from "reactflow";

import "reactflow/dist/style.css";

import "./ArbolCausas.css";

import Nodo from "./Nodo";

export default function ArbolCausas() {

  const nodeTypes = useMemo(() => ({
    causa: Nodo
  }), []);

  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "causa",
      position: {
        x: 500,
        y: 80
      },
      data: {
        id: "1",
        label: "",
        parentId: null
      }
    }
  ]);

  const [edges, setEdges] = useState([]);

  const [nodoSeleccionado, setNodoSeleccionado] = useState(null);

  const actualizarTexto = (id, texto) => {

    setNodes((anteriores) =>
      anteriores.map((nodo) =>

        nodo.id === id

          ? {

              ...nodo,

              data: {

                ...nodo.data,

                label: texto

              }

            }

          : nodo

      )

    );

  };

  const agregarHijo = useCallback((idPadre) => {

    const padre = nodes.find((n) => n.id === idPadre);

    if (!padre) return;

    const nuevoId = crypto.randomUUID();

    const nuevoNodo = {

      id: nuevoId,

      type: "causa",

      position: {

        x: padre.position.x,

        y: padre.position.y + 220

      },

      data: {

        id: nuevoId,

        label: "",

        parentId: padre.id

      }

    };

    const nuevaLinea = {

      id: `${padre.id}-${nuevoId}`,

      source: padre.id,

      target: nuevoId

    };

    setNodes((anteriores) => [

      ...anteriores,

      nuevoNodo

    ]);

    setEdges((anteriores) => [

      ...anteriores,

      nuevaLinea

    ]);

  }, [nodes]);

  const eliminarNodo = (id) => {

    if (id === "1") return;

    setNodes((anteriores) =>
      anteriores.filter((n) => n.id !== id)
    );

    setEdges((anteriores) =>
      anteriores.filter(
        (e) => e.source !== id && e.target !== id
      )
    );

  };

  const nodesRender = nodes.map((nodo) => ({

    ...nodo,

    data: {

      ...nodo.data,

      onChange: (texto) =>
        actualizarTexto(nodo.id, texto),

      onAgregarHijo: () =>
        agregarHijo(nodo.id),

      onEliminar: () =>
        eliminarNodo(nodo.id)

    }

  }));
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

      <div className="canvas-arbol">

        <ReactFlow

          nodes={nodesRender}

          edges={edges}

          nodeTypes={nodeTypes}

          onNodeClick={(event, node) =>

            setNodoSeleccionado(node.id)

          }

          onPaneClick={() =>

            setNodoSeleccionado(null)

          }

          onNodesChange={(changes) =>

            setNodes((nds) => {

              return nds.map((node) => {

                const cambio = changes.find(

                  (c) => c.id === node.id

                );

                if (

                  cambio &&

                  cambio.type === "position" &&

                  cambio.position

                ) {

                  return {

                    ...node,

                    position: cambio.position

                  };

                }

                return node;

              });

            })

          }

          onConnect={(params) =>

            setEdges((eds) =>

              addEdge(params, eds)

            )

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
