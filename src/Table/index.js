import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import { setAsyncState } from "@nbfe/tools";

class Index extends Component {
    static displayName = "Table";

    static defaultProps = {};

    static propTypes = {
        columns: PropTypes.array.isRequired,
        dataSource: PropTypes.array,
        remoteConfig: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            total: 1,
            current: 1,
            pageSize: 10,
            dataSource: [],
            columns: [],
        };
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    async componentDidMount() {
        const columns = this.props.columns.map((v) => {
            return { ...v };
        });
        this.setState({ columns });
        // this.customEvents.fetchData();
    }

    getCustomEvents() {
        return {
            isLocalData() {
                const { fetch: fetchFunc } = this.remoteConfig;
                return !fetchFunc;
            },
            fetchData: async () => {
                const { state } = this;
                const { pagination } = state;
                const { current, pageSize } = pagination;
                const paginationParams = {
                    pageSize,
                    currentPage: current,
                };
                // const data = await request({
                //     url: "/variable/list",
                //     params: {
                //         ...paginationParams,
                //     },
                // });
                // this.setState({ dataSource: data.list });
                // this.customEvents.updatePagination({ total: data.totalCount });
            },
            // 分页
            updatePagination: async (pagination = {}) => {
                return setAsyncState(this, (prevState) => {
                    return {
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            ...pagination,
                        },
                    };
                });
            },
        };
    }

    getDomEvents() {
        return {
            onPaginationChange: async (page) => {
                await this.customEvents.updatePagination({ current: page });
                this.customEvents.fetchData();
            },
            onPaginationShowSizeChange: async (current, size) => {
                await this.customEvents.updatePagination({ pageSize: size });
                this.customEvents.fetchData();
            },
            onSearch: async () => {
                await this.customEvents.updatePagination({ current: 1 });
                this.customEvents.fetchData();
            },
            onReset: () => {
                this.formRef.current.resetFields();
            },
        };
    }

    getRenderResult() {
        return {};
    }

    render() {
        const { state, domEvents, customEvents } = this;
        const { columns, dataSource, pagination } = state;
        const {
            onPaginationChange,
            onPaginationShowSizeChange,
            onSearch,
            onReset,
        } = domEvents;
        const { fetchData } = customEvents;
        return (
            <div>
                <Table
                    className="mgt10"
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        onChange: onPaginationChange,
                        onShowSizeChange: onPaginationShowSizeChange,
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `总计 ${total} 条数据`,
                    }}
                />
            </div>
        );
    }
}

export default Index;
