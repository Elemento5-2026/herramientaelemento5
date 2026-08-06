import { useState, useEffect } from "react";

export default function DescripcionDetalle({ investigacion }) {

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [indiceActual, setIndiceActual] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [erroresImagen, setErroresImagen] = useState({});

  // Filtrar solo imágenes
  const esImagen = (archivo) => {
    const tiposImagen = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
    return tiposImagen.includes(archivo.tipo_archivo) || 
           /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(archivo.nombre_original);
  };

  const evidenciasImagenes = investigacion.descripcion?.evidencias?.filter(esImagen) || [];
  const todasEvidencias = investigacion.descripcion?.evidencias || [];

  // Función para obtener la URL de la imagen
  const obtenerUrlImagen = (archivo) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/investigaciones/${archivo.ruta_storage}`;
    console.log("URL de imagen:", url); // Para debug
    return url;
  };

  // Función para manejar errores de carga de imágenes
  const handleImageError = (archivoId) => {
    setErroresImagen(prev => ({
      ...prev,
      [archivoId]: true
    }));
    console.error(`Error al cargar la imagen con ID: ${archivoId}`);
  };

  useEffect(() => {
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
  }, [imagenSeleccionada]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imagenSeleccionada) return;
      
      if (e.key === 'Escape') cerrarModal();
      if (e.key === 'ArrowLeft') imagenAnterior();
      if (e.key === 'ArrowRight') imagenSiguiente();
      if (e.key === '=' || e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imagenSeleccionada, indiceActual]);

  const abrirImagen = (archivo, index) => {
    setImagenSeleccionada(archivo);
    setIndiceActual(index);
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
  };

  const cerrarModal = () => {
    setImagenSeleccionada(null);
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const imagenAnterior = () => {
    if (evidenciasImagenes.length <= 1) return;
    const nuevoIndice = indiceActual === 0 ? evidenciasImagenes.length - 1 : indiceActual - 1;
    setIndiceActual(nuevoIndice);
    setImagenSeleccionada(evidenciasImagenes[nuevoIndice]);
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
  };

  const imagenSiguiente = () => {
    if (evidenciasImagenes.length <= 1) return;
    const nuevoIndice = indiceActual === evidenciasImagenes.length - 1 ? 0 : indiceActual + 1;
    setIndiceActual(nuevoIndice);
    setImagenSeleccionada(evidenciasImagenes[nuevoIndice]);
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setStartDrag({
        x: e.clientX - posicion.x,
        y: e.clientY - posicion.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosicion({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosicion({ x: 0, y: 0 });
  };

  // Iconos SVG en línea
  const IconCerrar = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  const IconChevronLeft = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const IconChevronRight = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  const IconZoomIn = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  );

  const IconZoomOut = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  );

  return (
    <>
      <div className="detalle-card">
        <h2>Descripción del incidente</h2>
        
        {/* DESCRIPCIÓN - Ahora ocupa todo el ancho */}
        <div className="detalle-item descripcion-full">
          <label>Descripción del incidente</label>
          <div className="descripcion-texto">
            {investigacion.descripcion?.descripcion_incidente || "-"}
          </div>
        </div>

        {/* PARTE DEL CUERPO - Abajo de la descripción */}
        <div className="detalle-item" style={{ marginTop: "16px" }}>
          <label>Parte del cuerpo lesionada</label>
          <span>
            {investigacion.descripcion?.parte_cuerpo?.nombre || 
             investigacion.descripcion?.parte_cuerpo_lesionada_id || 
             "-"}
          </span>
        </div>

        {/* EVIDENCIAS */}
        <div className="detalle-item" style={{ marginTop: "20px" }}>
          <label>Evidencias</label>
          
          {todasEvidencias.length > 0 ? (
            <>
              {evidenciasImagenes.length > 0 && (
                <div className="evidencias-thumbnails">
                  {evidenciasImagenes.map((archivo, index) => (
                    <div 
                      key={archivo.id} 
                      className="thumbnail-container"
                      onClick={() => abrirImagen(archivo, index)}
                    >
                      {!erroresImagen[archivo.id] ? (
                        <img 
                          src={obtenerUrlImagen(archivo)}
                          alt={archivo.nombre_original}
                          className="thumbnail-image"
                          loading="lazy"
                          onError={() => handleImageError(archivo.id)}
                        />
                      ) : (
                        <div className="thumbnail-error">
                          <span>🖼️</span>
                          <span className="thumbnail-error-text">Error al cargar</span>
                        </div>
                      )}
                      <span className="thumbnail-nombre">
                        {archivo.nombre_original}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {todasEvidencias.filter(archivo => !esImagen(archivo)).length > 0 && (
                <div className="evidencias-archivos">
                  <h4>Otros archivos adjuntos:</h4>
                  {todasEvidencias
                    .filter(archivo => !esImagen(archivo))
                    .map((archivo) => (
                      <a
                        key={archivo.id}
                        href={obtenerUrlImagen(archivo)}
                        target="_blank"
                        rel="noreferrer"
                        className="archivo-link"
                      >
                        📎 {archivo.nombre_original}
                      </a>
                    ))}
                </div>
              )}
            </>
          ) : (
            <span>No hay evidencias.</span>
          )}
        </div>
      </div>

      {/* Modal con zoom */}
      {imagenSeleccionada && (
        <div 
          className="modal-overlay" 
          onClick={cerrarModal}
          onWheel={handleWheel}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Controles superiores */}
            <div className="modal-controls-top">
              <button 
                className="modal-close" 
                onClick={cerrarModal}
                aria-label="Cerrar imagen"
              >
                <IconCerrar />
              </button>

              <div className="modal-zoom-controls">
                <button 
                  className="zoom-btn"
                  onClick={zoomOut}
                  aria-label="Alejar"
                  disabled={zoomLevel <= 0.5}
                >
                  <IconZoomOut />
                </button>
                
                <span className="zoom-level">
                  {Math.round(zoomLevel * 100)}%
                </span>
                
                <button 
                  className="zoom-btn"
                  onClick={zoomIn}
                  aria-label="Acercar"
                  disabled={zoomLevel >= 5}
                >
                  <IconZoomIn />
                </button>

                {zoomLevel > 1 && (
                  <button 
                    className="reset-zoom-btn"
                    onClick={resetZoom}
                    aria-label="Resetear zoom"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Navegación lateral */}
            {evidenciasImagenes.length > 1 && (
              <>
                <button 
                  className="modal-nav modal-nav-left" 
                  onClick={imagenAnterior}
                  aria-label="Imagen anterior"
                >
                  <IconChevronLeft />
                </button>
                <button 
                  className="modal-nav modal-nav-right" 
                  onClick={imagenSiguiente}
                  aria-label="Imagen siguiente"
                >
                  <IconChevronRight />
                </button>

                <div className="modal-counter">
                  {indiceActual + 1} / {evidenciasImagenes.length}
                </div>
              </>
            )}

            {/* Contenedor de la imagen con zoom y arrastre */}
            <div 
              className="imagen-container"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
            >
              <img 
                src={obtenerUrlImagen(imagenSeleccionada)}
                alt={imagenSeleccionada.nombre_original}
                className="modal-image"
                style={{
                  transform: `scale(${zoomLevel}) translate(${posicion.x / zoomLevel}px, ${posicion.y / zoomLevel}px)`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease'
                }}
                draggable={false}
                onError={() => {
                  console.error("Error al cargar la imagen en el modal");
                  alert("No se pudo cargar la imagen. Verifica la URL y los permisos de Storage.");
                }}
              />
            </div>

            {/* Nombre de la imagen */}
            <div className="modal-nombre">
              {imagenSeleccionada.nombre_original}
              {zoomLevel > 1 && (
                <span className="modal-info-zoom">
                  • Arrastra para mover
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .detalle-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .detalle-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detalle-item label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .detalle-item span {
          color: #1F2937;
          padding: 8px 12px;
          background: #F9FAFB;
          border-radius: 4px;
          min-height: 38px;
        }

        /* DESCRIPCIÓN - Ocupa todo el ancho */
        .descripcion-full {
          grid-column: 1 / -1;
        }

        .descripcion-texto {
          color: #1F2937;
          padding: 12px 16px;
          background: #F9FAFB;
          border-radius: 4px;
          min-height: 60px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .evidencias-thumbnails {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          margin-top: 8px;
        }

        .thumbnail-container {
          cursor: pointer;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
          background: #F9FAFB;
        }

        .thumbnail-container:hover {
          transform: scale(1.02);
          border-color: #3B82F6;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .thumbnail-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }

        .thumbnail-error {
          width: 100%;
          height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #F3F4F6;
          color: #9CA3AF;
        }

        .thumbnail-error span:first-child {
          font-size: 40px;
        }

        .thumbnail-error-text {
          font-size: 12px;
          margin-top: 8px;
        }

        .thumbnail-nombre {
          display: block;
          padding: 8px 12px;
          font-size: 12px;
          color: #4B5563;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          background: white;
        }

        .evidencias-archivos {
          margin-top: 16px;
          padding: 12px;
          background: #F9FAFB;
          border-radius: 6px;
        }

        .evidencias-archivos h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #374151;
        }

        .archivo-link {
          display: block;
          padding: 6px 12px;
          color: #2563EB;
          text-decoration: none;
          font-size: 13px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .archivo-link:hover {
          background: #EFF6FF;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          position: relative;
          max-width: 95vw;
          max-height: 95vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-controls-top {
          position: absolute;
          top: -60px;
          right: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.6);
          padding: 8px 16px;
          border-radius: 12px;
          backdrop-filter: blur(8px);
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .modal-zoom-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .zoom-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .zoom-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .zoom-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .zoom-level {
          color: white;
          font-size: 13px;
          min-width: 45px;
          text-align: center;
          font-weight: 500;
        }

        .reset-zoom-btn {
          background: rgba(59, 130, 246, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }

        .reset-zoom-btn:hover {
          background: rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
        }

        .imagen-container {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }

        .modal-image {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          transition: transform 0.1s ease;
          will-change: transform;
          pointer-events: none;
        }

        .modal-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-nav:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.1);
        }

        .modal-nav-left {
          left: -56px;
        }

        .modal-nav-right {
          right: -56px;
        }

        .modal-counter {
          position: absolute;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 16px;
          border-radius: 12px;
          font-size: 14px;
          backdrop-filter: blur(4px);
          font-weight: 500;
        }

        .modal-nombre {
          margin-top: 16px;
          color: white;
          font-size: 14px;
          text-align: center;
          max-width: 80%;
          background: rgba(0, 0, 0, 0.6);
          padding: 8px 20px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }

        .modal-info-zoom {
          margin-left: 8px;
          font-size: 12px;
          opacity: 0.7;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .evidencias-thumbnails {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .thumbnail-image {
            height: 120px;
          }

          .modal-nav {
            padding: 8px;
          }

          .modal-nav-left {
            left: -40px;
          }

          .modal-nav-right {
            right: -40px;
          }

          .modal-controls-top {
            top: -50px;
            padding: 6px 12px;
            gap: 8px;
          }

          .modal-counter {
            top: -50px;
            font-size: 12px;
            padding: 4px 12px;
          }

          .modal-nombre {
            font-size: 12px;
            padding: 6px 16px;
          }

          .zoom-btn {
            padding: 3px 6px;
          }

          .zoom-level {
            font-size: 12px;
            min-width: 35px;
          }
        }

        @media (max-width: 480px) {
          .modal-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
