import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { message, Table } from 'antd';
import { cloneDeep, get, set, omit, isFunction, debounce, map } from 'lodash';
import { setAsyncState, classNames, isEmptyArray, isEveryFalsy } from '@nbfe/tools';
import { CloseCircleFilled } from './Icons';
import getTableComponentsV4 from './EditableCell';
import getTableComponentsV3 from './EditableCellV3';
import {
    isAntdV3,
    componentName,
    getStorageKey,
    defaultExtraConfig,
    mergeColumns,
    getVisibleColumns,
    getClassNames,
    renderTotalNum,
    getRenderTotalNum
} from './util';
import './index.less';

const getTableComponents = isAntdV3 ? getTableComponentsV3 : getTableComponentsV4;

class Index extends Component {
    static displayName = componentName;

    static defaultProps = {
        pagination: {},
        extraConfig: defaultExtraConfig
    };

    static propTypes = {
        remoteConfig: PropTypes.object,
        columns: PropTypes.array.isRequired,
        dataSource: PropTypes.array,
        pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), // 分页
        extraConfig: PropTypes.object // 额外配置, 方便管理扩展
    };

    constructor(props) {
        super(props);
        const { defaultCurrent, defaultPageSize } = props.pagination || {};
        this.state = {
            fetchError: false, // 接口出错
            loading: false,
            columns: [],
            dataSource: [],
            columnsTitleList: [], // 显示|隐藏/排序
            total: 0,
            current: defaultCurrent || 1,
            pageSize: defaultPageSize || 10,
            filterParams: {}, // 筛选的数据
            treeSelectOpens: {} // TreeSelect 的显示状态
        };
        this.search = debounce(this.handleSearch, 100);
        // 缓存 filterParams
        this.prevFilterValue = {};
        // 缓存 searchParams
        this.cacheSearchParams = {};
    }

    componentDidMount() {
        const { showHeaderSetting, storageKey } = { ...defaultExtraConfig, ...this.props.extraConfig };
        const columns = mergeColumns(this.props.columns, this);
        let columnsTitleList = map(columns, 'title');
        if (showHeaderSetting) {
            const storageCompleteKey = getStorageKey(storageKey);
            const titleList = JSON.parse(window.localStorage.getItem(storageCompleteKey)) || [];
            if (!isEmptyArray(titleList)) {
                columnsTitleList = titleList.filter(v => {
                    return map(columns, 'title').includes(v);
                });
            }
        }
        this.setState({ columns, columnsTitleList });
        if (this.isLocalData()) {
            this.setState({ dataSource: cloneDeep(this.props.dataSource) });
        }
    }

    // 外部获取数据
    getDataSource = () => {
        return cloneDeep(this.state.dataSource);
    };

    // 本地数据源
    isLocalData = () => {
        const fetchFunc = get(this.props, 'remoteConfig.fetch');
        return !isFunction(fetchFunc);
    };

    // 参数: 排序
    getFilterParams = () => {
        return this.state.filterParams;
    };

    handleSearch = async (searchParams = {}, isReset = true) => {
        // 本地
        if (this.isLocalData()) {
            return;
        }
        // 重置
        // 回到第一页
        // 清空筛选项
        // 清空排序
        if (isReset) {
            await setAsyncState(this, { current: 1, filterParams: {} });
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
        const filterParams = this.getFilterParams();
        const fetchParams = {
            ...paginationParams,
            ...filterParams,
            ...this.cacheSearchParams,
            ...searchParams
        };
        this.setState({ loading: true, fetchError: false });
        const resOrigin = await fetchFunc(fetchParams).catch(() => {
            this.setState({ fetchError: true });
        });
        this.setState({ loading: false });
        const res = process(cloneDeep(resOrigin)) || resOrigin;
        const dataSource = get(res, dataSourceKey, []);
        const total = get(res, totalKey, 0);
        this.setState({ dataSource, total });
        if (isReset) {
            this.cacheSearchParams = { ...searchParams };
        }
    };

    // 筛选
    onFilterChange = (dataIndex, value) => {
        this.setState(prevState => {
            return {
                filterParams: {
                    ...prevState.filterParams,
                    [dataIndex]: value
                }
            };
        });
    };

    // 筛选 TreeSelect
    changeTreeSelect = (visible, dataIndex) => {
        this.setState(prevState => {
            const { treeSelectOpens } = prevState;
            treeSelectOpens[dataIndex] = visible;
            return {
                treeSelectOpens
            };
        });
    };

    // 筛选-确认
    onFilterConfirm = debounce(async () => {
        await setAsyncState(this, { current: 1 });
        this.handleSearch({}, false);
    }, 10);

    // 筛选-重置
    onFilterReset = async (dataIndex, filterMultiple) => {
        await setAsyncState(this, prevState => {
            return {
                filterParams: {
                    ...prevState.filterParams,
                    [dataIndex]: filterMultiple ? [] : ''
                }
            };
        });
        this.onFilterConfirm();
    };

    // 分页 - 切换
    onChange = async page => {
        await setAsyncState(this, { current: page });
        this.handleSearch({}, false);
    };

    // 分页 - 每页的设置
    onShowSizeChange = (current, size) => {
        setTimeout(async () => {
            await setAsyncState(this, { pageSize: size, current: 1 });
            this.handleSearch({}, false);
        }, 0);
    };

    // 编辑-单元格 保存
    // 请求接口, 接口完成后, 刷新数据(当前页)
    handleSave = async config => {
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
        if (!onEditableCellSave) {
            this.setState({ dataSource: newDataSource });
            return;
        }
        let hideLoading;
        await setAsyncState(this, { loading: true, dataSource: newDataSource });
        try {
            await onEditableCellSave(config, cloneDeep(this.state));
            this.handleSearch({}, false);
            this.setState({ loading: false });
        } catch (e) {
            message.error(['数据保存失败', e].filter(Boolean).join(': '));
            this.setState({ loading: false, dataSource: oldDataSource });
        }
        if (hideLoading) {
            hideLoading();
        }
    };

    render() {
        const { props, state, onChange, onShowSizeChange } = this;
        const { prependHeader, appendHeader, pagination } = props;
        const { showTotal, showHeaderSetting, storageKey } = { ...defaultExtraConfig, ...props.extraConfig };
        const { columns, columnsTitleList, dataSource, total, current, pageSize } = state;
        const tableProps = omit(props, [
            'class',
            'className',
            'style',
            'columns',
            'dataSource',
            'remoteConfig',
            'pagination'
        ]);
        const hideHeader = isEveryFalsy(showTotal, prependHeader, appendHeader, showHeaderSetting);
        if (isEmptyArray(columns)) {
            return null;
        }
        const loadingConfig = { spinning: state.loading, size: 'large', tip: '数据加载中...' };
        if (state.fetchError) {
            loadingConfig.wrapperClassName = getClassNames('fetch-error');
            loadingConfig.spinning = true;
            loadingConfig.tip = <span>数据加载出错!</span>;
            loadingConfig.indicator = <CloseCircleFilled />;
        }
        const totalNum = total || dataSource.length;
        return (
            <div className={classNames('dynamic-table', props.class, props.className)}>
                {!hideHeader && (
                    <div className="dynamic-table-header">
                        <div className="dynamic-table-header-left">
                            {!!totalNum && showTotal && <div>{getRenderTotalNum(totalNum, showTotal)}</div>}
                            {prependHeader}
                        </div>
                        <div className="dynamic-table-header-right">{appendHeader}</div>
                    </div>
                )}
                <Table
                    loading={loadingConfig}
                    {...tableProps}
                    columns={getVisibleColumns(columns, columnsTitleList)}
                    dataSource={dataSource}
                    components={getTableComponents({ ...tableProps, columns })}
                    rowClassName={() => {
                        return getClassNames('editable-row');
                    }}
                    pagination={
                        pagination && {
                            ...pagination,
                            style: { padding: '16px 10px', margin: 0 },
                            onChange,
                            onShowSizeChange,
                            showSizeChanger: true,
                            total,
                            current,
                            pageSize,
                            showTotal: renderTotalNum
                        }
                    }
                />
            </div>
        );
    }
}

export default Index;