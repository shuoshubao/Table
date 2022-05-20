import * as React from 'react';
import devWarning from '../../_util/devWarning';
import { getColumnPos, renderColumnTitle, getColumnKey } from '../../util';
import FilterDropdown from './FilterDropdown';

function collectFilterStates(columns, init, pos) {
    let filterStates = [];

    (columns || []).forEach((column, index) => {
        const columnPos = getColumnPos(index, pos);

        if (column.filters || 'filterDropdown' in column || 'onFilter' in column) {
            if ('filteredValue' in column) {
                // Controlled
                let filteredValues = column.filteredValue;
                if (!('filterDropdown' in column)) {
                    filteredValues = filteredValues?.map(String) ?? filteredValues;
                }
                filterStates.push({
                    column,
                    key: getColumnKey(column, columnPos),
                    filteredKeys: filteredValues,
                    forceFiltered: column.filtered
                });
            } else {
                // Uncontrolled
                filterStates.push({
                    column,
                    key: getColumnKey(column, columnPos),
                    filteredKeys: init && column.defaultFilteredValue ? column.defaultFilteredValue : undefined,
                    forceFiltered: column.filtered
                });
            }
        }

        if ('children' in column) {
            filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)];
        }
    });

    return filterStates;
}

function injectFilter(
    prefixCls,
    dropdownPrefixCls,
    columns,
    filterStates,
    triggerFilter,
    getPopupContainer,
    locale,
    pos
) {
    return columns.map((column, index) => {
        const columnPos = getColumnPos(index, pos);
        const { filterMultiple = true, filterMode, filterSearch } = column;

        let newColumn = column;

        if (newColumn.filters || newColumn.filterDropdown) {
            const columnKey = getColumnKey(newColumn, columnPos);
            const filterState = filterStates.find(({ key }) => columnKey === key);

            newColumn = {
                ...newColumn,
                title: renderProps => (
                    <FilterDropdown
                        tablePrefixCls={prefixCls}
                        prefixCls={`${prefixCls}-filter`}
                        dropdownPrefixCls={dropdownPrefixCls}
                        column={newColumn}
                        columnKey={columnKey}
                        filterState={filterState}
                        filterMultiple={filterMultiple}
                        filterMode={filterMode}
                        filterSearch={filterSearch}
                        triggerFilter={triggerFilter}
                        locale={locale}
                        getPopupContainer={getPopupContainer}
                    >
                        {renderColumnTitle(column.title, renderProps)}
                    </FilterDropdown>
                )
            };
        }

        if ('children' in newColumn) {
            newColumn = {
                ...newColumn,
                children: injectFilter(
                    prefixCls,
                    dropdownPrefixCls,
                    newColumn.children,
                    filterStates,
                    triggerFilter,
                    getPopupContainer,
                    locale,
                    columnPos
                )
            };
        }

        return newColumn;
    });
}

export function flattenKeys(filters) {
    let keys = [];
    (filters || []).forEach(({ value, children }) => {
        keys.push(value);
        if (children) {
            keys = [...keys, ...flattenKeys(children)];
        }
    });
    return keys;
}

function generateFilterInfo(filterStates) {
    const currentFilters = {};

    filterStates.forEach(({ key, filteredKeys, column }) => {
        const { filters, filterDropdown } = column;
        if (filterDropdown) {
            currentFilters[key] = filteredKeys || null;
        } else if (Array.isArray(filteredKeys)) {
            const keys = flattenKeys(filters);
            currentFilters[key] = keys.filter(originKey => filteredKeys.includes(String(originKey)));
        } else {
            currentFilters[key] = null;
        }
    });

    return currentFilters;
}

export function getFilterData(data, filterStates) {
    return filterStates.reduce((currentData, filterState) => {
        const {
            column: { onFilter, filters },
            filteredKeys
        } = filterState;
        if (onFilter && filteredKeys && filteredKeys.length) {
            return currentData.filter(record =>
                filteredKeys.some(key => {
                    const keys = flattenKeys(filters);
                    const keyIndex = keys.findIndex(k => String(k) === String(key));
                    const realKey = keyIndex !== -1 ? keys[keyIndex] : key;
                    return onFilter(realKey, record);
                })
            );
        }
        return currentData;
    }, data);
}

function useFilter({
    prefixCls,
    dropdownPrefixCls,
    mergedColumns,
    onFilterChange,
    getPopupContainer,
    locale: tableLocale
}) {
    const [filterStates, setFilterStates] = React.useState(collectFilterStates(mergedColumns, true));

    const mergedFilterStates = React.useMemo(() => {
        const collectedStates = collectFilterStates(mergedColumns, false);

        const filteredKeysIsNotControlled = collectedStates.every(({ filteredKeys }) => filteredKeys === undefined);

        // Return if not controlled
        if (filteredKeysIsNotControlled) {
            return filterStates;
        }

        const filteredKeysIsAllControlled = collectedStates.every(({ filteredKeys }) => filteredKeys !== undefined);

        devWarning(
            filteredKeysIsNotControlled || filteredKeysIsAllControlled,
            'Table',
            '`FilteredKeys` should all be controlled or not controlled.'
        );

        return collectedStates;
    }, [mergedColumns, filterStates]);

    const getFilters = React.useCallback(() => generateFilterInfo(mergedFilterStates), [mergedFilterStates]);

    const triggerFilter = filterState => {
        const newFilterStates = mergedFilterStates.filter(({ key }) => key !== filterState.key);
        newFilterStates.push(filterState);
        setFilterStates(newFilterStates);
        onFilterChange(generateFilterInfo(newFilterStates), newFilterStates);
    };

    const transformColumns = innerColumns =>
        injectFilter(
            prefixCls,
            dropdownPrefixCls,
            innerColumns,
            mergedFilterStates,
            triggerFilter,
            getPopupContainer,
            tableLocale
        );

    return [transformColumns, mergedFilterStates, getFilters];
}

export default useFilter;
