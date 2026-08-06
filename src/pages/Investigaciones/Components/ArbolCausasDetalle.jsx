import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import "./ArbolCausasDetalle.css";

// Nodo personalizado para el árbol
const NodoCausa = ({ data }) => {
  // Colores según categoría
  const getColors = (categoria) => {
    const colores = {
      'fisica': { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B', label: 'Condición física' },
      'comportamiento': { bg: '#DBEAFE', border: '#2563EB', text: '#1E40AF', label: 'Comportamiento' },
      'procedimiento': { bg: '#FEF3C7', border: '#D97706', text: '#92400E', label: 'Procedimiento / Sistema' },
    };
    return colores[categoria] || { bg: '#F3F4F6', border: '#9CA3AF', text: '#4B5563', label: 'Sin categoría' };
  };

  const colors = getColors(data.categoria);

  return (
    <div 
      className="nodo-causa"
      style={{
        background: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '10px 14px',
        minWidth: '180px',
        maxWidth: '220px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative',
        cursor: 'grab',
        transition: 'all 0.2s ease'
      }}
    >
      <div 
        className="nodo-causa-categoria"
        style={{
          fontSize: '9px',
          color: colors.text,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '4px'
        }}
      >
        {colors.label}
      </div>
      <div 
        className="nodo-causa-texto"
        style={{
          fontSize: '13px',
          color: '#1F2937',
          fontWeight: '500',
          lineHeight: '1.4',
          wordWrap: 'break-word'
        }}
      >
        {data.descripcion || 'Sin descripción'}
      </div>
      {data.orden && (
        <div 
          className="nodo-causa-orden"
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#6B7280',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {data.orden}
        </div>
      )}
    </div>
  );
};

export default function ArbolCausasDetalle({ investigacion }) {

  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [fitView, setFitView] = useState(false);

  // Node types
  const nodeTypes = useMemo(() => ({
    causa: NodoCausa
  }), []);

  // Construir nodos desde los datos de la investigación
  useEffect(() => {
    if (investigacion?.arbol_causas && investigacion.arbol_causas.length > 0) {
      const nodos = construirNodos(investigacion.arbol_causas);
      setNodes(nodos);
      setTimeout(() => setFitView(true), 100);
    } else {
      setNodes([]);
    }
  }, [investigacion]);

  // Función para construir nodos en el formato de React Flow
  const construirNodos = (datos) => {
    return datos.map(nodo => ({
      id: nodo.id,
      type: 'causa',
      position: {
        x: parseFloat(nodo.posicion_x) || 0,
        y: parseFloat(nodo.posicion_y) || 0
      },
      data: {
        descripcion: nodo.descripcion,
        categoria: nodo.categoria,
        orden: nodo.orden,
        padre_id: nodo.padre_id
      }
    }));
  };

  // Construir edges (conexiones entre nodos)
  const edges = useMemo(() => {
    if (!nodes || nodes.length === 0) return [];
    
    return nodes
      .filter(nodo => nodo.data.padre_id)
      .map(nodo => ({
        id: `${nodo.data.padre_id}-${nodo.id}`,
        source: nodo.data.padre_id,
        target: nodo.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94A3B8', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94A3B8',
          width: 12,
          height: 12
        }
      }));
  }, [nodes]);

  // Manejar cambios en nodos (solo para arrastre)
  const onNodesChange = useCallback((changes) => {
    setNodes((anteriores) =>
      applyNodeChanges(changes, anteriores)
    );
  }, []);

  // Fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullscreen]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setTimeout(() => {
      reactFlowInstance?.fitView({ padding: 0.25, duration: 500 });
    }, 250);
  };

  const centrarArbol = () => {
    reactFlowInstance?.fitView({ padding: 0.25, duration: 600 });
  };

  // Estado vacío
  if (!investigacion?.arbol_causas || investigacion.arbol_causas.length === 0) {
    return (
      <div className="arbol-causas-detalle">
        <div className="arbol-toolbar">
          <h3>🌳 Análisis de causas</h3>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🌳</div>
          <p>No hay causas registradas para esta investigación.</p>
          <p className="empty-sub">El árbol se construye durante la edición de la investigación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`arbol-causas-detalle ${fullscreen ? 'fullscreen' : ''}`}>
      
      <div className="arbol-toolbar">
        <div className="arbol-toolbar-left">
          <h3>🌳 Análisis de causas</h3>
          <span className="nodos-count">{nodes.length} nodos</span>
        </div>
        <div className="arbol-toolbar-right">
          <button className="btn-secondary" onClick={centrarArbol}>
            🧭 Centrar
          </button>
          <button className="btn-primary" onClick={toggleFullscreen}>
            {fullscreen ? '🗗 Restaurar' : '⛶ Pantalla completa'}
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="leyenda">
        <div className="leyenda-item fisica">
          <span className="leyenda-color" style={{ background: '#DC2626' }}></span>
          Condición física
        </div>
        <div className="leyenda-item comportamiento">
          <span className="leyenda-color" style={{ background: '#2563EB' }}></span>
          Comportamiento
        </div>
        <div className="leyenda-item procedimiento">
          <span className="leyenda-color" style={{ background: '#D97706' }}></span>
          Procedimiento / Sistema
        </div>
        <div className="leyenda-item otro">
          <span className="leyenda-color" style={{ background: '#9CA3AF' }}></span>
          Sin categoría
        </div>
      </div>

      <div 
        ref={reactFlowWrapper}
        className={`canvas-arbol ${fullscreen ? 'fullscreen' : ''}`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onInit={setReactFlowInstance}
          fitView={fitView}
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#94A3B8', strokeWidth: 2 }
          }}
        >
          <Background color="#E5E7EB" gap={20} />
          <MiniMap 
            nodeColor={(node) => {
              const colores = {
                'fisica': '#DC2626',
                'comportamiento': '#2563EB',
                'procedimiento': '#D97706',
              };
              return colores[node.data?.categoria] || '#9CA3AF';
            }}
            maskColor="rgba(0,0,0,0.1)"
          />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
