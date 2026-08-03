import { useState, useMemo, useCallback } from "react";

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

  const nodeTypes = useMemo(() => ({
    causa: Nodo
  }), []);

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

  //==========================================================
  // EDGES
  //==========================================================

  const edges = useMemo(() => {

    return nodes
      .filter((nodo) => nodo.data.parentId !== null)
      .map((nodo) => ({
        id: `${nodo.data.parentId}-${nodo.id}`,
        source: nodo.data.parentId,
        target: nodo.id
      }));

  }, [nodes]);

  //==========================================================
  // HIJOS
  //==========================================================

  const obtenerHijos = useCallback((lista, idPadre) => {

    return lista.filter(
      (nodo) => nodo.data.parentId === idPadre
    );

  }, []);

  //==========================================================
  // DESCENDIENTES
  //==========================================================

  const obtenerDescendientes = useCallback((lista, idNodo) => {

    const ids = [];

    const recorrer = (padre) => {

      const hijos = lista.filter(
        (n) => n.data.parentId === padre
      );

      hijos.forEach((hijo) => {

        ids.push(hijo.id);

        recorrer(hijo.id);

      });

    };

    recorrer(idNodo);

    return ids;

  }, []);

  //==========================================================
  // LAYOUT
  //==========================================================

  const recalcularLayout = useCallback((lista) => {

    const nuevos = structuredClone(lista);

    const anchos = {};

    //------------------------------------------------------
    // CALCULAR EL ANCHO DE CADA SUBÁRBOL
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
    // ASIGNAR POSICIONES
    //------------------------------------------------------

    const asignarPosiciones = (
      idNodo,
      nivel,
      izquierda
    ) => {

      const nodo = nuevos.find(
        (n) => n.id === idNodo
      );

      if (!nodo) return;

      const ancho = anchos[idNodo];

      nodo.position = {

        x:
          izquierda * DISTANCIA_HORIZONTAL +
          ((ancho - 1) *
            DISTANCIA_HORIZONTAL) /
            2,

        y:
          nivel * DISTANCIA_VERTICAL

      };

      const hijos = nuevos.filter(
        (n) => n.data.parentId === idNodo
      );

      let inicio = izquierda;

      hijos.forEach((hijo) => {

        asignarPosiciones(

          hijo.id,

          nivel + 1,

          inicio

        );

        inicio += anchos[hijo.id];

      });

    };

    asignarPosiciones(

      "1",

      0,

      0

    );

    return nuevos;
    }, []);
      //==========================================================
  // ACTUALIZAR TEXTO
  //==========================================================

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

  //==========================================================
  // AGREGAR HIJO
  //==========================================================

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

  //==========================================================
  // AGREGAR HERMANO
  //==========================================================

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

  //==========================================================
  // ELIMINAR NODO + SUBÁRBOL
  //==========================================================

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

  //==========================================================
  // MOVER NODOS
  //==========================================================

  const onNodesChange = useCallback((changes) => {

    setNodes((anteriores) =>

      applyNodeChanges(

        changes,

        anteriores

      )

    );

  }, []);

  //==========================================================
  // NODOS PARA REACT FLOW
  //==========================================================

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
      //==========================================================
  // RENDER
  //==========================================================

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

          onNodesChange={onNodesChange}

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
