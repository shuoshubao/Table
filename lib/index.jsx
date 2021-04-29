import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Table, Checkbox, Radio, Button } from './antd';
import { cloneDeep, get, set, omit, isEqual, isUndefined, isFunction, debounce, map } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';
import HeaderSetting from './HeaderSetting.jsx';
import getTableComponentsV4 from './EditableCell.jsx';
import getTableComponentsV3 from './EditableCellV3.jsx';
import { componentName, isAntdV3, mergeColumns, getVisibleColumns, getClassNames } from './util.jsx';
import './index.scss';

const getTableComponents = isAntdV3 ? getTableComponentsV3 : getTableComponentsV4;

class Index extends Component {
    static displayName = 'DynaTable';

    static defaultProps = {
        visibleHeaderSetting: false,
        editTrigger: 'click',
        pagination: {}
    };

    static propTypes = {
        columns: PropTypes.array.isRequired,
        visibleHeaderSetting: PropTypes.bool,
        dataSource: PropTypes.array,
        remoteConfig: PropTypes.object,
        editTrigger: PropTypes.string, // 编辑触发条件 'click' | 'hover'
        pagination: PropTypes.object // 分页
    };

    constructor(props) {
        super(props);
        const { defaultCurrent, defaultPageSize } = props.pagination;
        this.state = {
            loading: false,
            columns: [],
            dataSource: [],
            columnsTitleList: [], // 显示|隐藏/排序
            total: 0,
            current: defaultCurrent || 1,
            pageSize: defaultPageSize || 10,
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
        const columnsTitleList = map(columns, 'title');
        this.setState({ columns, columnsTitleList });
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
                    process = v => v,
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
                this.setState({ loading: true });
                const resOrigin = await fetchFunc(fetchParams);
                this.setState({ loading: false });
                const res = process(cloneDeep(resOrigin)) || resOrigin;
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
            onFilterConfirm: debounce(async () => {
                await setAsyncState(this, { current: 1 });
                this.customEvents.search({}, false);
            }, 10),
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
                this.domEvents.onFilterConfirm();
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
                    this.customEvents.search({}, false);
                }, 0);
            },
            // 编辑-单元格 保存
            // 请求接口, 接口完成后, 刷新数据(当前页)
            handleSaveCell: async config => {
                const { index, dataIndex, record, value } = config;
                const { dataSource } = this.state;
                const oldDataSource = cloneDeep(dataSource);
                const newDataSource = cloneDeep(dataSource);
                set(newDataSource[index], dataIndex, value);
                // 未变化
                if (String(value) === String(record[dataIndex])) {
                    return;
                }
                const { onEditableCellSave } = this.props;
                if (!isFunction(onEditableCellSave)) {
                    console.info(`[${componentName}]:`, '请配置编辑成功的回调函数 onEditableCellSave');
                    return;
                }
                const hideLoading = message.loading('正在保存数据...', 0);
                await setAsyncState(this, { loading: true, dataSource: newDataSource });
                try {
                    await onEditableCellSave(config, cloneDeep(this.state));
                    this.customEvents.search({}, false);
                    message.success('数据保存成功');
                } catch (e) {
                    message.error(['数据保存失败', e].filter(Boolean).join(': '));
                    this.setState({ loading: false, dataSource: oldDataSource });
                }
                hideLoading();
            }
        };
    }

    getRenderResult() {
        return {};
    }

    render() {
        const { props, state, domEvents, customEvents } = this;
        const { prependHeader, appendHeader, visibleHeaderSetting, pagination } = props;
        const { loading, columns, columnsTitleList, dataSource, total, current, pageSize } = state;
        const { onChange, onShowSizeChange } = domEvents;
        const tableProps = omit(props, [
            'class',
            'className',
            'style',
            'columns',
            'dataSource',
            'remoteConfig',
            'pagination'
        ]);
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
                                <HeaderSetting
                                    shape="button"
                                    columns={columns}
                                    onChange={columnsTitleList => {
                                        this.setState({ columnsTitleList });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                <Table
                    loading={{ spinning: state.loading, size: 'large', tip: '数据加载中...' }}
                    {...tableProps}
                    columns={getVisibleColumns(columns, columnsTitleList)}
                    dataSource={dataSource}
                    components={getTableComponents(tableProps)}
                    rowClassName={() => {
                        return getClassNames('editable-row');
                    }}
                    pagination={{
                        ...pagination,
                        style: { padding: '16px 10px', margin: 0 },
                        onChange,
                        onShowSizeChange,
                        showSizeChanger: true,
                        total,
                        current,
                        pageSize,
                        showTotal: (total, range) => {
                            return ['总计', total, '条数据'].join(' ');
                        }
                    }}
                />
            </div>
        );
    }
}

export default Index;
