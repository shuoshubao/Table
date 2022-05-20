import React from 'react';
import { Input, Select } from './antd';

export const EditRenderTplList = ['input', 'select'];

export default (column, context) => {
    return (text, record, index) => {
        return <Input />;
    };
};
