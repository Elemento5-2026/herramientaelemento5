/* DataTable.css - Estilo Excel/SAP ERP Profesional */

/* ==================== CONTENEDOR PRINCIPAL ==================== */
.data-table-container {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 4px;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif;
    font-size: 13px;
    color: #1e293b;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    height: 100%;
}

/* ==================== BARRA DE HERRAMIENTAS ==================== */
.data-table-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
    border-bottom: 1px solid #e9edf2;
    background: #fafbfc;
}

/* === Búsqueda Global === */
.data-table-search {
    position: relative;
    flex: 1 1 280px;
    min-width: 180px;
}

.data-table-search-input {
    width: 100%;
    padding: 0.45rem 2.2rem 0.45rem 0.9rem;
    font-size: 13px;
    border: 1px solid #d0d7de;
    border-radius: 4px;
    background: #ffffff;
    color: #1e293b;
    transition: all 0.2s ease;
    outline: none;
    height: 34px;
}

.data-table-search-input:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.15);
}

.data-table-search-input::placeholder {
    color: #8b96a5;
}

.data-table-search-clear {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #8b96a5;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.data-table-search-clear:hover {
    background: #f0f0f0;
    color: #dc3545;
}

/* === Contador de Registros === */
.data-table-info {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.data-table-counter {
    font-size: 13px;
    color: #475569;
    background: #f1f5f9;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
    border: 1px solid #e9edf2;
}

/* ==================== WRAPPER DE TABLA ==================== */
.data-table-wrapper {
    overflow-x: auto;
    overflow-y: auto;
    flex: 1;
    min-height: 200px;
    max-height: 600px;
}

.data-table-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.data-table-wrapper::-webkit-scrollbar-track {
    background: #f8f9fa;
}

.data-table-wrapper::-webkit-scrollbar-thumb {
    background: #d0d7de;
    border-radius: 4px;
}

.data-table-wrapper::-webkit-scrollbar-thumb:hover {
    background: #b0b8c0;
}

/* ==================== TABLA ==================== */
.data-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
}

/* === Cabecera === */
.data-table thead {
    background: #f8f9fa;
    position: sticky;
    top: 0;
    z-index: 10;
}

.data-table-header {
    padding: 0.55rem 0.75rem;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #475569;
    border-bottom: 2px solid #e9edf2;
    background: #f8f9fa;
    transition: background 0.15s ease;
    user-select: none;
    white-space: nowrap;
    height: 40px;
    position: relative;
}

.data-table-header.sortable {
    cursor: pointer;
}

.data-table-header.sortable:hover {
    background: #eef2f6;
}

.data-table-header.sorted-asc,
.data-table-header.sorted-desc {
    background: #eef2f6;
    color: #1a73e8;
}

.data-table-header-content {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}

.data-table-header-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.data-table-sort-icon {
    font-size: 10px;
    opacity: 0.4;
    transition: opacity 0.15s ease;
    color: #8b96a5;
}

.data-table-header.sortable:hover .data-table-sort-icon {
    opacity: 0.8;
}

.data-table-header.sorted-asc .data-table-sort-icon,
.data-table-header.sorted-desc .data-table-sort-icon {
    opacity: 1;
    color: #1a73e8;
}

.data-table-filter-indicator {
    display: none;
    width: 6px;
    height: 6px;
    background: #1a73e8;
    border-radius: 50%;
    margin-left: 4px;
}

.data-table-filter-indicator.active {
    display: inline-block;
}

/* === Celdas === */
.data-table-cell {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #f0f2f4;
    color: #1e293b;
    line-height: 1.5;
    vertical-align: middle;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
}

/* Alineación */
.data-table-cell.align-left {
    text-align: left;
}

.data-table-cell.align-center {
    text-align: center;
}

.data-table-cell.align-right {
    text-align: right;
}

/* Tipos específicos */
.data-table-cell.type-number,
.data-table-cell.type-currency {
    font-family: 'Segoe UI', 'Courier New', monospace;
    font-weight: 500;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.data-table-cell.type-date {
    font-family: 'Segoe UI', 'Courier New', monospace;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    letter-spacing: 0.02em;
}

.data-table-cell.type-boolean {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
}

/* === Filas === */
.data-table-row {
    transition: background 0.12s ease;
    height: 38px;
}

.data-table-row.odd {
    background: #ffffff;
}

.data-table-row.even {
    background: #fafbfc;
}

.data-table-row:hover {
    background: #ebf5ff;
}

.data-table-row:last-child .data-table-cell {
    border-bottom: none;
}

/* === Estados Especiales === */
.data-table-empty,
.data-table-loading {
    text-align: center;
    padding: 2.5rem 1rem;
    color: #8b96a5;
    font-size: 14px;
}

.data-table-empty-cell {
    color: #b0b8c0;
}

/* === Spinner de Carga === */
.data-table-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #e9edf2;
    border-top-color: #1a73e8;
    border-radius: 50%;
    animation: dataTableSpin 0.7s linear infinite;
    margin: 0 auto 0.5rem;
}

@keyframes dataTableSpin {
    to { transform: rotate(360deg); }
}

/* ==================== PAGINACIÓN ==================== */
.data-table-pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.6rem 0.5rem;
    border-top: 1px solid #e9edf2;
    background: #fafbfc;
}

.data-table-pagination-info {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
}

.data-table-pagination-controls {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}

.data-table-pagination-btn {
    padding: 0.3rem 0.7rem;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    background: #ffffff;
    border: 1px solid #d0d7de;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    min-width: 32px;
    text-align: center;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.data-table-pagination-btn:hover:not(:disabled) {
    background: #f0f4f8;
    border-color: #b0b8c0;
}

.data-table-pagination-btn:active:not(:disabled) {
    transform: scale(0.95);
}

.data-table-pagination-btn.active {
    background: #1a73e8;
    color: #ffffff;
    border-color: #1a73e8;
    font-weight: 600;
}

.data-table-pagination-btn.active:hover {
    background: #1557b0;
    border-color: #1557b0;
}

.data-table-pagination-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
    .data-table-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
        padding: 0.5rem;
    }
    
    .data-table-search {
        flex: 1 1 auto;
    }
    
    .data-table-info {
        justify-content: flex-start;
    }
    
    .data-table-pagination {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
    }
    
    .data-table-pagination-controls {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .data-table-cell {
        padding: 0.4rem 0.5rem;
        font-size: 12px;
        max-width: 150px;
    }
    
    .data-table-header {
        padding: 0.4rem 0.5rem;
        font-size: 11px;
    }
    
    .data-table-counter {
        font-size: 12px;
        padding: 0.15rem 0.5rem;
    }
    
    .data-table-search-input {
        font-size: 12px;
        padding: 0.35rem 1.8rem 0.35rem 0.7rem;
        height: 30px;
    }
}

@media (max-width: 480px) {
    .data-table-container {
        border-radius: 0;
    }
    
    .data-table-cell {
        font-size: 11px;
        padding: 0.3rem 0.4rem;
        max-width: 100px;
    }
    
    .data-table-header {
        font-size: 10px;
        padding: 0.3rem 0.4rem;
        height: 34px;
    }
    
    .data-table-pagination-btn {
        padding: 0.2rem 0.5rem;
        font-size: 12px;
        min-width: 28px;
        height: 26px;
    }
    
    .data-table-row {
        height: 32px;
    }
}

/* ==================== ACCESIBILIDAD ==================== */
@media (prefers-reduced-motion: reduce) {
    .data-table-row,
    .data-table-header,
    .data-table-pagination-btn,
    .data-table-search-input {
        transition: none !important;
        animation: none !important;
    }
}

/* ==================== PRINT ==================== */
@media print {
    .data-table-container {
        border: 1px solid #d0d7de;
        border-radius: 0;
    }
    
    .data-table-toolbar,
    .data-table-pagination {
        display: none !important;
    }
    
    .data-table-row:hover {
        background: inherit !important;
    }
    
    .data-table-wrapper {
        max-height: none !important;
        overflow: visible !important;
    }
    
    .data-table thead {
        position: static !important;
    }
    
    .data-table-header {
        background: #f0f0f0 !important;
        border-bottom: 1px solid #000 !important;
    }
}
