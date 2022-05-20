import React from 'react';
import ConfigProvider from 'antd/lib/config-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import App from './App.jsx';

ReactDOM.render(
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>,
    document.querySelector('#root')
);
