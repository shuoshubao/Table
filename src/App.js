import React, { Component } from 'react';
import { random, range } from 'lodash';
import { ConfigProvider, Button, Card, Divider } from 'antd';
import { sleep, fakeFetch, getAntdLocaleZhCN } from '@nbfe/tools';
import 'antd/dist/antd.css';
import 'rc-image/assets/index.css';
import Table from '../lib';
import '../lib/index.less';

const { Descriptions, Image } = Table;

const SexOptions = [
    {
        label: '男',
        value: 1,
        color: 'blue'
    },
    {
        label: '女',
        value: 2,
        color: 'red'
    }
];

const columns = [
    {
        title: '序号',
        template: {
            tpl: 'numbering'
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
        title: '文本',
        dataIndex: 'text',
        width: 100,
        tooltip: '我是提示文案',
        template: {
            tpl: 'text',
            copyable: true,
            ellipsis: {
                rows: 2
            }
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
        dataIndex: 'name'
    },
    {
        title: '年龄',
        dataIndex: 'age'
    },
    {
        title: '性别',
        dataIndex: 'sex'
    },
    {
        title: '枚举1',
        dataIndex: 'enum1',
        template: {
            tpl: 'enum',
            width: 80,
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
        template: {
            tpl: 'enum',
            shape: 'tag',
            width: 80,
            options: [
                {
                    label: '上线',
                    value: 1,
                    color: '#2db7f5'
                },
                {
                    label: '下线',
                    value: 2,
                    color: '#f50'
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
    // {
    //     title: '年龄',
    //     dataIndex: 'age',
    //     filterMultiple: false,
    //     rules: [
    //         {
    //             required: true,
    //             message: '年龄 is 必填'
    //         }
    //     ],
    //     filters: [
    //         {
    //             label: '32',
    //             value: 32
    //         },
    //         {
    //             label: '42',
    //             value: 42
    //         }
    //     ]
    // },
    // {
    //     title: 'Trre 筛选 单选',
    //     dataIndex: 'tree1',
    //     filterMultiple: false,
    //     filters: [
    //         {
    //             label: 'Node1',
    //             value: '0-0',
    //             children: [
    //                 {
    //                     label: 'Child Node1',
    //                     value: '0-0-0'
    //                 },
    //                 {
    //                     label: 'Child Node1',
    //                     value: '0-0-1',
    //                     children: [
    //                         {
    //                             label: 'Child Node1',
    //                             value: '0-0-1-0'
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Node2',
    //             value: '0-1',
    //             children: [
    //                 {
    //                     label: 'Child Node3',
    //                     value: '0-1-0'
    //                 },
    //                 {
    //                     label: 'Child Node4',
    //                     value: '0-1-1'
    //                 },
    //                 {
    //                     label: 'Child Node5',
    //                     value: '0-1-2'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     title: 'Trre 筛选 复选',
    //     dataIndex: 'tree2',
    //     filters: [
    //         {
    //             label: 'Node1',
    //             value: '0-0',
    //             children: [
    //                 {
    //                     label: 'Child Node1',
    //                     value: '0-0-0'
    //                 },
    //                 {
    //                     label: 'Child Node1',
    //                     value: '0-0-1',
    //                     children: [
    //                         {
    //                             label: 'Child Node1',
    //                             value: '0-0-1-0'
    //                         }
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             label: 'Node2',
    //             value: '0-1',
    //             children: [
    //                 {
    //                     label: 'Child Node3',
    //                     value: '0-1-0'
    //                 },
    //                 {
    //                     label: 'Child Node4',
    //                     value: '0-1-1'
    //                 },
    //                 {
    //                     label: 'Child Node5',
    //                     value: '0-1-2'
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     title: '住址1',
    //     dataIndex: 'address1'
    // },
    // {
    //     title: '住址2',
    //     dataIndex: 'address2'
    // },
    {
        title: '操作',
        dataIndex: 'operate',
        width: 120,
        fixed: 'right',
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
                        tooltip: 'ABC',
                        href: `/edit?name=${name}`
                    },
                    {
                        text: '上线',
                        // danger: true,
                        onClick: () => {
                            console.log(record.name);
                        }
                    },
                    {
                        text: '下线',
                        disabled: true
                    },
                    {
                        text: '编辑2',
                        // icon: <EditOutlined />,
                        isMore: true,
                        tooltip: 'ABC',
                        href: `/edit?name=${name}`
                    },
                    {
                        text: '编辑3',
                        // icon: <EditOutlined />,
                        isMore: true,
                        href: `/edit?name=${name}`
                    },
                    {
                        text: '编辑3',
                        // icon: <EditOutlined />,
                        isMore: true,
                        disabled: true,
                        tooltip: '点击跳转 [链接|http://baidu.com]',
                        href: `/edit?name=${name}`
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
        sex: 1,
        enum1: 1,
        enum2: 1,
        slider: 12,
        date: 1627453265384,
        imgSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?undefined',
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
        enum2: i % 2 ? 1 : 2,
        enum3List: [
            {
                code: 1,
                desc: '版本1'
            },
            {
                code: 2,
                desc: '版本2'
            },
            {
                code: 3,
                desc: '版本3'
            }
        ],
        enum3: (i % 3) + 1
    };
});

// console.log(222)
// console.log(dataSource)

const remoteConfig = {
    fetch: async params => {
        console.log('🍉 params');
        console.log(params);
        const { currentPage, pageSize } = params;
        await sleep(random(0.5, 1.5, true));
        // return Promise.reject();
        return {
            list: dataSource.slice((currentPage - 1) * pageSize, currentPage * pageSize),
            total
        };
    }
};

const DescriptionsData = {
    text: '硕鼠宝',
    enum: 1,
    image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    date: Date.now(),
    digit1: random(1e4, 5e4),
    digit2: null,
    digit3: random(1e4, 5e4),
    digit4: random(1e4, 5e4),
    rate: 4.5,
    progress: 75.23,
    percent1: 0.123456789,
    percent2: 0.123456789,
    code: `const getData = async params => {\n    const data = await getData(params);\n    return { list: data.data, ...data };\n};`,
    jsonCode: {
        a: 1,
        b: [1, 2, { c: 1 }]
    }
};

const DescriptionsColumns = [
    {
        label: '文本',
        name: 'text',
        tooltip: '提示文案: [链接|baidu.com]',
        template: {
            copyable: true
        }
    },
    {
        label: '枚举',
        name: 'enum',
        template: {
            tpl: 'enum',
            shape: 'tag',
            options: SexOptions
        }
    },
    {
        label: '图片',
        name: 'image',
        template: {
            tpl: 'image'
        }
    },
    {
        label: '链接',
        name: 'link',
        template: {
            tpl: 'link',
            render: (text, record) => {
                console.log(record);
                return [
                    {
                        text: '链接1'
                    },
                    {
                        text: '链接2'
                    }
                ];
            }
        }
    },
    {
        label: '日期',
        name: 'date',
        template: {
            tpl: 'date',
            format: 'YYYY-MM-DD'
        }
    },
    {
        label: '数字',
        name: 'digit1',
        template: {
            tpl: 'digit'
        }
    },
    {
        label: '数字-空值',
        name: 'digit2',
        template: {
            tpl: 'digit'
        }
    },
    {
        label: '数字-金额',
        name: 'digit3',
        template: {
            tpl: 'digit',
            prefix: '￥'
        }
    },
    {
        label: '数字-金额',
        name: 'digit4',
        template: {
            tpl: 'digit',
            suffix: '元'
        }
    },
    {
        label: '评分',
        name: 'rate',
        template: {
            tpl: 'rate',
            allowHalf: true
        }
    },
    {
        label: '进度条',
        name: 'progress',
        template: {
            tpl: 'progress',
            type: 'circle'
        }
    },
    {
        label: '百分比',
        name: 'percent1',
        template: {
            tpl: 'percent'
        }
    },
    {
        label: '百分比-千分比',
        name: 'percent2',
        template: {
            tpl: 'percent',
            suffix: '‰',
            times: 3,
            precision: 3
        }
    },
    {
        label: '代码',
        name: 'code',
        template: {
            tpl: 'code'
        }
    },
    {
        label: '代码-json',
        name: 'jsonCode',
        template: {
            tpl: 'code',
            language: 'json'
        }
    }
];

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
        // console.log(this.tableRef.current.getDataSource());
    }

    render() {
        return (
            <ConfigProvider locale={getAntdLocaleZhCN()}>
                <div style={{ padding: 20, background: '#eee' }}>
                    <Card title="Descriptions" size="small">
                        <Descriptions data={DescriptionsData} columns={DescriptionsColumns} />
                    </Card>
                    <Divider />
                    <Card title="搜索区" size="small">
                        <Button type="primary" onClick={this.onClick} size="small">
                            查询
                        </Button>
                        <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" width={50} />
                    </Card>

                    <Divider />
                    <Table
                        ref={this.tableRef}
                        columns={columns}
                        rowKey="name"
                        remoteConfig={remoteConfig}
                        scroll={{ x: 1200 }}
                        prependHeader={
                            <>
                                <Button type="primary">新增</Button>
                                <span>134</span>
                            </>
                        }
                        appendHeader={
                            <>
                                <Button type="primary">新增</Button>
                                <Button type="primary">导出</Button>
                            </>
                        }
                        extraConfig={{
                            showTotal: true,
                            storageKey: 'demo',
                            fullScreen: true
                        }}
                    />
                </div>
            </ConfigProvider>
        );
    }
}

export default App;
