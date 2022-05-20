import * as React from 'react';
import { useState, useCallback, useMemo } from 'react';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { convertDataToEntities } from 'rc-tree/lib/utils/treeUtil';
import { conductCheck } from 'rc-tree/lib/utils/conductUtil';
import { arrAdd, arrDel } from 'rc-tree/lib/util';
import { INTERNAL_COL_DEFINE } from 'rc-table';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { Checkbox, Dropdown, Menu, Radio } from 'antd';
import devWarning from '../_util/devWarning';

// TODO: warning if use ajax!!!
export const SELECTION_ALL = 'SELECT_ALL';

export const SELECTION_INVERT = 'SELECT_INVERT';

export const SELECTION_NONE = 'SELECT_NONE';

function getFixedType(column) {
    return column && column.fixed;
}

function flattenData(data, childrenColumnName) {
    let list = [];
    (data || []).forEach(record => {
        list.push(record);

        if (record && typeof record === 'object' && childrenColumnName in record) {
            list = [...list, ...flattenData(record[childrenColumnName], childrenColumnName)];
        }
    });

    return list;
}

export default function useSelection(rowSelection, config) {
    const {
        preserveSelectedRowKeys,
        selectedRowKeys,
        defaultSelectedRowKeys,
        getCheckboxProps,
        onChange: onSelectionChange,
        onSelect,
        onSelectAll,
        onSelectInvert,
        onSelectNone,
        onSelectMultiple,
        columnWidth: selectionColWidth,
        type: selectionType,
        selections,
        fixed,
        renderCell: customizeRenderCell,
        hideSelectAll,
        checkStrictly = true
    } = rowSelection || {};

    const {
        prefixCls,
        data,
        pageData,
        getRecordByKey,
        getRowKey,
        expandType,
        childrenColumnName,
        locale: tableLocale,
        expandIconColumnIndex,
        getPopupContainer
    } = config;

    // ========================= Keys =========================
    const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(
        selectedRowKeys || defaultSelectedRowKeys || [],
        {
            value: selectedRowKeys
        }
    );

    // ======================== Caches ========================
    const preserveRecordsRef = React.useRef(new Map());

    const updatePreserveRecordsCache = useCallback(
        keys => {
            if (preserveSelectedRowKeys) {
                const newCache = new Map();
                // Keep key if mark as preserveSelectedRowKeys
                keys.forEach(key => {
                    let record = getRecordByKey(key);

                    if (!record && preserveRecordsRef.current.has(key)) {
                        record = preserveRecordsRef.current.get(key);
                    }

                    newCache.set(key, record);
                });
                // Refresh to new cache
                preserveRecordsRef.current = newCache;
            }
        },
        [getRecordByKey, preserveSelectedRowKeys]
    );

    // Update cache with selectedKeys
    React.useEffect(() => {
        updatePreserveRecordsCache(mergedSelectedKeys);
    }, [mergedSelectedKeys]);

    const { keyEntities } = useMemo(
        () =>
            checkStrictly
                ? { keyEntities: null }
                : convertDataToEntities(data, {
                      externalGetKey: getRowKey,
                      childrenPropName: childrenColumnName
                  }),
        [data, getRowKey, checkStrictly, childrenColumnName]
    );

    // Get flatten data
    const flattedData = useMemo(() => flattenData(pageData, childrenColumnName), [pageData, childrenColumnName]);

    // Get all checkbox props
    const checkboxPropsMap = useMemo(() => {
        const map = new Map();
        flattedData.forEach((record, index) => {
            const key = getRowKey(record, index);
            const checkboxProps = (getCheckboxProps ? getCheckboxProps(record) : null) || {};
            map.set(key, checkboxProps);

            if (
                process.env.NODE_ENV !== 'production' &&
                ('checked' in checkboxProps || 'defaultChecked' in checkboxProps)
            ) {
                devWarning(
                    false,
                    'Table',
                    'Do not set `checked` or `defaultChecked` in `getCheckboxProps`. Please use `selectedRowKeys` instead.'
                );
            }
        });
        return map;
    }, [flattedData, getRowKey, getCheckboxProps]);

    const isCheckboxDisabled = useCallback(
        r => !!checkboxPropsMap.get(getRowKey(r))?.disabled,
        [checkboxPropsMap, getRowKey]
    );

    const [derivedSelectedKeys, derivedHalfSelectedKeys] = useMemo(() => {
        if (checkStrictly) {
            return [mergedSelectedKeys || [], []];
        }
        const { checkedKeys, halfCheckedKeys } = conductCheck(
            mergedSelectedKeys,
            true,
            keyEntities,
            isCheckboxDisabled
        );
        return [checkedKeys || [], halfCheckedKeys];
    }, [mergedSelectedKeys, checkStrictly, keyEntities, isCheckboxDisabled]);

    const derivedSelectedKeySet = useMemo(() => {
        const keys = selectionType === 'radio' ? derivedSelectedKeys.slice(0, 1) : derivedSelectedKeys;
        return new Set(keys);
    }, [derivedSelectedKeys, selectionType]);
    const derivedHalfSelectedKeySet = useMemo(
        () => (selectionType === 'radio' ? new Set() : new Set(derivedHalfSelectedKeys)),
        [derivedHalfSelectedKeys, selectionType]
    );

    // Save last selected key to enable range selection
    const [lastSelectedKey, setLastSelectedKey] = useState(null);

    // Reset if rowSelection reset
    React.useEffect(() => {
        if (!rowSelection) {
            setMergedSelectedKeys([]);
        }
    }, [!!rowSelection]);

    const setSelectedKeys = useCallback(
        keys => {
            let availableKeys;
            let records;

            updatePreserveRecordsCache(keys);

            if (preserveSelectedRowKeys) {
                availableKeys = keys;
                records = keys.map(key => preserveRecordsRef.current.get(key));
            } else {
                // Filter key which not exist in the `dataSource`
                availableKeys = [];
                records = [];

                keys.forEach(key => {
                    const record = getRecordByKey(key);
                    if (record !== undefined) {
                        availableKeys.push(key);
                        records.push(record);
                    }
                });
            }

            setMergedSelectedKeys(availableKeys);

            onSelectionChange?.(availableKeys, records);
        },
        [setMergedSelectedKeys, getRecordByKey, onSelectionChange, preserveSelectedRowKeys]
    );

    // ====================== Selections ======================
    // Trigger single `onSelect` event
    const triggerSingleSelection = useCallback(
        (key, selected, keys, event) => {
            if (onSelect) {
                const rows = keys.map(k => getRecordByKey(k));
                onSelect(getRecordByKey(key), selected, rows, event);
            }

            setSelectedKeys(keys);
        },
        [onSelect, getRecordByKey, setSelectedKeys]
    );

    const mergedSelections = useMemo(() => {
        if (!selections || hideSelectAll) {
            return null;
        }

        const selectionList = selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections;

        return selectionList.map(selection => {
            if (selection === SELECTION_ALL) {
                return {
                    key: 'all',
                    text: tableLocale.selectionAll,
                    onSelect() {
                        setSelectedKeys(
                            data
                                .map((record, index) => getRowKey(record, index))
                                .filter(key => {
                                    const checkProps = checkboxPropsMap.get(key);
                                    return !checkProps?.disabled || derivedSelectedKeySet.has(key);
                                })
                        );
                    }
                };
            }
            if (selection === SELECTION_INVERT) {
                return {
                    key: 'invert',
                    text: tableLocale.selectInvert,
                    onSelect() {
                        const keySet = new Set(derivedSelectedKeySet);
                        pageData.forEach((record, index) => {
                            const key = getRowKey(record, index);
                            const checkProps = checkboxPropsMap.get(key);

                            if (!checkProps?.disabled) {
                                if (keySet.has(key)) {
                                    keySet.delete(key);
                                } else {
                                    keySet.add(key);
                                }
                            }
                        });

                        const keys = Array.from(keySet);
                        if (onSelectInvert) {
                            devWarning(
                                false,
                                'Table',
                                '`onSelectInvert` will be removed in future. Please use `onChange` instead.'
                            );
                            onSelectInvert(keys);
                        }

                        setSelectedKeys(keys);
                    }
                };
            }
            if (selection === SELECTION_NONE) {
                return {
                    key: 'none',
                    text: tableLocale.selectNone,
                    onSelect() {
                        onSelectNone?.();
                        setSelectedKeys(
                            Array.from(derivedSelectedKeySet).filter(key => {
                                const checkProps = checkboxPropsMap.get(key);
                                return checkProps?.disabled;
                            })
                        );
                    }
                };
            }
            return selection;
        });
    }, [selections, derivedSelectedKeySet, pageData, getRowKey, onSelectInvert, setSelectedKeys]);

    // ======================= Columns ========================
    const transformColumns = useCallback(
        columns => {
            if (!rowSelection) {
                return columns;
            }

            // Support selection
            const keySet = new Set(derivedSelectedKeySet);

            // Record key only need check with enabled
            const recordKeys = flattedData.map(getRowKey).filter(key => !checkboxPropsMap.get(key).disabled);
            const checkedCurrentAll = recordKeys.every(key => keySet.has(key));
            const checkedCurrentSome = recordKeys.some(key => keySet.has(key));

            const onSelectAllChange = () => {
                const changeKeys = [];

                if (checkedCurrentAll) {
                    recordKeys.forEach(key => {
                        keySet.delete(key);
                        changeKeys.push(key);
                    });
                } else {
                    recordKeys.forEach(key => {
                        if (!keySet.has(key)) {
                            keySet.add(key);
                            changeKeys.push(key);
                        }
                    });
                }

                const keys = Array.from(keySet);

                onSelectAll?.(
                    !checkedCurrentAll,
                    keys.map(k => getRecordByKey(k)),
                    changeKeys.map(k => getRecordByKey(k))
                );

                setSelectedKeys(keys);
            };

            // ===================== Render =====================
            // Title Cell
            let title;
            if (selectionType !== 'radio') {
                let customizeSelections;
                if (mergedSelections) {
                    const menu = (
                        <Menu getPopupContainer={getPopupContainer}>
                            {mergedSelections.map((selection, index) => {
                                const { key, text, onSelect: onSelectionClick } = selection;
                                return (
                                    <Menu.Item
                                        key={key || index}
                                        onClick={() => {
                                            onSelectionClick?.(recordKeys);
                                        }}
                                    >
                                        {text}
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    );
                    customizeSelections = (
                        <div className={`${prefixCls}-selection-extra`}>
                            <Dropdown overlay={menu} getPopupContainer={getPopupContainer}>
                                <span>
                                    <DownOutlined />
                                </span>
                            </Dropdown>
                        </div>
                    );
                }

                const allDisabledData = flattedData
                    .map((record, index) => {
                        const key = getRowKey(record, index);
                        const checkboxProps = checkboxPropsMap.get(key) || {};
                        return { checked: keySet.has(key), ...checkboxProps };
                    })
                    .filter(({ disabled }) => disabled);

                const allDisabled = !!allDisabledData.length && allDisabledData.length === flattedData.length;

                const allDisabledAndChecked = allDisabled && allDisabledData.every(({ checked }) => checked);
                const allDisabledSomeChecked = allDisabled && allDisabledData.some(({ checked }) => checked);

                title = !hideSelectAll && (
                    <div className={`${prefixCls}-selection`}>
                        <Checkbox
                            checked={!allDisabled ? !!flattedData.length && checkedCurrentAll : allDisabledAndChecked}
                            indeterminate={
                                !allDisabled
                                    ? !checkedCurrentAll && checkedCurrentSome
                                    : !allDisabledAndChecked && allDisabledSomeChecked
                            }
                            onChange={onSelectAllChange}
                            disabled={flattedData.length === 0 || allDisabled}
                            skipGroup
                        />
                        {customizeSelections}
                    </div>
                );
            }

            // Body Cell
            let renderCell;
            if (selectionType === 'radio') {
                renderCell = (_, record, index) => {
                    const key = getRowKey(record, index);
                    const checked = keySet.has(key);

                    return {
                        node: (
                            <Radio
                                {...checkboxPropsMap.get(key)}
                                checked={checked}
                                onClick={e => e.stopPropagation()}
                                onChange={event => {
                                    if (!keySet.has(key)) {
                                        triggerSingleSelection(key, true, [key], event.nativeEvent);
                                    }
                                }}
                            />
                        ),
                        checked
                    };
                };
            } else {
                renderCell = (_, record, index) => {
                    const key = getRowKey(record, index);
                    const checked = keySet.has(key);
                    const indeterminate = derivedHalfSelectedKeySet.has(key);
                    const checkboxProps = checkboxPropsMap.get(key);
                    let mergedIndeterminate;
                    if (expandType === 'nest') {
                        mergedIndeterminate = indeterminate;
                        devWarning(
                            typeof checkboxProps?.indeterminate !== 'boolean',
                            'Table',
                            'set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.'
                        );
                    } else {
                        mergedIndeterminate = checkboxProps?.indeterminate ?? indeterminate;
                    }
                    // Record checked
                    return {
                        node: (
                            <Checkbox
                                {...checkboxProps}
                                indeterminate={mergedIndeterminate}
                                checked={checked}
                                skipGroup
                                onClick={e => e.stopPropagation()}
                                onChange={({ nativeEvent }) => {
                                    const { shiftKey } = nativeEvent;

                                    let startIndex = -1;
                                    let endIndex = -1;

                                    // Get range of this
                                    if (shiftKey && checkStrictly) {
                                        const pointKeys = new Set([lastSelectedKey, key]);

                                        recordKeys.some((recordKey, recordIndex) => {
                                            if (pointKeys.has(recordKey)) {
                                                if (startIndex === -1) {
                                                    startIndex = recordIndex;
                                                } else {
                                                    endIndex = recordIndex;
                                                    return true;
                                                }
                                            }

                                            return false;
                                        });
                                    }

                                    if (endIndex !== -1 && startIndex !== endIndex && checkStrictly) {
                                        // Batch update selections
                                        const rangeKeys = recordKeys.slice(startIndex, endIndex + 1);
                                        const changedKeys = [];

                                        if (checked) {
                                            rangeKeys.forEach(recordKey => {
                                                if (keySet.has(recordKey)) {
                                                    changedKeys.push(recordKey);
                                                    keySet.delete(recordKey);
                                                }
                                            });
                                        } else {
                                            rangeKeys.forEach(recordKey => {
                                                if (!keySet.has(recordKey)) {
                                                    changedKeys.push(recordKey);
                                                    keySet.add(recordKey);
                                                }
                                            });
                                        }

                                        const keys = Array.from(keySet);
                                        onSelectMultiple?.(
                                            !checked,
                                            keys.map(recordKey => getRecordByKey(recordKey)),
                                            changedKeys.map(recordKey => getRecordByKey(recordKey))
                                        );

                                        setSelectedKeys(keys);
                                    } else {
                                        // Single record selected
                                        const originCheckedKeys = derivedSelectedKeys;
                                        if (checkStrictly) {
                                            const checkedKeys = checked
                                                ? arrDel(originCheckedKeys, key)
                                                : arrAdd(originCheckedKeys, key);
                                            triggerSingleSelection(key, !checked, checkedKeys, nativeEvent);
                                        } else {
                                            // Always fill first
                                            const result = conductCheck(
                                                [...originCheckedKeys, key],
                                                true,
                                                keyEntities,
                                                isCheckboxDisabled
                                            );
                                            const { checkedKeys, halfCheckedKeys } = result;
                                            let nextCheckedKeys = checkedKeys;

                                            // If remove, we do it again to correction
                                            if (checked) {
                                                const tempKeySet = new Set(checkedKeys);
                                                tempKeySet.delete(key);
                                                nextCheckedKeys = conductCheck(
                                                    Array.from(tempKeySet),
                                                    { checked: false, halfCheckedKeys },
                                                    keyEntities,
                                                    isCheckboxDisabled
                                                ).checkedKeys;
                                            }

                                            triggerSingleSelection(key, !checked, nextCheckedKeys, nativeEvent);
                                        }
                                    }

                                    setLastSelectedKey(key);
                                }}
                            />
                        ),
                        checked
                    };
                };
            }

            const renderSelectionCell = (_, record, index) => {
                const { node, checked } = renderCell(_, record, index);

                if (customizeRenderCell) {
                    return customizeRenderCell(checked, record, index, node);
                }

                return node;
            };

            // Columns
            const selectionColumn = {
                width: selectionColWidth,
                className: `${prefixCls}-selection-column`,
                title: rowSelection.columnTitle || title,
                render: renderSelectionCell,
                [INTERNAL_COL_DEFINE]: {
                    className: `${prefixCls}-selection-col`
                }
            };

            if (expandType === 'row' && columns.length && !expandIconColumnIndex) {
                const [expandColumn, ...restColumns] = columns;
                const selectionFixed = fixed || getFixedType(restColumns[0]);
                if (selectionFixed) {
                    expandColumn.fixed = selectionFixed;
                }
                return [expandColumn, { ...selectionColumn, fixed: selectionFixed }, ...restColumns];
            }
            return [{ ...selectionColumn, fixed: fixed || getFixedType(columns[0]) }, ...columns];
        },
        [
            getRowKey,
            flattedData,
            rowSelection,
            derivedSelectedKeys,
            derivedSelectedKeySet,
            derivedHalfSelectedKeySet,
            selectionColWidth,
            mergedSelections,
            expandType,
            lastSelectedKey,
            checkboxPropsMap,
            onSelectMultiple,
            triggerSingleSelection,
            isCheckboxDisabled
        ]
    );

    return [transformColumns, derivedSelectedKeySet];
}
