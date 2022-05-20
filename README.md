# 简介

基于 [antd-table](https://ant.design/components/table-cn/) 进行二次封装

-   接口请求
    -   分页处理与接口请求的集成
    -   筛选功能与接口请求的集成
    -   debounce 优化, 防止因代码原因短时间内重复触发请求
-   渲染器
    -   空值默认处理
    -   普通文本
        -   多行省略号
        -   数组类型
    -   枚举
    -   图片
    -   日期
    -   链接/按钮

# 安装

```text
npm i @nbfe/table
```

# 使用

## 数据来自接口

```js
// import '@nbfe/table/dist/index.css'; // 样式在项目的入口文件引入即可
import Table from '@nbfe/table';

const dataSource = [
    {
        id: '1',
        name: '硕鼠宝',
        age: 18
    }
];

const remoteConfig = {
    fetch: async (params) => {
        return axios.get('/xx', { params });
        // 任意 promise 都可以, 不局限于 fetch 请求
        await sleep(3);
        return dataSource;
    },
    dataSourceKey: 'list',
    totalKey: 'total',
    pageSizeKey: 'pageSize',
    currentPageKey: 'currentPage'
}

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 60
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 80
    },
    {
        title: '年龄',
        dataIndex: 'name',
        width: 60
    }
]

<Table remoteConfig={remoteConfig} columns={columns} rowKey="id" />;
```

## 数据固定

```js
import Table from '@nbfe/table';
// import '@nbfe/table/dist/index.css'; // 样式文件在项目的入口文件引入即可

const dataSource = [
    {
        id: '1',
        name: '硕鼠宝',
        age: 18
    }
];

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 60
    },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 80
    },
    {
        title: '年龄',
        dataIndex: 'name',
        width: 60
    }
]

<Table dataSource={dataSource} columns={columns} rowKey="id" />;
```
