// DataTable.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './DataTable.css';

/**
 * DataTable - Componente de tabla empresarial profesional
 * Diseñado específicamente para sistemas ERP internos
 * Enfocado en simplicidad, rendimiento y facilidad de mantenimiento
 */
const DataTable = ({ 
    columns = [], 
    data = [],
    pageSize = 10,
    showGlobalSearch = true,
    showPagination = true,
    className = '',
    emptyMessage = 'No hay registros disponibles',
    loading = false,
    onRowClick = null
}) => {
    // Estados internos
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [columnFilters, setColumnFilters] = useState({});

    // ==================== FILTRADO Y BÚSQUEDA ====================
    
    /**
     * Filtra los datos aplicando búsqueda global y filtros por columna
     * Solo las columnas marcadas como searchable participan en la búsqueda
     */
    const filteredData = useMemo(() => {
        let result = data;

        // Aplicar búsqueda global
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter(row => {
                return columns.some(col => {
                    // Solo buscar en columnas marcadas como searchable
                    if (!col.searchable) return false;
                    
                    const value = row[col.key];
                    if (value === null || value === undefined) return false;
                    
                    let stringValue = String(value).toLowerCase();
                    
                    // Manejar fechas
                    if (col.type === 'date' && value instanceof Date) {
                        stringValue = formatDate(value).toLowerCase();
                    }
                    
                    // Manejar objetos con render
                    if (col.render) {
                        const rendered = col.render(row);
                        if (typeof rendered === 'string') {
                            stringValue = rendered.toLowerCase();
                        } else if (typeof rendered === 'object' && rendered?.props?.children) {
                            stringValue = String(rendered.props.children).toLowerCase();
                        }
                    }
                    
                    return stringValue.includes(searchLower);
                });
            });
        }

        // Aplicar filtros por columna (preparado para futura implementación)
        // Los filtros se aplicarán cuando se implemente la UI de filtros
        Object.keys(columnFilters).forEach(key => {
            const filterValue = columnFilters[key];
            if (filterValue && filterValue !== '') {
                result = result.filter(row => {
                    const value = row[key];
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(filterValue.toLowerCase());
                });
            }
        });

        return result;
    }, [data, searchTerm, columns, columnFilters]);

    // ==================== ORDENAMIENTO ====================
    
    /**
     * Ordena los datos según la configuración actual
     * Soporta múltiples tipos de datos: string, number, date, boolean
     */
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            
            const column = columns.find(col => col.key === sortConfig.key);
            const type = column?.type || 'string';
            
            let comparison = 0;
            
            switch (type) {
                case 'number':
                    comparison = (aValue || 0) - (bValue || 0);
                    break;
                case 'date':
                    const aDate = aValue instanceof Date ? aValue : new Date(aValue);
                    const bDate = bValue instanceof Date ? bValue : new Date(bValue);
                    comparison = aDate.getTime() - bDate.getTime();
                    break;
                case 'boolean':
                    comparison = (aValue ? 1 : 0) - (bValue ? 1 : 0);
                    break;
                default:
                    const aStr = String(aValue || '').toLowerCase();
                    const bStr = String(bValue || '').toLowerCase();
                    comparison = aStr.localeCompare(bStr, 'es', { sensitivity: 'base' });
                    break;
            }
            
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortConfig, columns]);

    // ==================== PAGINACIÓN ====================
    
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return sortedData;
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize, showPagination, totalItems]);

    // Calcular índices para mostrar
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    // ==================== UTILIDADES ====================
    
    /**
     * Formatea fechas en formato dd/MM/yyyy (Guatemala)
     */
    const formatDate = useCallback((date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    }, []);

    /**
     * Renderiza el contenido de una celda
     * Soporta render personalizado y formateo automático
     */
    const renderCell = useCallback((row, column) => {
        if (column.render) {
            return column.render(row);
        }

        const value = row[column.key];
        
        if (value === null || value === undefined) {
            return <span className="data-table-empty-cell">-</span>;
        }

        switch (column.type) {
            case 'date':
                return formatDate(value);
            case 'number':
                return typeof value === 'number' 
                    ? value.toLocaleString('es-GT') 
                    : value;
            case 'currency':
                return new Intl.NumberFormat('es-GT', {
                    style: 'currency',
                    currency: column.currency || 'GTQ'
                }).format(value);
            case 'boolean':
                return value ? '✓' : '✗';
            default:
                return value;
        }
    }, [formatDate]);

    // ==================== MANEJADORES DE EVENTOS ====================
    
    /**
     * Maneja el ordenamiento de columnas
     * Alterna entre asc, desc, y null
     */
    const handleSort = useCallback((key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                if (prev.direction === 'asc') {
                    return { key, direction: 'desc' };
                } else if (prev.direction === 'desc') {
                    return { key: null, direction: 'asc' };
                }
            }
            return { key, direction: 'asc' };
        });
    }, []);

    /**
     * Maneja el cambio de página
     */
    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    /**
     * Maneja la búsqueda global
     */
    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    /**
     * Limpia la búsqueda
     */
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    // ==================== RENDERIZADO ====================
    
    return (
        <div className={`data-table-container ${className}`}>
            {/* Barra de herramientas */}
            <div className="data-table-toolbar">
                {showGlobalSearch && (
                    <div className="data-table-search">
                        <input
                            type="text"
                            className="data-table-search-input"
                            placeholder="Buscar en toda la tabla..."
                            value={searchTerm}
                            onChange={handleSearch}
                            aria-label="Búsqueda global"
                        />
                        {searchTerm && (
                            <button 
                                className="data-table-search-clear"
                                onClick={clearSearch}
                                aria-label="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                )}
                
                <div className="data-table-info">
                    {totalItems > 0 && (
                        <span className="data-table-counter">
                            Mostrando {startItem}-{endItem} de {totalItems} registros
                        </span>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`data-table-header 
                                        ${column.sortable ? 'sortable' : ''}
                                        ${sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}
                                    `}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                    style={{ 
                                        width: column.width || 'auto',
                                        minWidth: column.minWidth || '50px',
                                        maxWidth: column.maxWidth || 'none'
                                    }}
                                >
                                    <div className="data-table-header-content">
                                        <span className="data-table-header-title">
                                            {column.title}
                                        </span>
                                        {column.sortable && (
                                            <span className="data-table-sort-icon">
                                                {sortConfig.key === column.key ? (
                                                    sortConfig.direction === 'asc' ? '▲' : '▼'
                                                ) : (
                                                    '⇅'
                                                )}
                                            </span>
                                        )}
                                        {/* Preparado para futuros filtros */}
                                        {column.filterable && (
                                            <span className="data-table-filter-indicator" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="data-table-loading"
                                >
                                    <div className="data-table-spinner"></div>
                                    <span>Cargando datos...</span>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={columns.length}
                                    className="data-table-empty"
                                >
                                    {searchTerm ? 'No se encontraron resultados para la búsqueda' : emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => {
                                const rowId = row.id || row._id || row.codigo || `row-${index}`;
                                
                                return (
                                    <tr
                                        key={rowId}
                                        className={`data-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={`${rowId}-${column.key}`}
                                                className={`data-table-cell 
                                                    ${column.align ? `align-${column.align}` : ''}
                                                    ${column.type ? `type-${column.type}` : ''}
                                                `}
                                            >
                                                {renderCell(row, column)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {showPagination && totalPages > 1 && (
                <div className="data-table-pagination">
                    <div className="data-table-pagination-info">
                        Página {currentPage} de {totalPages}
                    </div>
                    <div className="data-table-pagination-controls">
                        <button
                            className="data-table-pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Página anterior"
                        >
                            ‹
                        </button>
                        
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            
                            return (
                                <button
                                    key={pageNum}
                                    className={`data-table-pagination-btn 
                                        ${currentPage === pageNum ? 'active' : ''}
                                    `}
                                    onClick={() => handlePageChange(pageNum)}
                                    aria-label={`Ir a página ${pageNum}`}
                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        
                        <button
                            className="data-table-pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Página siguiente"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
