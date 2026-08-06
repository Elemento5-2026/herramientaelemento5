// DataTable.jsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
    showPageSizeSelector = false,
    className = '',
    emptyMessage = 'No hay registros disponibles',
    loading = false,
    onRowClick = null,
    defaultSort = null,
    stickyHeader = false,
    maxHeight = null
}) => {
    // Estados internos
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState(() => {
        if (defaultSort && defaultSort.key) {
            return { key: defaultSort.key, direction: defaultSort.direction || 'asc' };
        }
        return { key: null, direction: 'asc' };
    });
    const [columnFilters, setColumnFilters] = useState({});
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);
    const [activeFilterMenu, setActiveFilterMenu] = useState(null);
    const [filterSearchTerm, setFilterSearchTerm] = useState('');

    // Refs
    const tableWrapperRef = useRef(null);
    const filterMenuRef = useRef(null);

    // Opciones de página
    const pageSizeOptions = [10, 25, 50, 100];

    // ==================== EFECTOS ====================
    
    useEffect(() => {
        if (defaultSort && defaultSort.key) {
            setSortConfig({ 
                key: defaultSort.key, 
                direction: defaultSort.direction || 'asc' 
            });
            setCurrentPage(1);
        }
    }, [defaultSort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [sortConfig, searchTerm, columnFilters]);

    // Cerrar menú de filtros al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setActiveFilterMenu(null);
                setFilterSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ==================== FUNCIONES DE VALOR ====================
    
    const getSortValue = useCallback((row, column) => {
        if (column.sortValue && typeof column.sortValue === 'function') {
            return column.sortValue(row);
        }
        return row[column.key];
    }, []);

    const getSearchValue = useCallback((row, column) => {
        if (column.searchValue && typeof column.searchValue === 'function') {
            return column.searchValue(row);
        }
        return row[column.key];
    }, []);

    const getFilterValue = useCallback((row, column) => {
        if (column.filterValue && typeof column.filterValue === 'function') {
            return column.filterValue(row);
        }
        return row[column.key];
    }, []);

    // ==================== FILTRADO Y BÚSQUEDA ====================
    
    const filteredData = useMemo(() => {
        let result = data;

        // Aplicar filtros por columna (múltiples valores)
        Object.keys(columnFilters).forEach(key => {
            const filterValues = columnFilters[key];
            if (filterValues && filterValues.length > 0) {
                const column = columns.find(col => col.key === key);
                if (column) {
                    result = result.filter(row => {
                        const value = getFilterValue(row, column);
                        if (value === null || value === undefined) return false;
                        const strValue = String(value).toLowerCase();
                        return filterValues.some(filterVal => 
                            strValue === filterVal.toLowerCase()
                        );
                    });
                }
            }
        });

        // Aplicar búsqueda global
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            result = result.filter(row => {
                return columns.some(col => {
                    if (!col.searchable) return false;
                    
                    const value = getSearchValue(row, col);
                    if (value === null || value === undefined) return false;
                    
                    let stringValue = String(value).toLowerCase();
                    
                    if (col.type === 'date' && value instanceof Date) {
                        stringValue = formatDate(value).toLowerCase();
                    }
                    
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

        return result;
    }, [data, searchTerm, columns, columnFilters, getSearchValue, getFilterValue]);

    // ==================== ORDENAMIENTO ====================
    
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        const column = columns.find(col => col.key === sortConfig.key);
        if (!column) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = getSortValue(a, column);
            const bValue = getSortValue(b, column);
            
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
    }, [filteredData, sortConfig, columns, getSortValue]);

    // ==================== PAGINACIÓN ====================
    
    const totalItems = sortedData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (currentPage < 1) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return sortedData;
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, itemsPerPage, showPagination, totalItems]);

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // ==================== UTILIDADES ====================
    
    const formatDate = useCallback((date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return '';
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    }, []);

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

    // ==================== MANEJADORES DE FILTROS ====================
    
    const getUniqueValues = useCallback((columnKey) => {
        const column = columns.find(col => col.key === columnKey);
        if (!column) return [];

        const uniqueValues = new Set();
        data.forEach(row => {
            const value = getFilterValue(row, column);
            if (value !== null && value !== undefined && value !== '') {
                uniqueValues.add(String(value));
            }
        });

        return Array.from(uniqueValues).sort();
    }, [data, columns, getFilterValue]);

    const handleFilterToggle = useCallback((columnKey, value) => {
        setColumnFilters(prev => {
            const currentFilters = prev[columnKey] || [];
            let newFilters;
            
            if (currentFilters.includes(value)) {
                newFilters = currentFilters.filter(v => v !== value);
            } else {
                newFilters = [...currentFilters, value];
            }
            
            if (newFilters.length === 0) {
                const { [columnKey]: _, ...rest } = prev;
                return rest;
            }
            
            return { ...prev, [columnKey]: newFilters };
        });
        setCurrentPage(1);
    }, []);

    const handleSelectAllFilters = useCallback((columnKey) => {
        const uniqueValues = getUniqueValues(columnKey);
        setColumnFilters(prev => {
            if (uniqueValues.length === 0) return prev;
            return { ...prev, [columnKey]: uniqueValues };
        });
        setCurrentPage(1);
    }, [getUniqueValues]);

    const handleClearFilters = useCallback((columnKey) => {
        setColumnFilters(prev => {
            const { [columnKey]: _, ...rest } = prev;
            return rest;
        });
        setActiveFilterMenu(null);
        setFilterSearchTerm('');
        setCurrentPage(1);
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setColumnFilters({});
        setCurrentPage(1);
    }, []);

    const toggleFilterMenu = useCallback((columnKey) => {
        setActiveFilterMenu(prev => prev === columnKey ? null : columnKey);
        setFilterSearchTerm('');
    }, []);

    // ==================== MANEJADORES DE EVENTOS ====================
    
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

    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            if (tableWrapperRef.current) {
                tableWrapperRef.current.scrollTop = 0;
            }
        }
    }, [totalPages]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    const handlePageSizeChange = useCallback((e) => {
        const newSize = parseInt(e.target.value, 10);
        setItemsPerPage(newSize);
        setCurrentPage(1);
    }, []);

    // ==================== RENDER ====================
    
    const wrapperStyle = {};
    if (maxHeight) {
        wrapperStyle.maxHeight = maxHeight;
        wrapperStyle.overflow = 'auto';
    }

    const activeFiltersCount = Object.keys(columnFilters).reduce((acc, key) => 
        acc + (columnFilters[key]?.length || 0), 0
    );

    return (
        <div className={`data-table-container ${className}`}>
            {/* Barra de herramientas */}
            <div className="data-table-toolbar">
                <div className="data-table-toolbar-left">
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
                </div>
                
                <div className="data-table-toolbar-right">
                    <div className="data-table-info">
                        {totalItems > 0 && (
                            <span className="data-table-counter">
                                Mostrando {startItem}-{endItem} de {totalItems} registros
                            </span>
                        )}
                        {activeFiltersCount > 0 && (
                            <button 
                                className="data-table-clear-filters-btn"
                                onClick={handleClearAllFilters}
                            >
                                Limpiar filtros ({activeFiltersCount})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div 
                className={`data-table-wrapper ${stickyHeader ? 'sticky-header' : ''}`}
                ref={tableWrapperRef}
                style={wrapperStyle}
            >
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => {
                                const hasFilter = columnFilters[column.key]?.length > 0;
                                const isFilterActive = activeFilterMenu === column.key;
                                
                                return (
                                    <th
                                        key={column.key}
                                        className={`data-table-header 
                                            ${column.sortable ? 'sortable' : ''}
                                            ${sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}
                                            ${hasFilter ? 'has-filter' : ''}
                                            ${isFilterActive ? 'filter-active' : ''}
                                        `}
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
                                                <span 
                                                    className="data-table-sort-icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSort(column.key);
                                                    }}
                                                >
                                                    {sortConfig.key === column.key ? (
                                                        sortConfig.direction === 'asc' ? '▲' : '▼'
                                                    ) : (
                                                        '⇅'
                                                    )}
                                                </span>
                                            )}
                                            {column.filterable && (
                                                <button 
                                                    className={`data-table-filter-btn ${hasFilter ? 'active' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFilterMenu(column.key);
                                                    }}
                                                >
                                                    {hasFilter ? '●' : '▼'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Menú de filtros */}
                                        {isFilterActive && column.filterable && (
                                            <div 
                                                className="data-table-filter-menu"
                                                ref={filterMenuRef}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="data-table-filter-menu-header">
                                                    <input
                                                        type="text"
                                                        className="data-table-filter-search"
                                                        placeholder="Buscar en filtros..."
                                                        value={filterSearchTerm}
                                                        onChange={(e) => setFilterSearchTerm(e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="data-table-filter-menu-actions">
                                                    <button 
                                                        className="data-table-filter-action-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSelectAllFilters(column.key);
                                                        }}
                                                    >
                                                        Seleccionar todo
                                                    </button>
                                                    <button 
                                                        className="data-table-filter-action-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClearFilters(column.key);
                                                        }}
                                                    >
                                                        Limpiar
                                                    </button>
                                                </div>
                                                <div className="data-table-filter-menu-list">
                                                    {getUniqueValues(column.key)
                                                        .filter(value => 
                                                            value.toLowerCase().includes(filterSearchTerm.toLowerCase())
                                                        )
                                                        .map(value => {
                                                            const isChecked = (columnFilters[column.key] || []).includes(value);
                                                            return (
                                                                <label 
                                                                    key={value} 
                                                                    className="data-table-filter-item"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleFilterToggle(column.key, value)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                    <span>{value}</span>
                                                                </label>
                                                            );
                                                        })
                                                    }
                                                    {getUniqueValues(column.key).filter(value => 
                                                        value.toLowerCase().includes(filterSearchTerm.toLowerCase())
                                                    ).length === 0 && (
                                                        <div className="data-table-filter-empty">
                                                            No hay valores para mostrar
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="data-table-filter-menu-footer">
                                                    <button 
                                                        className="data-table-filter-apply-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveFilterMenu(null);
                                                            setFilterSearchTerm('');
                                                        }}
                                                    >
                                                        Aplicar
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
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
            {showPagination && totalPages > 0 && (
                <div className="data-table-pagination">
                    <div className="data-table-pagination-left">
                        <div className="data-table-pagination-info">
                            Página {currentPage} de {totalPages}
                        </div>
                        {showPageSizeSelector && (
                            <div className="data-table-page-size-selector">
                                <label htmlFor="pageSizeSelect">Registros por página:</label>
                                <select
                                    id="pageSizeSelect"
                                    value={itemsPerPage}
                                    onChange={handlePageSizeChange}
                                    className="data-table-page-size-select"
                                >
                                    {pageSizeOptions.map(size => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
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
