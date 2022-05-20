import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox, Radio, Button } from 'antd';
import { cloneDeep, get, omit, isEqual, isUndefined, debounce } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';
import HeaderSetting from './HeaderSetting.jsx';
import { mergeColumns } from './util.jsx';
import './index.scss';

class Index extends Component {
    static displayName = 'DynaTable';

    static defaultProps = {
        visibleHeaderSetting: true
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        visibleHeaderSetting: PropTypes.bool,
        dataSource: PropTypes.array,
        remoteConfig: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            current: 1,
            pageSize: 10,
            dataSource: [],
            columns: [],
            filterValue: {} // 筛选的数据
        };
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
        this.search = debounce(this.customEvents.search, 100);
        // 缓存 searchParams
        this.cacheSearchParams = {};
    }

    componentDidMount() {
        const columns = mergeColumns(this.props.columns, this);
        this.setState({ columns });
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
            search: async (searchParams = {}, isReset = true) => {
                // 重置
                // 回到第一页
                // 清空筛选项
                // 清空排序
                if (isReset) {
                    await setAsyncState(this, { current: 1, filterValue: {} });
                }
                const { props, state } = this;
                const {
                    fetch: fetchFunc,
                    dataSourceKey = 'list',
                    totalKey = 'total',
                    pageSizeKey = 'pageSize',
                    currentPageKey = 'currentPage'
                } = props.remoteConfig;
                const { current, pageSize } = state;
                const paginationParams = {
                    [pageSizeKey]: pageSize,
                    [currentPageKey]: current
                };
                const filterParams = this.customEvents.getFilterParams();
                const fetchParams = {
                    ...paginationParams,
                    ...filterParams,
                    ...this.cacheSearchParams,
                    ...searchParams
                };
                const res = await fetchFunc(fetchParams);
                const dataSource = get(res, dataSourceKey, []);
                const total = get(res, totalKey, 0);
                this.setState({ dataSource, total });
                if (isReset) {
                    this.cacheSearchParams = { ...searchParams };
                }
            }
        };
    }

    getDomEvents() {
        return {
            // 筛选
            onFilterChange: (dataIndex, value) => {
                this.setState(prevState => {
                    return {
                        filterValue: {
                            ...prevState.filterValue,
                            [dataIndex]: value
                        }
                    };
                });
            },
            // 筛选-确认
            onFilterConfirm: async () => {
                await setAsyncState(this, { current: 1 });
                this.customEvents.search({}, false);
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
                this.customEvents.search({}, false);
            },
            // 分页 - 切换
            onChange: async (page, pageSize) => {
                await setAsyncState(this, { current: page });
                this.customEvents.search({}, false);
            },
            // 分页 - 每页的设置
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
        const { prependHeader, appendHeader, visibleHeaderSetting } = props;
        const { columns, dataSource, total, current, pageSize } = state;
        const { onChange, onShowSizeChange } = domEvents;
        const tableProps = omit(props, ['class', 'className', 'style', 'columns', 'dataSource', 'remoteConfig']);
        const hideHeader = isEveryFalsy(prependHeader, appendHeader, visibleHeaderSetting);
        if (isEmptyArray(columns)) {
            return null;
        }
        return (
            <div className={classNames('dyna-table', props['class'], props['className'])}>
                {!hideHeader && (
                    <div className="dyna-table-header">
                        <div className="dyna-table-header-left">{prependHeader}</div>
                        <div className="dyna-table-header-right">{appendHeader}</div>
                        {visibleHeaderSetting && (
                            <div className="dyna-table-header-setting">
                                <HeaderSetting type="button" columns={columns} />
                            </div>
                        )}
                    </div>
                )}
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
