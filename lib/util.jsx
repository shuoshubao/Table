import React from 'react';
import { version, Table, Radio, Checkbox, TreeSelect, Button } from './antd';
import FilterFilled from '@ant-design/icons/FilterFilled';
import { cloneDeep, isEqual, isUndefined, kebabCase, merge, filter, find, inRange } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';

export const isAntdV3 = inRange(parseInt(version), 3, 4);

export const isAntdV4 = inRange(parseInt(version), 4, 5);

export const componentName = 'DynaTable';

export const getComponentName = (compName = '') => {
    return [componentName, compName].join('');
};

export const prefixClassName = kebabCase(componentName);

export const getClassNames = (...args) => {
    return classNames(args)
        .split(' ')
        .map(v => {
            return [prefixClassName, v].join('-');
        })
        .join(' ');
};

const defaultColumn = {
    dataIndex: '',
    visible: true, // 显示|隐藏
    filters: [], // 筛选项 {label, value}[]
    filterMultiple: true, // 单选|多选
    editable: false, // 是否可编辑
    rules: [], // 交易规则 编辑态
    canHide: true, // 是否能隐藏
    canSort: true // 是否可排序
};

// 处理 props.columns
export const mergeColumns = (columns = [], context) => {
    const { domEvents } = context;
    const innerColumns = cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { dataIndex, filters, filterMultiple } = column;
            // 远端排序
            if (isEmptyArray(filters)) {
                delete column.filters;
            } else {
                column.filterIcon = () => {
                    const value = context.state.filterValue[dataIndex];
                    const filtered = isEveryFalsy(isEmptyValue(value), isEmptyArray(value));
                    return <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />;
                };
                column.filterDropdown = props => {
                    // 选中的值
                    const value = context.state.filterValue[dataIndex];
                    const { confirm } = props;
                    let dropdownNode;
                    const isTreeSelect = Object.keys(filters[0]).includes('children');
                    console.log(isTreeSelect, dataIndex, Object.keys(filters[0]));
                    if (isTreeSelect) {
                        dropdownNode = (
                            <TreeSelect
                                value={value}
                                treeData={filters}
                                onChange={e => {
                                    domEvents.onFilterChange(dataIndex, e.target.value);
                                }}
                                style={{ width: 200 }}
                                dropdownMatchSelectWidth={200}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeDefaultExpandAll
                                multiple={filterMultiple}
                                treeCheckable
                                open={context.state.treeSelectOpens[dataIndex] || false}
                            />
                        );
                    } else {
                        // 多选 / 单选
                        if (filterMultiple) {
                            dropdownNode = (
                                <Checkbox.Group
                                    value={value}
                                    options={filters}
                                    onChange={val => {
                                        domEvents.onFilterChange(dataIndex, val);
                                    }}
                                />
                            );
                        } else {
                            dropdownNode = (
                                <Radio.Group
                                    value={value}
                                    options={filters}
                                    onChange={e => {
                                        domEvents.onFilterChange(dataIndex, e.target.value);
                                    }}
                                />
                            );
                        }
                    }
                    let disabledReset;
                    if (filterMultiple) {
                        disabledReset = isUndefined(value) || isEqual(value, []);
                    } else {
                        disabledReset = isUndefined(value) || isEqual(value, '');
                    }
                    return (
                        <div className="dyna-table-filter-dropdown">
                            <div className="dyna-table-filter-dropdown-options">{dropdownNode}</div>
                            <div className={classNames("dyna-table-filter-dropdown-footer", {
                                'dyna-table-filter-dropdown-footer-hide': isTreeSelect
                            })}>
                                <Button
                                    size="small"
                                    type="text"
                                    disabled={disabledReset}
                                    onClick={() => {
                                        domEvents.onFilterReset(dataIndex, filterMultiple);
                                        confirm({ closeDropdown: true });
                                    }}
                                >
                                    重置
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        domEvents.onFilterConfirm();
                                        confirm({ closeDropdown: true });
                                    }}
                                >
                                    确定
                                </Button>
                            </div>
                        </div>
                    );
                };
                column.onFilterDropdownVisibleChange = visible => {
                    domEvents.changeTreeSelect(visible, dataIndex);
                    // 隐藏时, 触发搜索
                    if (!visible) {
                        domEvents.onFilterConfirm();
                        return;
                    }
                };
            }

            return column;
        })
        .map(v => {
            const { editable, dataIndex, rules, title } = v;
            if (!editable) {
                return v;
            }
            return {
                ...v,
                onCell: (record, index) => {
                    return {
                        index,
                        record,
                        editable,
                        dataIndex,
                        rules,
                        title,
                        handleSave: domEvents.handleSaveCell
                    };
                }
            };
        });
    return filter(innerColumns, { visible: true });
};

// 显示|隐藏/排序
export const getVisibleColumns = (columns, columnsTitleList) => {
    return columnsTitleList.map(title => {
        return find(columns, { title });
    });
};
