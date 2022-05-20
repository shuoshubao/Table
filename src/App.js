import React, { Component } from 'react';
import { range } from 'lodash';
import { Button } from 'antd';
import Table from './Table';

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
        title: '住址',
        dataIndex: 'address'
    }
];

const dataSource = [
    {
        name: '胡彦祖',
        age: 32,
        address: '西湖区湖底公园1号'
    },
    {
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
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

    onClick() {
        this.tableRef.current.search();
    }

    render() {
        return (
            <div className="App">
                <Button type="primary" onClick={this.onClick}>
                    查询
                </Button>
                <Table ref={this.tableRef} columns={columns} remoteConfig={remoteConfig} rowKey="name" />
            </div>
        );
    }
}

export default App;
