import React, { Fragment } from 'react';
import { version, Radio, Checkbox, TreeSelect, Button } from 'antd';
import { cloneDeep, isEqual, isUndefined, isFunction, kebabCase, merge, filter, find, inRange, flatten } from 'lodash';
import { classNames, isEmptyValue, isEmptyArray, isEveryFalsy, getTooltipHtml } from '@nbfe/tools';
import { FilterFilled } from './Icons';
import getRender, { RenderTplList } from './Render';

export const isAntdV3 = inRange(parseInt(version, 10), 3, 4);

export const isAntdV4 = inRange(parseInt(version, 10), 4, 5);

export const defaultExtraConfig = {
    showTotal: false, // 是否在表头展示总数据 false / true / (totalNum) => ReactNode
    showHeaderSetting: false, // 是否显示设置表头
    storageKey: '' // 存储的key
};

export const componentName = 'DynamicTable';

export const getComponentName = (compName = '') => {
    return [componentName, compName].join('');
};

export const getStorageKey = storageKey => {
    return [componentName, 'HeaderSetting', storageKey || window.location.pathname].join('__');
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

// 总条数
export const renderTotalNum = totalNum => {
    return (
        <Fragment>
            总计<span className={getClassNames('total')}>{totalNum}</span>条数据
        </Fragment>
    );
};

// 表格头部的总数据展示
export const getRenderTotalNum = (totalNum, showTotal) => {
    if (!showTotal) {
        return null;
    }
    if (isFunction(showTotal)) {
        return showTotal(totalNum);
    }
    return renderTotalNum(totalNum);
};

const defaultColumn = {
    dataIndex: '',
    visible: true, // 显示|隐藏
    filters: [], // 筛选项 {label, value}[]
    filterMultiple: true, // 单选|多选
    editable: false, // 是否可编辑
    rules: [], // 交易规则 编辑态
    canHide: true, // 是否能隐藏
    canSort: true, // 是否可排序
    template: {
        tpl: 'text',
        emptyText: '--'
    }
};

// 处理 props.columns
export const mergeColumns = (columns = [], context) => {
    const { onFilterChange, onFilterReset, changeTreeSelect, onFilterConfirm, handleSave } = context;
    const innerColumns = cloneDeep(columns)
        .map(v => {
            const column = merge({}, defaultColumn, v);
            const { dataIndex, filters, filterMultiple, render, template } = column;
            // 远端排序
            if (isEmptyArray(filters)) {
                delete column.filters;
            } else {
                column.filterIcon = () => {
                    const value = context.state.filterParams[dataIndex];
                    const filtered = isEveryFalsy(isEmptyValue(value), isEmptyArray(value));
                    return <FilterFilled style={{ color: filtered ? '#1890ff' : undefined }} />;
                };
                column.filterDropdown = props => {
                    // 选中的值
                    const value = context.state.filterParams[dataIndex];
                    const { confirm } = props;
                    let dropdownNode;
                    const isTreeSelect = flatten(
                        filters.map(v2 => {
                            return Object.keys(v2);
                        })
                    ).includes('children');
                    if (isTreeSelect) {
                        dropdownNode = (
                            <TreeSelect
                                value={value}
                                treeData={filters}
                                onChange={val => {
                                    onFilterChange(dataIndex, val);
                                }}
                                style={{ width: 200 }}
                                dropdownMatchSelectWidth={200}
                                showSearch
                                treeNodeFilterProp="label"
                                treeNodeLabelProp="label"
                                maxTagCount={1}
                                dropdownStyle={{ maxHeight: 400, overflowY: 'auto' }}
                                treeDefaultExpandAll
                                multiple={filterMultiple}
                                treeCheckable={filterMultiple}
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
                                        onFilterChange(dataIndex, val);
                                    }}
                                />
                            );
                        } else {
                            dropdownNode = (
                                <Radio.Group
                                    value={value}
                                    options={filters}
                                    onChange={e => {
                                        onFilterChange(dataIndex, e.target.value);
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
                        <div
                            className={classNames('dynamic-table-filter-dropdown', {
                                'dynamic-table-filter-dropdown-has-tree-select': isTreeSelect
                            })}
                        >
                            <div className="dynamic-table-filter-dropdown-options">{dropdownNode}</div>
                            <div
                                className={classNames('dynamic-table-filter-dropdown-footer', {
                                    'dynamic-table-filter-dropdown-footer-hide': isTreeSelect
                                })}
                            >
                                <Button
                                    size="small"
                                    type="text"
                                    disabled={disabledReset}
                                    onClick={() => {
                                        onFilterReset(dataIndex, filterMultiple);
                                        confirm({ closeDropdown: true });
                                    }}
                                >
                                    重置
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => {
                                        onFilterConfirm();
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
                    changeTreeSelect(visible, dataIndex);
                    if (visible) {
                        context.prevFilterValue = cloneDeep(context.state.filterParams);
                    } else {
                        if (isEqual(context.prevFilterValue, context.state.filterParams)) {
                            return;
                        }
                        onFilterConfirm();
                    }
                };
            }

            if (!isFunction(render)) {
                const { tpl } = template;
                if (RenderTplList.includes(tpl)) {
                    // 行号 默认宽度
                    if (tpl === 'numbering') {
                      column.width = column.width || 65;
                    }
                    column.render = getRender(column, context);
                }
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
                        handleSave
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

// Tooltip 支持链接的写法
export const getTooltipTitleNode = tooltip => {
    return getTooltipHtml(tooltip).map((v, i) => {
        return <div key={[i].join()} dangerouslySetInnerHTML={{ __html: v }} />;
    });
};
