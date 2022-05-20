import React from 'react';
import { version, Table, Radio, Checkbox, TreeSelect, Button } from './antd';
import { FilterFilled } from '@ant-design/icons';
import { cloneDeep, isEqual, isUndefined, isFunction, kebabCase, merge, filter, find, inRange, flatten } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';
import { createElement } from '@nbfe/js2html';
import getRender from './render.jsx';

export const isAntdV3 = inRange(parseInt(version), 3, 4);

export const isAntdV4 = inRange(parseInt(version), 4, 5);

export const defaultExtraConfig = {
    visibleHeaderSetting: false, // 是否显示设置表头
    editTrigger: 'click', // 编辑触发条件 'click' | 'hover'
    storageKey: '' // 存储的key
};

export const componentName = 'DynaTable';

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
    const { onFilterChange, onFilterReset, changeTreeSelect, onFilterConfirm, handleSaveCell } = context;
    const innerColumns = cloneDeep(columns)
        .map((v, i) => {
            const column = merge({}, defaultColumn, v);
            const { dataIndex, filters, filterMultiple, render } = column;
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
                                showSearch={true}
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
                            className={classNames('dyna-table-filter-dropdown', {
                                'dyna-table-filter-dropdown-has-tree-select': isTreeSelect
                            })}
                        >
                            <div className="dyna-table-filter-dropdown-options">{dropdownNode}</div>
                            <div
                                className={classNames('dyna-table-filter-dropdown-footer', {
                                    'dyna-table-filter-dropdown-footer-hide': isTreeSelect
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
                column.render = getRender(column);
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
                        handleSave: handleSaveCell
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

// 解析url: [文案|链接]
const linkReg = /\[(.+?)\|(.+?)\]/g;

// Tooltip 支持链接的写法
export const getTooltipTitleNode = tooltip => {
    const innerTooltip = flatten([tooltip])
        .filter(Boolean)
        .map(String)
        .map(v => {
            return v.replace(/\\n/g, '<br>');
        })
        .map(v => {
            return v.replace(linkReg, (...args) => {
                const [, text, href] = args;
                return createElement({
                    tagName: 'a',
                    attrs: {
                        href,
                        target: '_blank',
                        style: {
                            color: '#fff',
                            fontWeight: 'bold',
                            textDecoration: 'underline'
                        }
                    },
                    text
                });
            });
        });
    return innerTooltip.map((v, i) => {
        return <div key={[i].join()} dangerouslySetInnerHTML={{ __html: v }} />;
    });
};
