// vite 不支持 antd 的 import { comP } from 'antd' 的写法

import {
    version,
    message,
    Button,
    Card,
    Checkbox,
    Dropdown,
    Form,
    Input,
    Popconfirm,
    Radio,
    Table,
    Tooltip
// } from 'antd/dist/antd'; // v3
} from 'antd'; // v4

export { version, message, Button, Card, Checkbox, Dropdown, Form, Input, Popconfirm, Radio, Table, Tooltip };
