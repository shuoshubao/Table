import React, { Component } from 'react';
import { random, range } from 'lodash';
import { ConfigProvider, Button, Card, Divider } from 'antd';
import { sleep, fakeFetch, getAntdLocaleZhCN } from '@nbfe/tools';
import 'antd/dist/antd.css';
import 'rc-image/assets/index.css';
import { AreaChartOutlined } from '@ant-design/icons';
import { blue, red } from '@ant-design/colors';
import Table from '../lib';
import '../lib/index.less';

const { Descriptions, Image } = Table;

const Options = [
    {
        label: '选项1',
        value: 1
    },
    {
        label: '选项2',
        value: 2
    },
    {
        label: '选项3',
        value: 3
    }
];

const SexOptions = [
    {
        label: '男',
        value: 1,
        color: blue.primary
    },
    {
        label: '女',
        value: 2,
        color: red.primary
    }
];

const CascaderOptions = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou'
            }
        ]
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'suzhou',
                label: 'Suzhou'
            }
        ]
    }
];

const columns = [
    {
        title: '排序',
        width: 50,
        template: {
            tpl: 'sort'
            // handler: <AreaChartOutlined />
        }
    },
    {
        title: 'ID',
        dataIndex: 'id'
    },
    {
        title: '文本',
        dataIndex: 'text',
        // editable: true,
        width: 150,
        template: {
            // tpl: 'input'
            // disabled: true
        }
    },
    // {
    //     title: '复选框',
    //     dataIndex: 'checkbox',
    //     // editable: true,
    //     width: 300
    //     // template: {
    //     //     tpl: 'checkbox',
    //     //     disabled: true,
    //     //     // options: Options,
    //     //     remoteConfig: {
    //     //         fetch: async () => {
    //     //             console.log('请求了 checkbox');
    //     //             await sleep(random(0.5, 1.5, true));
    //     //             return Options;
    //     //         }
    //     //     }
    //     // }
    // },
    {
        title: '单选框',
        dataIndex: 'radio',
        // editable: true,
        width: 150,
        template: {
            tpl: 'enum',
            disabled: true,
            options: SexOptions,
            shape: 'circle'
        }
    },
    {
        title: '日期',
        dataIndex: 'date1',
        editable: true,
        width: 150,
        template: {
            tpl: 'date-picker'
        }
    },
    {
        title: '日期范围',
        dataIndex: 'date21,date22',
        editable: true,
        width: 260,
        template: {
            tpl: 'date-range-picker'
        }
    },
    {
        title: '时间',
        dataIndex: 'time1',
        editable: true,
        width: 150,
        template: {
            tpl: 'time-picker',
            // format: 'HH:mm:ss',
            format: 'HH:mm'
            // format: 'HH',
        }
    },
    {
        title: '时间范围',
        dataIndex: 'time21,time22',
        editable: true,
        width: 200,
        template: {
            tpl: 'time-range-picker'
            // format: 'HH:mm:ss',
            // format: 'HH:mm',
            // format: 'HH',
        }
    },
    {
        title: '数字',
        dataIndex: 'number',
        editable: true,
        template: {
            tpl: 'number'
        }
    },
    {
        title: '数字范围',
        dataIndex: 'number1,number2',
        editable: true,
        width: 230,
        template: {
            tpl: 'number-range'
        }
    },
    {
        title: '枚举1',
        dataIndex: 'enum1',
        editable: true,
        template: {
            tpl: 'select',
            remoteConfig: {
                fetch: async () => {
                    // console.log(111);
                    await sleep(random(0.5, 1.5, true));
                    return [
                        {
                            label: '男',
                            value: 1
                        },
                        {
                            label: '女',
                            value: 2
                        }
                    ];
                }
            }
        }
    },
    {
        title: '枚举2',
        dataIndex: 'enum2',
        editable: true,
        template: {
            tpl: 'select',
            remoteConfig: {
                fetch: async () => {
                    // console.log(222);
                    await sleep(random(0.5, 1.5, true));
                    return [
                        {
                            label: '在线',
                            value: 1
                        },
                        {
                            label: '离线',
                            value: 2
                        },
                        {
                            label: '审批中',
                            value: 3
                        }
                    ];
                }
            }
        }
    },
    {
        title: '枚举3',
        dataIndex: 'enum3',
        editable: true,
        width: 300,
        template: {
            tpl: 'cascader',
            remoteConfig: {
                fetch: async () => {
                    console.log('请求了 cascader');
                    await sleep(random(0.5, 1.5, true));
                    return CascaderOptions;
                }
            }
        }
    },
    {
        title: '枚举4',
        dataIndex: 'enum4',
        editable: true,
        width: 300,
        template: {
            tpl: 'tree-select',
            multiple: true,
            treeDefaultExpandAll: true,
            remoteConfig: {
                fetch: async () => {
                    console.log('请求了 tree-select');
                    await sleep(random(0.5, 1.5, true));
                    return CascaderOptions;
                }
            }
        }
    },
    {
        title: '评分',
        dataIndex: 'rate',
        editable: true,
        template: {
            tpl: 'rate'
        }
    },
    {
        title: 'switch',
        dataIndex: 'switch',
        // editable: true,
        template: {
            tpl: 'switch',
            disabled: true
        }
    },
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
                        text: '保存',
                        onClick: () => {
                            console.log(record);
                        }
                    },
                    {
                        text: '删除',
                        danger: true,
                        onClick: () => {}
                    }
                ];
            }
        }
    }
];

const itemDataSource = [
    {
        text: 'demo',
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

const total = 3;

// const dataSource = range(0, total).map((v, i) => {
//     return {
//         id: i,
//         ...itemDataSource[0],
//         name: itemDataSource[0].name + v,
//         imgSrc: i % 3 ? itemDataSource[0].imgSrc : 'error',
//         enum1: i % 3,
//         enum2: i % 2 ? 1 : 2,
//         enum3List: [
//             {
//                 code: 1,
//                 desc: '版本1'
//             },
//             {
//                 code: 2,
//                 desc: '版本2'
//             },
//             {
//                 code: 3,
//                 desc: '版本3'
//             }
//         ],
//         enum3: (i % 3) + 1
//     };
// });

const dataSource = [
    {
        id: 21,
        text: 'demo21',
        checkbox: [1],
        radio: 1,
        date1: '2022-03-14',
        time1: '02:32:19',
        time21: '11:11:11',
        time22: '22:22:22',
        date21: '2022-01-01',
        date22: '2022-01-07',
        enum1: 1,
        enum2: 3,
        enum3: ['jiangsu', 'suzhou'],
        enum4: [],
        number: 111,
        number1: 33,
        number2: 54,
        rate: 2,
        switch: false
    },
    {
        id: 22,
        text: 'test22',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: true
    },
    {
        id: 23,
        text: 'test23',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: false
    },
    {
        id: 31,
        text: 'test31',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: false
    },
    {
        id: 32,
        text: 'test32',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: false
    },
    {
        id: 33,
        text: 'test33',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: false
    },
    {
        id: 41,
        text: 'test41',
        checkbox: [2, 3],
        radio: 2,
        date1: '2022-02-02',
        time1: '12:34:56',
        time21: '11:22:33',
        time22: '11:11:55',
        date21: '',
        date22: '',
        enum1: 2,
        enum2: 1,
        enum3: ['jiangsu', 'suzhou'],
        enum4: ['jiangsu', 'suzhou'],
        number: 222,
        number1: 11,
        number2: 22,
        rate: null,
        switch: false
    }
];

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

const getPaginationData = (params, dataSource = []) => {
    const { currentPage, pageSize } = params;
    const pivot = (currentPage - 1) * pageSize;
    const list = dataSource.slice(pivot, currentPage * pageSize);
    return {
        list,
        total: dataSource.length
    };
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
        // console.log(this.tableRef.current.getDataSource());
    }

    render() {
        return (
            <ConfigProvider locale={getAntdLocaleZhCN()}>
                <div style={{ padding: 20, background: '#eee' }}>
                    <Divider />
                    <Table
                        ref={this.tableRef}
                        columns={columns}
                        rowKey="id"
                        // rowKey={record => {
                        //     return [record.id, record.date1].join('_');
                        // }}
                        // dataSource={dataSource}
                        remoteConfig={{
                            fetch: async params => {
                                console.log('请求了');
                                console.log(params);
                                await sleep();
                                return getPaginationData(params, dataSource);
                                // return {
                                //     list: dataSource
                                // };
                            }
                        }}
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
                        pagination={{
                            defaultPageSize: 3
                        }}
                        extraConfig={{
                            showTotal: true,
                            storageKey: 'demo',
                            fullScreen: true
                        }}
                        draggable={false}
                        onDragSortEnd={({ newDataSource, dataSource, fromIndex, toIndex }) => {
                            console.log(222, fromIndex, toIndex);
                            console.log(dataSource);
                            console.log(newDataSource);
                        }}
                    />
                </div>
            </ConfigProvider>
        );
    }
}

export default App;
