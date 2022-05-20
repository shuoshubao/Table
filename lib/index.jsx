import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Checkbox, Radio, Button } from 'antd';
import { cloneDeep, get, omit, isEqual, isUndefined, debounce, map } from 'lodash';
import { setAsyncState, classNames, isEmptyValue, isEmptyArray, isEveryFalsy } from '@nbfe/tools';
// import HeaderSetting from './HeaderSetting.jsx';
import EditableCellV4 from './EditableCell.jsx';
import EditableCellV3 from './EditableCellV3.jsx';
import { isAntdV3, mergeColumns, getVisibleColumns, getClassNames } from './util.jsx';
import './index.scss';

console.log(11, isAntdV3);

const EditableCell = isAntdV3 ? EditableCellV3 : EditableCellV4;

class Index extends Component {
    static displayName = 'DynaTable';

    static defaultProps = {
        visibleHeaderSetting: false
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
            columnsTitleList: [], // 显示|隐藏/排序
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
                const resOrigin = await fetchFunc(fetchParams);
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
                }, 0);
            },
            // 编辑-单元格 保存
            handleSaveCell: row => {
                console.log(row);
            }
        };
    }

    getRenderResult() {
        return {};
    }

    render() {
        const { props, state, domEvents, customEvents } = this;
        const { prependHeader, appendHeader, visibleHeaderSetting } = props;
        const { columns, columnsTitleList, dataSource, total, current, pageSize } = state;
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
                                {/*<HeaderSetting
                                    shape="button"
                                    columns={columns}
                                    onChange={columnsTitleList => {
                                        this.setState({ columnsTitleList });
                                    }}
                                />*/}
                            </div>
                        )}
                    </div>
                )}
                <Table
                    {...tableProps}
                    columns={getVisibleColumns(columns, columnsTitleList)}
                    dataSource={dataSource}
                    components={EditableCell}
                    rowClassName={() => {
                        return getClassNames('editable-row');
                    }}
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
