import { useMemo } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap
} from "reactflow";

import "reactflow/dist/style.css";

import "./ArbolCausas.css";

import Nodo from "./Nodo";

export default function ArbolCausas() {

  const nodeTypes = useMemo(
    () => ({
      causa: Nodo
    }),
    []
  );

  const nodes = [

    {

      id: "1",

      type: "causa",

      position: {

        x: 500,
        y: 80

      },

      data: {

        label: ""

      }

    }

  ];

  const edges = [];

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

          nodes={nodes}

          edges={edges}

          nodeTypes={nodeTypes}

          fitView

        >

          <Background />

          <Controls />

          <MiniMap />

        </ReactFlow>

      </div>

    </div>

  );

}
