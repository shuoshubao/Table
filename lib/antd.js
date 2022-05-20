// vite 不支持 antd 的 import { comP } from 'antd' 的写法

import {
    version,
    message,
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    Radio,
    Checkbox,
    TreeSelect,
    Table,
    Tooltip
} from 'antd/dist/antd'; // v4
// } from 'antd'; // v4

export { version, message, Button, Card, Dropdown, Form, Input, Radio, Checkbox, TreeSelect, Table, Tooltip };
