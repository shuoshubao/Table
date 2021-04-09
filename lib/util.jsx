import React from 'react';
import { Table, Checkbox, Radio, Button } from 'antd';
import FilterFilled from '@ant-design/icons/FilterFilled';
import { kebabCase, merge, filter, find } from 'lodash';
import { cloneDeep, get, omit, isEqual, isUndefined, debounce } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';

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
    visible: true,
    filters: [],
    filterMultiple: true
};

// 处理 props.columns
export const mergeColumns = (columns = [], context) => {
    const { domEvents } = context;
    const innerColumns = cloneDeep(columns).map((v, i) => {
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
                let disabledReset;
                if (filterMultiple) {
                    disabledReset = isUndefined(value) || isEqual(value, []);
                } else {
                    disabledReset = isUndefined(value) || isEqual(value, '');
                }
                return (
                    <div className="dyna-table-filter-dropdown">
                        <div className="dyna-table-filter-dropdown-options">{dropdownNode}</div>
                        <div className="dyna-table-filter-dropdown-footer">
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
            // 隐藏时, 触发搜索
            column.onFilterDropdownVisibleChange = visible => {
                if (!visible) {
                    domEvents.onFilterConfirm();
                }
            };
        }

        return column;
    });
    return filter(innerColumns, { visible: true });
};

// 显示|隐藏/排序
export const getVisibleColumns = (columns, columnsTitleList) => {
    return columnsTitleList.map(title => {
        return find(columns, { title });
    });
};
