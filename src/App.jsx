import React, { Component } from 'react';
import { random, range } from 'lodash';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Divider from 'antd/lib/divider';
import { sleep } from '@nbfe/tools';
import Table from '../lib/index';

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        canSort: false,
        filters: [
            {
                label: '胡彦祖1',
                value: 'aa'
            },
            {
                label: '胡彦祖2',
                value: 'bb'
            }
        ]
    },
    {
        title: '年龄',
        dataIndex: 'age',
        filterMultiple: false,
        canSort: false,
        canHide: false,
        editable: true,
        rules: [
            {
                required: true,
                message: '年龄 is 必填'
            }
        ],
        filters: [
            {
                label: '32',
                value: 32
            },
            {
                label: '42',
                value: 42
            }
        ]
    },
    {
        title: 'Trre 筛选 单选',
        dataIndex: 'tree1',
        filterMultiple: false,
        filters: [
            {
                label: 'Node1',
                value: '0-0',
                children: [
                    {
                        label: 'Child Node1',
                        value: '0-0-0'
                    },
                    {
                        label: 'Child Node1',
                        value: '0-0-1',
                        children: [
                            {
                                label: 'Child Node1',
                                value: '0-0-1-0'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Node2',
                value: '0-1',
                children: [
                    {
                        label: 'Child Node3',
                        value: '0-1-0'
                    },
                    {
                        label: 'Child Node4',
                        value: '0-1-1'
                    },
                    {
                        label: 'Child Node5',
                        value: '0-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: 'Trre 筛选 复选',
        dataIndex: 'tree2',
        filters: [
            {
                label: 'Node1',
                value: '0-0',
                children: [
                    {
                        label: 'Child Node1',
                        value: '0-0-0'
                    },
                    {
                        label: 'Child Node1',
                        value: '0-0-1',
                        children: [
                            {
                                label: 'Child Node1',
                                value: '0-0-1-0'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Node2',
                value: '0-1',
                children: [
                    {
                        label: 'Child Node3',
                        value: '0-1-0'
                    },
                    {
                        label: 'Child Node4',
                        value: '0-1-1'
                    },
                    {
                        label: 'Child Node5',
                        value: '0-1-2'
                    }
                ]
            }
        ]
    },
    {
        title: '住址1',
        dataIndex: 'address1'
    },
    {
        title: '住址2',
        dataIndex: 'address2'
    },
    {
        title: '住址3',
        // visible: false,
        dataIndex: 'address3'
    },
    {
        title: '操作',
        dataIndex: 'operate',
        // fixed: 'right',
        configurable: false,
        render: () => {
            return (
                <Button type="link" size="small">
                    详情
                </Button>
            );
        }
    }
];

const itemDataSource = [
    {
        name: '胡彦祖',
        age: 32,
        address1: '西湖区湖底公园1号',
        address2: '西湖区湖底公园1号',
        address3: '西湖区湖底公园1号'
    },
    {
        name: '胡彦祖',
        age: 42,
        address1: '西湖区湖底公园1号',
        address2: '西湖区湖底公园1号',
        address3: '西湖区湖底公园1号'
    }
];

const total = 92;

const dataSource = range(0, total).map(v => {
    return {
        ...itemDataSource[0],
        name: itemDataSource[0].name + v
    };
});

const remoteConfig = {
    fetch: async params => {
        console.log('🍉 params');
        console.log(params);
        const { currentPage, pageSize } = params;
        await sleep(random(0.5, 1.5, true));
        return {
            list: dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize),
            total
        };
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.tableRef = React.createRef();
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        this.tableRef.current.search({}, false);
    }

    onClick() {
        this.tableRef.current.search();
    }

    render() {
        return (
            <div style={{ padding: 20, background: '#eee' }}>
                <Card title="搜索区" size="small">
                    <Button type="primary" onClick={this.onClick} size="small">
                        查询
                    </Button>
                </Card>
                <Divider />
                <Table
                    ref={this.tableRef}
                    columns={columns}
                    remoteConfig={remoteConfig}
                    selectedRowKeys={['胡彦祖2']}
                    rowKey="name"
                    bordered
                    visibleHeaderSetting={true}
                    pagination={{
                        defaultPageSize: 5,
                        defaultCurrent: 2,
                        pageSizeOptions: ['5', '10', '20']
                    }}
                    onEditableCellSave={async ({ index, dataIndex, record, value }, state) => {
                        const { current, pageSize } = state;
                        dataSource[(current - 1) * pageSize + index][dataIndex] = value;
                        await sleep();
                    }}
                />
            </div>
        );
    }
}

export default App;
