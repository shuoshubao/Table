import * as React from 'react';
import { classNames } from '@nbfe/tools';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import CaretUpOutlined from '@ant-design/icons/CaretUpOutlined';
import { Tooltip } from 'antd';
import { getColumnKey, getColumnPos, renderColumnTitle } from '../util';

const ASCEND = 'ascend';
const DESCEND = 'descend';

function getMultiplePriority(column) {
    if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
        return column.sorter.multiple;
    }
    return false;
}

function getSortFunction(sorter) {
    if (typeof sorter === 'function') {
        return sorter;
    }
    if (sorter && typeof sorter === 'object' && sorter.compare) {
        return sorter.compare;
    }
    return false;
}

function nextSortDirection(sortDirections, current) {
    if (!current) {
        return sortDirections[0];
    }

    return sortDirections[sortDirections.indexOf(current) + 1];
}

function collectSortStates(columns, init, pos) {
    let sortStates = [];

    function pushState(column, columnPos) {
        sortStates.push({
            column,
            key: getColumnKey(column, columnPos),
            multiplePriority: getMultiplePriority(column),
            sortOrder: column.sortOrder
        });
    }

    (columns || []).forEach((column, index) => {
        const columnPos = getColumnPos(index, pos);

        if (column.children) {
            if ('sortOrder' in column) {
                // Controlled
                pushState(column, columnPos);
            }
            sortStates = [...sortStates, ...collectSortStates(column.children, init, columnPos)];
        } else if (column.sorter) {
            if ('sortOrder' in column) {
                // Controlled
                pushState(column, columnPos);
            } else if (init && column.defaultSortOrder) {
                // Default sorter
                sortStates.push({
                    column,
                    key: getColumnKey(column, columnPos),
                    multiplePriority: getMultiplePriority(column),
                    sortOrder: column.defaultSortOrder
                });
            }
        }
    });

    return sortStates;
}

function injectSorter(
    prefixCls,
    columns,
    sorterSates,
    triggerSorter,
    defaultSortDirections,
    tableLocale,
    tableShowSorterTooltip,
    pos
) {
    return (columns || []).map((column, index) => {
        const columnPos = getColumnPos(index, pos);
        let newColumn = column;

        if (newColumn.sorter) {
            const sortDirections = newColumn.sortDirections || defaultSortDirections;
            const showSorterTooltip =
                newColumn.showSorterTooltip === undefined ? tableShowSorterTooltip : newColumn.showSorterTooltip;
            const columnKey = getColumnKey(newColumn, columnPos);
            const sorterState = sorterSates.find(({ key }) => key === columnKey);
            const sorterOrder = sorterState ? sorterState.sortOrder : null;
            const nextSortOrder = nextSortDirection(sortDirections, sorterOrder);
            const upNode = sortDirections.includes(ASCEND) && (
                <CaretUpOutlined
                    className={classNames(`${prefixCls}-column-sorter-up`, {
                        active: sorterOrder === ASCEND
                    })}
                />
            );
            const downNode = sortDirections.includes(DESCEND) && (
                <CaretDownOutlined
                    className={classNames(`${prefixCls}-column-sorter-down`, {
                        active: sorterOrder === DESCEND
                    })}
                />
            );
            const { cancelSort, triggerAsc, triggerDesc } = tableLocale || {};
            let sortTip = cancelSort;
            if (nextSortOrder === DESCEND) {
                sortTip = triggerDesc;
            } else if (nextSortOrder === ASCEND) {
                sortTip = triggerAsc;
            }
            const tooltipProps = typeof showSorterTooltip === 'object' ? showSorterTooltip : { title: sortTip };
            newColumn = {
                ...newColumn,
                className: classNames(newColumn.className, { [`${prefixCls}-column-sort`]: sorterOrder }),
                title: renderProps => {
                    const renderSortTitle = (
                        <div className={`${prefixCls}-column-sorters`}>
                            <span className={`${prefixCls}-column-title`}>
                                {renderColumnTitle(column.title, renderProps)}
                            </span>
                            <span
                                className={classNames(`${prefixCls}-column-sorter`, {
                                    [`${prefixCls}-column-sorter-full`]: !!(upNode && downNode)
                                })}
                            >
                                <span className={`${prefixCls}-column-sorter-inner`}>
                                    {upNode}
                                    {downNode}
                                </span>
                            </span>
                        </div>
                    );
                    return showSorterTooltip ? <Tooltip {...tooltipProps}>{renderSortTitle}</Tooltip> : renderSortTitle;
                },
                onHeaderCell: col => {
                    const cell = (column.onHeaderCell && column.onHeaderCell(col)) || {};
                    const originOnClick = cell.onClick;
                    cell.onClick = event => {
                        triggerSorter({
                            column,
                            key: columnKey,
                            sortOrder: nextSortOrder,
                            multiplePriority: getMultiplePriority(column)
                        });

                        if (originOnClick) {
                            originOnClick(event);
                        }
                    };

                    cell.className = classNames(cell.className, `${prefixCls}-column-has-sorters`);

                    return cell;
                }
            };
        }

        if ('children' in newColumn) {
            newColumn = {
                ...newColumn,
                children: injectSorter(
                    prefixCls,
                    newColumn.children,
                    sorterSates,
                    triggerSorter,
                    defaultSortDirections,
                    tableLocale,
                    tableShowSorterTooltip,
                    columnPos
                )
            };
        }

        return newColumn;
    });
}

function stateToInfo(sorterStates) {
    const { column, sortOrder } = sorterStates;
    return { column, order: sortOrder, field: column.dataIndex, columnKey: column.key };
}

function generateSorterInfo(sorterStates) {
    const list = sorterStates.filter(({ sortOrder }) => sortOrder).map(stateToInfo);

    // =========== Legacy compatible support ===========
    // https://github.com/ant-design/ant-design/pull/19226
    if (list.length === 0 && sorterStates.length) {
        return {
            ...stateToInfo(sorterStates[sorterStates.length - 1]),
            column: undefined
        };
    }

    if (list.length <= 1) {
        return list[0] || {};
    }

    return list;
}

export function getSortData(data, sortStates, childrenColumnName) {
    const innerSorterStates = sortStates.slice().sort((a, b) => b.multiplePriority - a.multiplePriority);

    const cloneData = data.slice();

    const runningSorters = innerSorterStates.filter(
        ({ column: { sorter }, sortOrder }) => getSortFunction(sorter) && sortOrder
    );

    // Skip if no sorter needed
    if (!runningSorters.length) {
        return cloneData;
    }

    return cloneData
        .sort((record1, record2) => {
            for (let i = 0; i < runningSorters.length; i += 1) {
                const sorterState = runningSorters[i];
                const {
                    column: { sorter },
                    sortOrder
                } = sorterState;

                const compareFn = getSortFunction(sorter);

                if (compareFn && sortOrder) {
                    const compareResult = compareFn(record1, record2, sortOrder);

                    if (compareResult !== 0) {
                        return sortOrder === ASCEND ? compareResult : -compareResult;
                    }
                }
            }

            return 0;
        })
        .map(record => {
            const subRecords = record[childrenColumnName];
            if (subRecords) {
                return {
                    ...record,
                    [childrenColumnName]: getSortData(subRecords, sortStates, childrenColumnName)
                };
            }
            return record;
        });
}

export default function useFilterSorter({
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections,
    tableLocale,
    showSorterTooltip
}) {
    const [sortStates, setSortStates] = React.useState(collectSortStates(mergedColumns, true));

    const mergedSorterStates = React.useMemo(() => {
        let validate = true;
        const collectedStates = collectSortStates(mergedColumns, false);

        // Return if not controlled
        if (!collectedStates.length) {
            return sortStates;
        }

        const validateStates = [];

        function patchStates(state) {
            if (validate) {
                validateStates.push(state);
            } else {
                validateStates.push({
                    ...state,
                    sortOrder: null
                });
            }
        }

        let multipleMode = null;
        collectedStates.forEach(state => {
            if (multipleMode === null) {
                patchStates(state);

                if (state.sortOrder) {
                    if (state.multiplePriority === false) {
                        validate = false;
                    } else {
                        multipleMode = true;
                    }
                }
            } else if (multipleMode && state.multiplePriority !== false) {
                patchStates(state);
            } else {
                validate = false;
                patchStates(state);
            }
        });

        return validateStates;
    }, [mergedColumns, sortStates]);

    // Get render columns title required props
    const columnTitleSorterProps = React.useMemo(() => {
        const sortColumns = mergedSorterStates.map(({ column, sortOrder }) => ({
            column,
            order: sortOrder
        }));

        return {
            sortColumns,
            // Legacy
            sortColumn: sortColumns[0] && sortColumns[0].column,
            sortOrder: sortColumns[0] && sortColumns[0].order
        };
    }, [mergedSorterStates]);

    function triggerSorter(sortState) {
        let newSorterStates;

        if (
            sortState.multiplePriority === false ||
            !mergedSorterStates.length ||
            mergedSorterStates[0].multiplePriority === false
        ) {
            newSorterStates = [sortState];
        } else {
            newSorterStates = [...mergedSorterStates.filter(({ key }) => key !== sortState.key), sortState];
        }

        setSortStates(newSorterStates);
        onSorterChange(generateSorterInfo(newSorterStates), newSorterStates);
    }

    const transformColumns = innerColumns => {
        return injectSorter(
            prefixCls,
            innerColumns,
            mergedSorterStates,
            triggerSorter,
            sortDirections,
            tableLocale,
            showSorterTooltip
        );
    };

    const getSorters = () => generateSorterInfo(mergedSorterStates);

    return [transformColumns, mergedSorterStates, columnTitleSorterProps, getSorters];
}
