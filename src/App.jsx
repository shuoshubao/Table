import React, { Component } from 'react';
import { range } from 'lodash';
import { Button } from 'antd';
import Table from '../lib/index';

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
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
        title: '住址1',
        dataIndex: 'address1'
    },
    {
        title: '住址2',
        dataIndex: 'address2'
    },
    {
        title: '住址3',
        visible: false,
        dataIndex: 'address3'
    }
];

const dataSource = [
    {
        name: '胡彦祖',
        age: 32,
        address1: '西湖区湖底公园1号',
        address2: '西湖区湖底公园1号',
        address3: '西湖区湖底公园1号',
    },
    {
        name: '胡彦祖',
        age: 42,
        address1: '西湖区湖底公园1号',
        address2: '西湖区湖底公园1号',
        address3: '西湖区湖底公园1号',
    }
];

const remoteConfig = {
    fetch: async params => {
        const total = 92;
        console.log('🍉 params');
        console.log(params);
        return {
            list: range(0, total).map(v => {
                return {
                    ...dataSource[0],
                    name: dataSource[0].name + v
                };
            }),
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
        this.tableRef.current.search();
    }

    onClick() {
        this.tableRef.current.search();
    }

    render() {
        return (
            <div style={{ padding: 20 }}>
                <Button type="primary" onClick={this.onClick}>
                    查询
                </Button>
                <Table ref={this.tableRef} columns={columns} remoteConfig={remoteConfig} rowKey="name" />
            </div>
        );
    }
}

export default App;
