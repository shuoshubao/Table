import React, { Component } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { random, range } from 'lodash';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Divider from 'antd/lib/divider';
import { sleep, fakeFetch } from '@nbfe/tools';
import Table from '../lib/index';

const columns = [
    {
        title: '时间戳',
        render: () => {
            return Date.now();
        }
    },
    {
        title: '文本',
        dataIndex: 'text',
        width: 100,
        template: {
            tpl: 'text',
            ellipsis: {
                rows: 2
            },
        }
    },
    {
        title: '文本数组',
        dataIndex: 'texts',
        width: 100,
        template: {
            tpl: 'text',
            separator: '、'
        }
    },
    {
        title: '姓名',
        dataIndex: 'name',
        canHide: false,
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
        title: '枚举1',
        dataIndex: 'enum1',
        template: {
            tpl: 'enum',
            options: [
                {
                    label: '男',
                    value: 1
                },
                {
                    label: '女',
                    value: 2
                }
            ]
        }
    },
    {
        title: '枚举2',
        dataIndex: 'enum2',
        width: 100,
        template: {
            tpl: 'enum',
            shape: 'dot',
            options: [
                {
                    color: 'green',
                    label: '已上线',
                    value: 1
                },
                {
                    color: '#f50',
                    label: '已下线',
                    value: 2
                }
            ]
        }
    },
    {
        title: '日期',
        dataIndex: 'date',
        template: {
            tpl: 'date',
            format: 'YYYY-MM'
        }
    },
    {
        title: '图片',
        dataIndex: 'imgSrc',
        template: {
            tpl: 'image',
            fallback: 'https://ke.com/favicon.ico'
        }
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
        title: '操作',
        dataIndex: 'operate',
        // fixed: 'right',
        // render: () => {
        //     return (
        //         <Button type="link" size="small">
        //             详情
        //         </Button>
        //     );
        // }
        template: {
            tpl: 'link',
            render: (text, record, index) => {
                const { name } = record;
                return [
                    {
                        text: '详情',
                        href: '/abc',
                        query: { name },
                        target: '_blank'
                    },
                    {
                        text: '编辑',
                        icon: <EditOutlined />,
                        danger: true,
                        tooltip: 'ABC',
                        href: `/edit?name=${name}`
                    },
                    {
                        text: '上线',
                        PopconfirmConfig: {
                            title: 'title',
                            onConfirm: async () => {
                                await sleep(2);
                                console.log('onConfirm');
                            }
                        }
                        // onClick: () => {
                        //     console.log(text, record, index);
                        // }
                    },
                    {
                        text: '下线',
                        disabled: true
                    }
                ];
            }
        }
    }
];

const itemDataSource = [
    {
        text: '文本文本文本文本文本文本文本文本文本文本文本文本',
        texts: ['文本1', '文本2'],
        name: '胡彦祖',
        age: 32,
        enum1: 1,
        enum2: 1,
        date: 1627453265384,
        imgSrc: 'https://img.ljcdn.com/beike/super-agent-fe/1610547879561.png',
        address1: '西湖区湖底公园1号',
        address2: '西湖区湖底公园1号',
        address3: '西湖区湖底公园1号'
    }
];

const total = 92;

const dataSource = range(0, total).map((v, i) => {
    return {
        ...itemDataSource[0],
        name: itemDataSource[0].name + v,
        imgSrc: i % 3 ? itemDataSource[0].imgSrc : 'error',
        enum1: i % 3,
        enum2: i % 3
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
                    dataSource={dataSource}
                    rowKey="name"
                    bordered
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
