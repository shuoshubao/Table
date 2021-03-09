import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox, Radio, Button } from 'antd';
import { get, omit, noop, isEqual, isUndefined } from 'lodash';
import { setAsyncState } from '@nbfe/tools';
import './index.css';

class Index extends Component {
    static displayName = 'DynaTable';

    static defaultProps = {};

    static propTypes = {
        columns: PropTypes.array.isRequired,
        dataSource: PropTypes.array,
        remoteConfig: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 1,
            current: 1,
            pageSize: 10,
            dataSource: [],
            columns: [],
            filterValue: {} // 筛选的数据
        };
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    async componentDidMount() {
        const columns = this.props.columns.map((v, i) => {
            const { dataIndex, title, filters, filterMultiple = true, sortDirections } = v;

            let filterDropdown = noop;
            // 远端排序
            if (filters) {
                filterDropdown = props => {
                    const { setSelectedKeys, selectedKeys, confirm, clearFilters } = props;
                    let dropdownNode;
                    const dropdownOptions = filters.map((v2, i2) => {
                        return {
                            label: v2.text,
                            value: v2.value
                        };
                    });
                    // 选中的值
                    const value = this.state.filterValue[dataIndex];
                    // 多选 / 单选
                    if (filterMultiple) {
                        dropdownNode = (
                            <Checkbox.Group
                                value={value}
                                options={dropdownOptions}
                                onChange={value => {
                                    this.domEvents.onFilterChange(dataIndex, value);
                                }}
                            />
                        );
                    } else {
                        dropdownNode = (
                            <Radio.Group
                                value={value}
                                onChange={e => {
                                    this.domEvents.onFilterChange(dataIndex, e.target.value);
                                }}
                            >
                                {dropdownOptions.map((v2, i2) => {
                                    return (
                                        <Radio key={v2.value} value={v2.value}>
                                            {v2.label}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
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
                            <div className="dyna-table-filter-dropdown-operation">
                                <Button
                                    size="small"
                                    type="text"
                                    disabled={disabledReset}
                                    onClick={() => {
                                        this.domEvents.onFilterReset(dataIndex, filterMultiple);
                                    }}
                                >
                                    重置
                                </Button>
                                <Button size="small" type="primary" onClick={this.domEvents.onFilterConfirm}>
                                    确定
                                </Button>
                            </div>
                        </div>
                    );
                };
            }
            return { ...v, filterDropdown };
        });
        await setAsyncState(this, { columns });
        this.customEvents.fetchData();
    }

    getCustomEvents() {
        return {
            // 本地数据源
            isLocalData: () => {
                const { fetch: fetchFunc } = this.props.remoteConfig;
                return !fetchFunc;
            },
            // 参数: 排序
            getFilterParams: () => {
                return this.state.filterValue;
            },
            fetchData: async () => {
                const { props, state } = this;
                const { fetch: fetchFunc, dataSourceKey = 'list', totalKey = 'total' } = props.remoteConfig;
                const { current, pageSize } = state;
                const paginationParams = {
                    pageSize,
                    currentPage: current
                };
                const filterParams = this.customEvents.getFilterParams();
                const res = await fetchFunc({ ...paginationParams, ...filterParams });
                const dataSource = get(res, dataSourceKey, []);
                const total = get(res, totalKey, 0);
                this.setState({ dataSource, total });
            }
        };
    }

    getDomEvents() {
        return {
            // 筛选
            onFilterChange: async (dataIndex, value) => {
                await setAsyncState(this, prevState => {
                    return {
                        filterValue: {
                            ...prevState.filterValue,
                            [dataIndex]: value
                        }
                    };
                });
            },
            // 筛选-确认
            onFilterConfirm: () => {
                this.customEvents.fetchData();
            },
            // 筛选-重置
            onFilterReset: async (dataIndex, filterMultiple) => {
                await setAsyncState(this, prevState => {
                    return {
                        filterValue: {
                            ...prevState.filterValue,
                            [dataIndex]: filterMultiple ? [] : ''
                        }
                    };
                });
                this.customEvents.fetchData();
            },
            onChange: async (page, pageSize) => {
                await setAsyncState(this, { current: page });
                this.customEvents.fetchData();
            },
            onShowSizeChange: (current, size) => {
                setTimeout(async () => {
                    await setAsyncState(this, { pageSize: size, current: 1 });
                }, 0);
            }
        };
    }

    getRenderResult() {
        return {};
    }

    render() {
        const { props, state, domEvents, customEvents } = this;
        const { columns, dataSource, total, current, pageSize } = state;
        const { onChange, onShowSizeChange } = domEvents;
        const tableProps = omit(props, ['columns', 'dataSource', 'remoteConfig']);
        return (
            <div>
                <Table
                    {...tableProps}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        style: { padding: '16px 10px', margin: 0 },
                        onChange,
                        onShowSizeChange,
                        total,
                        current,
                        pageSize,
                        showTotal: total => {
                            return ['总计', total, '条数据'].join(' ');
                        }
                    }}
                />
            </div>
        );
    }
}

export default Index;
