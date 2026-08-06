// DataTable.jsx - Componente principal
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import FilterMenu from './FilterMenu';
import ExportMenu from './ExportMenu';
import ColumnSelector from './ColumnSelector';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import ActiveFilters from './ActiveFilters';
import { formatDate, getValue, getSortValue, getSearchValue, getFilterValue } from './utils';
import './DataTable.css';

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
    maxHeight = null,
    tableTitle = '',
    tableSubtitle = ''
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
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem('dataTableVisibleColumns');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            } catch (e) {}
        }
        return columns.map(col => col.key);
    });
    const [filteredColumns, setFilteredColumns] = useState({});
    const [showFilterMenu, setShowFilterMenu] = useState(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    // Refs
    const tableWrapperRef = useRef(null);
    const filterMenuRef = useRef(null);
    const exportMenuRef = useRef(null);
    const columnSelectorRef = useRef(null);

    // Opciones de página
    const pageSizeOptions = [10, 25, 50, 100, 200];

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

    useEffect(() => {
        localStorage.setItem('dataTableVisibleColumns', JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setShowFilterMenu(null);
            }
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false);
            }
            if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target)) {
                setShowColumnSelector(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ==================== FILTRADO Y BÚSQUEDA ====================
    
    const filteredData = useMemo(() => {
        let result = data;

        // Aplicar filtros por columna
        Object.keys(columnFilters).forEach(key => {
            const filterValues = columnFilters[key];
            if (filterValues && filterValues.length > 0) {
                const column = columns.find(col => col.key === key);
                if (column) {
                    result = result.filter(row => {
                        const value = getFilterValue(row, column);
                        if (value === null || value === undefined) return false;
                        const strValue = String(value);
                        return filterValues.some(filterVal => 
                            strValue.toLowerCase().includes(filterVal.toLowerCase())
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
    }, [data, searchTerm, columns, columnFilters]);

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
    }, [filteredData, sortConfig, columns]);

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

    // ==================== MANEJADORES ====================
    
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

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setCurrentPage(1);
    }, []);

    const handlePageSizeChange = useCallback((newSize) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    }, []);

    const handleFilterApply = useCallback((columnKey, values) => {
        setColumnFilters(prev => {
            const newFilters = { ...prev };
            if (values && values.length > 0) {
                newFilters[columnKey] = values;
            } else {
                delete newFilters[columnKey];
            }
            return newFilters;
        });
        setShowFilterMenu(null);
        setCurrentPage(1);
    }, []);

    const handleFilterClear = useCallback((columnKey) => {
        setColumnFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[columnKey];
            return newFilters;
        });
        setCurrentPage(1);
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setColumnFilters({});
        setCurrentPage(1);
    }, []);

    const handleColumnToggle = useCallback((columnKey) => {
        setVisibleColumns(prev => {
            if (prev.includes(columnKey)) {
                return prev.filter(key => key !== columnKey);
            } else {
                return [...prev, columnKey];
            }
        });
    }, []);

    const handleColumnReset = useCallback(() => {
        setVisibleColumns(columns.map(col => col.key));
    }, [columns]);

    const handleExport = useCallback(() => {
        setShowExportMenu(false);
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
    }, []);

    // ==================== RENDER ====================
    
    const visibleColumnsList = columns.filter(col => visibleColumns.includes(col.key));
    const activeFilters = Object.keys(columnFilters).filter(key => columnFilters[key]?.length > 0);

    const wrapperStyle = {};
    if (maxHeight) {
        wrapperStyle.maxHeight = maxHeight;
        wrapperStyle.overflow = 'auto';
    }

    return (
        <div className={`data-table-container ${className}`}>
            {/* Barra de herramientas */}
            <div className="data-table-toolbar">
                <div className="data-table-toolbar-left">
                    {showGlobalSearch && (
                        <SearchBar 
                            value={searchTerm}
                            onChange={handleSearch}
                            onClear={clearSearch}
                        />
                    )}
                </div>
                
                <div className="data-table-toolbar-right">
                    <div className="data-table-toolbar-buttons">
                        <button 
                            className="data-table-toolbar-btn"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                        >
                            Exportar ▼
                        </button>
                        <button 
                            className="data-table-toolbar-btn"
                            onClick={() => setShowColumnSelector(!showColumnSelector)}
                        >
                            Columnas ▼
                        </button>
                    </div>
                </div>
            </div>

            {/* Filtros activos */}
            {activeFilters.length > 0 && (
                <ActiveFilters 
                    filters={columnFilters}
                    columns={columns}
                    onClearFilter={handleFilterClear}
                    onClearAll={handleClearAllFilters}
                />
            )}

            {/* Tabla */}
            <div 
                className={`data-table-wrapper ${stickyHeader ? 'sticky-header' : ''}`}
                ref={tableWrapperRef}
                style={wrapperStyle}
            >
                <table className="data-table">
                    <thead>
                        <tr>
                            {visibleColumnsList.map((column) => {
                                const hasFilter = columnFilters[column.key]?.length > 0;
                                return (
                                    <th
                                        key={column.key}
                                        className={`data-table-header 
                                            ${column.sortable ? 'sortable' : ''}
                                            ${sortConfig.key === column.key ? `sorted-${sortConfig.direction}` : ''}
                                            ${hasFilter ? 'has-filter' : ''}
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
                                                    className="data-table-filter-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowFilterMenu(showFilterMenu === column.key ? null : column.key);
                                                    }}
                                                >
                                                    {hasFilter ? '●' : '▼'}
                                                </button>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td 
                                    colSpan={visibleColumnsList.length}
                                    className="data-table-loading"
                                >
                                    <div className="data-table-spinner"></div>
                                    <span>Cargando datos...</span>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={visibleColumnsList.length}
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
                                        {visibleColumnsList.map((column) => (
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    startItem={startItem}
                    endItem={endItem}
                    itemsPerPage={itemsPerPage}
                    pageSizeOptions={pageSizeOptions}
                    showPageSizeSelector={showPageSizeSelector}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            )}

            {/* Menús flotantes */}
            {showFilterMenu && (
                <div ref={filterMenuRef} className="data-table-filter-menu-container">
                    <FilterMenu
                        column={columns.find(col => col.key === showFilterMenu)}
                        data={data}
                        currentFilters={columnFilters[showFilterMenu] || []}
                        onApply={(values) => handleFilterApply(showFilterMenu, values)}
                        onClear={() => handleFilterClear(showFilterMenu)}
                        onClose={() => setShowFilterMenu(null)}
                    />
                </div>
            )}

            {showExportMenu && (
                <div ref={exportMenuRef} className="data-table-export-menu-container">
                    <ExportMenu
                        data={sortedData}
                        columns={visibleColumnsList}
                        tableTitle={tableTitle}
                        tableSubtitle={tableSubtitle}
                        filters={columnFilters}
                        searchTerm={searchTerm}
                        onClose={() => setShowExportMenu(false)}
                    />
                </div>
            )}

            {showColumnSelector && (
                <div ref={columnSelectorRef} className="data-table-column-selector-container">
                    <ColumnSelector
                        columns={columns}
                        visibleColumns={visibleColumns}
                        onToggle={handleColumnToggle}
                        onReset={handleColumnReset}
                        onClose={() => setShowColumnSelector(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default DataTable;
