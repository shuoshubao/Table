import { range } from 'lodash';
import { Button } from 'antd';
import Table from './Table';

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        filters: [
            {
                text: '胡彦祖1',
                value: 'aa'
            },
            {
                text: '胡彦祖2',
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
                text: '32',
                value: 32
            },
            {
                text: '42',
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

const App = () => {
    return (
        <div className="App">
            <Table
                columns={columns}
                remoteConfig={remoteConfig}
                rowKey="name"
                prependHeader={<a>新增</a>}
                appendHeader={[<Button type="primary">设置表头</Button>, <a style={{marginLeft: 10}}>设置颜色</a>]}
            />
        </div>
    );
};

export default App;
