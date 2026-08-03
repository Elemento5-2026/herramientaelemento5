import { useState, useMemo, useCallback, useRef, useEffect } from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges
} from "reactflow";

import "reactflow/dist/style.css";

import "./ArbolCausas.css";

import Nodo from "./Nodo";

const DISTANCIA_HORIZONTAL = 260;
const DISTANCIA_VERTICAL = 180;

export default function ArbolCausas() {

  //---------------------------------------------------------
  // REFS
  //---------------------------------------------------------

  const reactFlowWrapper = useRef(null);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  //---------------------------------------------------------
  // UI
  //---------------------------------------------------------

  const [fullscreen, setFullscreen] = useState(false);

  //---------------------------------------------------------
  // BLOQUEAR SCROLL DEL BODY EN FULLSCREEN
  //---------------------------------------------------------

  useEffect(() => {

    document.body.style.overflow = fullscreen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [fullscreen]);

  //---------------------------------------------------------
  // NODE TYPES
  //---------------------------------------------------------

  const nodeTypes = useMemo(() => ({
    causa: Nodo
  }), []);

  //---------------------------------------------------------
  // NODES
  //---------------------------------------------------------

  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "causa",
      position: {
        x: 0,
        y: 0
      },
      data: {
        id: "1",
        label: "",
        parentId: null,
        tipo: null
      }
    }
  ]);

  //---------------------------------------------------------
  // EDGES
  //---------------------------------------------------------

  const edges = useMemo(() => {

    return nodes
      .filter((nodo) => nodo.data.parentId)
      .map((nodo) => ({

        id: `${nodo.data.parentId}-${nodo.id}`,

        source: nodo.data.parentId,

        target: nodo.id,

        type: "smoothstep",

        pathOptions: {
          borderRadius: 0
        }

      }));

  }, [nodes]);

  //---------------------------------------------------------
  // FULLSCREEN
  //---------------------------------------------------------

  const toggleFullscreen = () => {

    setFullscreen((anterior) => !anterior);

    setTimeout(() => {

      reactFlowInstance?.fitView({

        padding: 0.25,

        duration: 500

      });

    }, 250);

  };

  //---------------------------------------------------------
  // CENTRAR ÁRBOL
  //---------------------------------------------------------

  const centrarArbol = () => {

    reactFlowInstance?.fitView({

      padding: 0.25,

      duration: 600

    });

  };

  //---------------------------------------------------------
  // DESCENDIENTES
  //---------------------------------------------------------

  const obtenerDescendientes = useCallback((lista, idNodo) => {

    const ids = [];

    const recorrer = (padre) => {

      lista
        .filter((n) => n.data.parentId === padre)
        .forEach((hijo) => {

          ids.push(hijo.id);

          recorrer(hijo.id);

        });

    };

    recorrer(idNodo);

    return ids;

  }, []);

  //---------------------------------------------------------
  // LAYOUT
  //---------------------------------------------------------

  const recalcularLayout = useCallback((lista) => {

    const nuevos = lista.map((nodo) => ({

      ...nodo,

      position: {

        ...nodo.position

      },

      data: {

        ...nodo.data

      }

    }));

    const anchos = {};

    //------------------------------------------------------

    const calcularAncho = (idNodo) => {

      const hijos = nuevos.filter(

        (n) => n.data.parentId === idNodo

      );

      if (hijos.length === 0) {

        anchos[idNodo] = 1;

        return 1;

      }

      let ancho = 0;

      hijos.forEach((hijo) => {

        ancho += calcularAncho(hijo.id);

      });

      anchos[idNodo] = ancho;

      return ancho;

    };

    calcularAncho("1");

    //------------------------------------------------------

    const posicionar = (

      idNodo,

      nivel,

      izquierda

    ) => {

      const nodo = nuevos.find(

        (n) => n.id === idNodo

      );

      if (!nodo) return;

      nodo.position = {

        x:

          izquierda *

            DISTANCIA_HORIZONTAL +

          ((anchos[idNodo] - 1) *

            DISTANCIA_HORIZONTAL) /

            2,

        y:

          nivel *

          DISTANCIA_VERTICAL

      };

      const hijos = nuevos.filter(

        (n) =>

          n.data.parentId === idNodo

      );

      let inicio = izquierda;

      hijos.forEach((hijo) => {

        posicionar(

          hijo.id,

          nivel + 1,

          inicio

        );

        inicio += anchos[hijo.id];

      });

    };

    posicionar(

      "1",

      0,

      0

    );

    return nuevos;

  }, []);

  //---------------------------------------------------------
  // ACTUALIZAR TEXTO
  //---------------------------------------------------------

  const actualizarTexto = useCallback((idNodo, texto) => {

    setNodes((anteriores) =>

      anteriores.map((nodo) =>

        nodo.id === idNodo

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

  }, []);

  //---------------------------------------------------------
  // AGREGAR HIJO
  //---------------------------------------------------------

  const agregarHijo = useCallback((idPadre) => {

    setNodes((anteriores) => {

      const nuevoId = crypto.randomUUID();

      const nuevos = [

        ...anteriores,

        {

          id: nuevoId,

          type: "causa",

          position: {

            x: 0,

            y: 0

          },

          data: {

            id: nuevoId,

            label: "",

            parentId: idPadre,

            tipo: null

          }

        }

      ];

      return recalcularLayout(nuevos);

    });

  }, [recalcularLayout]);

  //---------------------------------------------------------
  // AGREGAR HERMANO
  //---------------------------------------------------------

  const agregarHermano = useCallback((idNodo) => {

    setNodes((anteriores) => {

      const actual = anteriores.find(

        (n) => n.id === idNodo

      );

      if (!actual) return anteriores;

      if (actual.data.parentId === null)
        return anteriores;

      const nuevoId = crypto.randomUUID();

      const nuevos = [

        ...anteriores,

        {

          id: nuevoId,

          type: "causa",

          position: {

            x: 0,

            y: 0

          },

          data: {

            id: nuevoId,

            label: "",

            parentId: actual.data.parentId,

            tipo: null

          }

        }

      ];

      return recalcularLayout(nuevos);

    });

  }, [recalcularLayout]);

  //---------------------------------------------------------
  // ELIMINAR NODO
  //---------------------------------------------------------

  const eliminarNodo = useCallback((idNodo) => {

    if (idNodo === "1") return;

    setNodes((anteriores) => {

      const eliminar = [

        idNodo,

        ...obtenerDescendientes(

          anteriores,

          idNodo

        )

      ];

      const nuevos = anteriores.filter(

        (nodo) =>

          !eliminar.includes(nodo.id)

      );

      return recalcularLayout(nuevos);

    });

  }, [

    obtenerDescendientes,

    recalcularLayout

  ]);

  //---------------------------------------------------------
  // DRAG
  //---------------------------------------------------------

  const onNodesChange = useCallback((changes) => {

    setNodes((anteriores) =>

      applyNodeChanges(

        changes,

        anteriores

      )

    );

  }, []);

  //---------------------------------------------------------
  // NODOS RENDER
  //---------------------------------------------------------

  const nodesRender = useMemo(() => {

    return nodes.map((nodo) => ({

      ...nodo,

      data: {

        ...nodo.data,

        onChange: (texto) =>

          actualizarTexto(

            nodo.id,

            texto

          ),

        onAgregarHijo: () =>

          agregarHijo(

            nodo.id

          ),

        onAgregarHermano: () =>

          agregarHermano(

            nodo.id

          ),

        onEliminar: () =>

          eliminarNodo(

            nodo.id

          )

      }

    }));

  }, [

    nodes,

    actualizarTexto,

    agregarHijo,

    agregarHermano,

    eliminarNodo

  ]);

  //---------------------------------------------------------
  // RENDER
  //---------------------------------------------------------

  return (

    <div
      className={
        fullscreen
          ? "arbol-causas fullscreen"
          : "arbol-causas"
      }
    >

      <div className="arbol-toolbar">

        <div>

          <h3>Árbol de causas</h3>

        </div>

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >

          <button
            className="btn-secondary"
            onClick={centrarArbol}
          >

            🧭 Centrar

          </button>

          <button
            className="btn-primary"
            onClick={toggleFullscreen}
          >

            {fullscreen
              ? "🗗 Restaurar"
              : "⛶ Pantalla completa"}

          </button>

        </div>

      </div>

      {!fullscreen && (

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

      )}

      <div
        ref={reactFlowWrapper}
        className={
          fullscreen
            ? "canvas-arbol fullscreen"
            : "canvas-arbol"
        }
      >

        <ReactFlow

          nodes={nodesRender}

          edges={edges}

          nodeTypes={nodeTypes}

          onNodesChange={onNodesChange}

          onInit={setReactFlowInstance}

          fitView

          fitViewOptions={{
            padding: 0.25
          }}

          minZoom={0.20}

          maxZoom={2}

        >

          <Background />

          <MiniMap />

          <Controls />

        </ReactFlow>

      </div>

    </div>

  );

}
