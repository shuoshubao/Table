import React from 'react';
import { Button, Typography, Image } from './antd';
import { get, omit, flatten } from 'lodash';
import FileImageOutlined from '@ant-design/icons/FileUnknownOutlined';
import { getLabelByValue, isEmptyObject, stringifyUrl, formatTime } from '@nbfe/tools';

const { Paragraph } = Typography;

const getValue = (column, record) => {
    const { dataIndex, template } = column;
    return get(record, template.dataIndex || dataIndex);
};

export default column => {
    const { dataIndex, template } = column;
    const { tpl, emptyText } = template;
    return (text, record, index) => {
        // 普通文本
        if (tpl === 'text') {
            const value = getValue(column, record);
            const props = omit(template, ['tpl', 'emptyText']);
            if (props.ellipsis) {
                props.ellipsis = {
                    tooltip: <div style={{ maxHeight: 400, overflowY: 'auto' }}>{value}</div>,
                    ...props.ellipsis
                };
            }
            return <Paragraph {...props}>{value}</Paragraph>;
        }
        // 枚举
        if (tpl === 'enum') {
            const { options = [] } = template;
            const value = getValue(column, record);
            return getLabelByValue(value, options, emptyText);
        }
        // 图片
        if (tpl === 'image') {
            const { width = 50, height = 50 } = template;
            const props = omit(template, ['tpl', 'emptyText']);
            const value = getValue(column, record);
            if (value) {
                return <Image src={value} alt="" width={width} height={height} {...props} />;
            }
            return <FileImageOutlined style={{ fontSize: width }} />;
        }
        // 日期
        if (tpl === 'date') {
            const { format = 'YYY-MM-DD' } = template;
            const value = getValue(column, record);
            return formatTime(value, format, emptyText);
        }
        // 链接
        if (tpl === 'link') {
            const { render } = template;
            const list = flatten([render(text, record, index)]);
            return list.map((v, i) => {
                const { text, visible = true, query = {} } = v;
                const props = omit(v, ['text', 'visible', 'query']);
                const defaultProps = {
                    type: 'link',
                    size: 'small',
                    children: text
                };
                if (!isEmptyObject(query)) {
                    props.href = stringifyUrl(props.href || '', query);
                }
                if (!visible) {
                    return null;
                }
                return <Button key={[i, text].join()} type="link" size="small" {...{ ...defaultProps, ...props }} />;
            });
        }
    };
};
