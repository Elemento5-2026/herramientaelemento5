import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";

// Nodo personalizado para el árbol
const NodoCausa = ({ data }) => {
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

  const nodeTypes = useMemo(() => ({
    causa: NodoCausa
  }), []);

  // Construir nodos desde los datos de la investigación
  useEffect(() => {
    console.log("=== 🌳 ARBOL CAUSAS DETALLE ===");
    console.log("📊 Datos de arbol_causas:", investigacion?.arbol_causas);
    
    if (investigacion?.arbol_causas && investigacion.arbol_causas.length > 0) {
      const nodos = investigacion.arbol_causas.map((nodo, index) => {
        return {
          id: nodo.id,
          type: 'causa',
          position: {
            x: parseFloat(nodo.posicion_x) || 0,
            y: parseFloat(nodo.posicion_y) || 0
          },
          data: {
            descripcion: nodo.descripcion || 'Sin descripción',
            categoria: nodo.categoria || null,
            orden: nodo.orden || index + 1,
            padre_id: nodo.padre_id || null
          }
        };
      });
      
      console.log("✅ Nodos construidos:", nodos);
      setNodes(nodos);
      setTimeout(() => setFitView(true), 100);
    } else {
      console.log("⚠️ No hay datos de arbol_causas");
      setNodes([]);
    }
  }, [investigacion]);

  // Construir edges (conexiones entre nodos)
  const edges = useMemo(() => {
    console.log("🔄 Recalculando edges...");
    
    if (!nodes || nodes.length === 0) {
      console.log("⚠️ No hay nodos para crear edges");
      return [];
    }
    
    const nodosConPadre = nodes.filter(nodo => nodo.data.padre_id);
    console.log(`📊 Nodos con padre: ${nodosConPadre.length} de ${nodes.length}`);
    
    const edgesGenerados = nodosConPadre
      .map(nodo => {
        console.log(`🔗 Creando edge: ${nodo.data.padre_id} -> ${nodo.id}`);
        return {
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
        };
      });
    
    console.log("✅ Edges generados:", edgesGenerados);
    return edgesGenerados;
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
      <div className="detalle-card">
        <h3>🌳 Análisis de causas</h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#6B7280',
          border: '2px dashed #E5E7EB',
          borderRadius: '8px',
          minHeight: '300px'
        }}>
          <span style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.6 }}>🌳</span>
          <p style={{ margin: 0, fontSize: '16px', color: '#9CA3AF' }}>No hay causas registradas para esta investigación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`detalle-card ${fullscreen ? 'fullscreen' : ''}`}>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h3 style={{ margin: 0, color: '#1F2937', fontSize: '18px' }}>🌳 Análisis de causas</h3>
          <span style={{ 
            fontSize: '12px', 
            color: '#6B7280', 
            background: '#F3F4F6', 
            padding: '2px 12px', 
            borderRadius: '12px' 
          }}>
            {nodes.length} nodos
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-secondary" 
            onClick={centrarArbol}
            style={{
              background: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#4B5563',
              fontSize: '14px'
            }}
          >
            🧭 Centrar
          </button>
          <button 
            className="btn-primary" 
            onClick={toggleFullscreen}
            style={{
              background: '#3B82F6',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'white',
              fontSize: '14px'
            }}
          >
            {fullscreen ? '🗗 Restaurar' : '⛶ Pantalla completa'}
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
        padding: '10px 14px',
        background: '#F9FAFB',
        borderRadius: '6px',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: '#FEE2E2',
          color: '#991B1B'
        }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', display: 'inline-block', background: '#DC2626', border: '1px solid rgba(0,0,0,0.1)' }}></span>
          Condición física
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: '#DBEAFE',
          color: '#1E40AF'
        }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', display: 'inline-block', background: '#2563EB', border: '1px solid rgba(0,0,0,0.1)' }}></span>
          Comportamiento
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: '#FEF3C7',
          color: '#92400E'
        }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', display: 'inline-block', background: '#D97706', border: '1px solid rgba(0,0,0,0.1)' }}></span>
          Procedimiento / Sistema
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: '#F3F4F6',
          color: '#4B5563'
        }}>
          <span style={{ width: '14px', height: '14px', borderRadius: '50%', display: 'inline-block', background: '#9CA3AF', border: '1px solid rgba(0,0,0,0.1)' }}></span>
          Sin categoría
        </div>
      </div>

      <div 
        ref={reactFlowWrapper}
        style={{
          width: '100%',
          height: fullscreen ? 'calc(100vh - 200px)' : '500px',
          border: fullscreen ? 'none' : '1px solid #E5E7EB',
          borderRadius: '8px',
          background: '#FAFBFC',
          overflow: 'hidden',
          position: 'relative'
        }}
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
            animated: false,
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

      {fullscreen && (
        <style>{`
          .detalle-card.fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            border-radius: 0;
            padding: 20px;
            background: white;
            overflow: hidden;
          }
        `}</style>
      )}
    </div>
  );
}
