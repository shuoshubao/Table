import { range } from 'lodash';
import Table from './Table';

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age'
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address'
    }
];

const dataSource = [
    {
        name: '胡彦斌',
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
            <Table columns={columns} remoteConfig={remoteConfig} rowKey="name" />
        </div>
    );
};

export default App;
