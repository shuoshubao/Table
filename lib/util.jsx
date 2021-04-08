import React from 'react';
import { Table, Checkbox, Radio, Button } from 'antd';
import FilterFilled from '@ant-design/icons/FilterFilled';
import { kebabCase } from 'lodash';
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

// 处理 props.columns
export const mergeColumns = (columns = [], { state, domEvents }) => {
    return cloneDeep(columns).map((v, i) => {
        const { dataIndex, filters, filterMultiple = true } = v;

        // 远端排序
        if (filters) {
            v.filterIcon = () => {
                const value = state.filterValue[dataIndex];
                const filtered = isEveryFalsy(isEmptyValue(value), isEmptyArray(value));
                return <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />;
            };
            v.filterDropdown = props => {
                // 选中的值
                const value = state.filterValue[dataIndex];
                const { confirm } = props;
                let dropdownNode;
                const dropdownOptions = filters.map((v2, i2) => {
                    return {
                        label: v2.label,
                        value: v2.value
                    };
                });
                // 多选 / 单选
                if (filterMultiple) {
                    dropdownNode = (
                        <Checkbox.Group
                            value={value}
                            options={dropdownOptions}
                            onChange={value => {
                                domEvents.onFilterChange(dataIndex, value);
                            }}
                        />
                    );
                } else {
                    dropdownNode = (
                        <Radio.Group
                            value={value}
                            options={dropdownOptions}
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
            v.onFilterDropdownVisibleChange = visible => {
                if (!visible) {
                }
            };
        }

        return v;
    });
};
