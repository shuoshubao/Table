import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { get, omit } from 'lodash';
import { setAsyncState } from '@nbfe/tools';

class Index extends Component {
    static displayName = 'Table';

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
            columns: []
        };
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    async componentDidMount() {
        const columns = this.props.columns.map((v, i) => {
            const { dataIndex, title } = v;
            // return v;
            return { ...v, key: [i, dataIndex, title].join('_') };
        });
        await setAsyncState(this, { columns });
        this.customEvents.fetchData();
    }

    getCustomEvents() {
        return {
            isLocalData() {
                const { fetch: fetchFunc } = this.props.remoteConfig;
                return !fetchFunc;
            },
            fetchData: async () => {
                const { props, state } = this;
                const { fetch: fetchFunc, dataSourceKey = 'list', totalKey = 'total' } = props.remoteConfig;
                const { current, pageSize } = state;
                const paginationParams = {
                    pageSize,
                    currentPage: current
                };
                const res = await fetchFunc(paginationParams);
                const dataSource = get(res, dataSourceKey, []);
                const total = get(res, totalKey, 0);
                this.setState({ dataSource, total });
            }
        };
    }

    getDomEvents() {
        return {
            onChange: async (page, pageSize) => {
                await setAsyncState(this, { current: page });
                this.customEvents.fetchData();
            },
            onShowSizeChange: (current, size) => {
                setTimeout(async () => {
                    await setAsyncState(this, { pageSize: size, current: 1 });
                    this.customEvents.fetchData();
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
