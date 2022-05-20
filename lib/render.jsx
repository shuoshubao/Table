import React from 'react';
import { Button, Typography, Tag, Image, Tooltip, Popconfirm } from './antd';
import { get, find, omit, flatten, noop } from 'lodash';
import { FileImageOutlined } from '@ant-design/icons';
import { getLabelByValue, isEmptyValue, isEmptyObject, stringifyUrl, formatTime } from '@nbfe/tools';
import { getClassNames, getTooltipTitleNode } from './util.jsx';

const { Paragraph } = Typography;

const getValue = (column, record, emptyText) => {
    const { dataIndex, template } = column;
    const value = get(record, template.dataIndex || dataIndex);
    return isEmptyValue(value) ? emptyText : value;
};

export default (column, context) => {
    const { dataIndex, template } = column;
    const { tpl, emptyText } = template;
    return (text, record, index) => {
        // 普通文本
        if (tpl === 'text') {
            const value = getValue(column, record, emptyText);
            const props = omit(template, ['tpl', 'emptyText', 'separator']);
            if (Array.isArray(value)) {
                // 分隔符
                const { separator = '' } = template;
                if (separator === 'div') {
                    return value.map((v, i) => {
                        return <div key={[i].join()}>{v}</div>;
                    });
                }
                return value.join(separator);
            }
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
            const { options = [], shape = 'text' } = template;
            const value = getValue(column, record, emptyText);
            const valueText = getLabelByValue(value, options, emptyText);
            if (valueText === emptyText) {
                return valueText;
            }
            const itemProps = omit(find(options, { value }), ['value', 'label']);
            if (shape === 'tag') {
                return <Tag {...itemProps}>{valueText}</Tag>;
            }
            if (['dot', 'square'].includes(shape)) {
                const { color = 'rgba(0, 0, 0, 0.85)' } = itemProps;
                return (
                    <span className={getClassNames(['render-enum', shape].join('-'))}>
                        <span className={getClassNames('render-enum-badge')} style={{ backgroundColor: color }} />
                        <span style={{ color: color }}>{valueText}</span>
                    </span>
                );
            }
            return valueText;
        }
        // 图片
        if (tpl === 'image') {
            const { width = 50, height = 50 } = template;
            const props = omit(template, ['tpl', 'emptyText']);
            const value = getValue(column, record, '');
            if (value) {
                return <Image src={value} alt="" width={width} height={height} {...props} />;
            }
            return <FileImageOutlined style={{ fontSize: width }} />;
        }
        // 日期
        if (tpl === 'date') {
            const { format = 'YYY-MM-DD' } = template;
            const value = getValue(column, record, '');
            return formatTime(value, format, emptyText);
        }
        // 链接
        if (tpl === 'link') {
            const { render } = template;
            const list = flatten([render(text, record, index)]);
            return list.map((v, i) => {
                const { text, visible = true, query = {}, tooltip = '', PopconfirmConfig } = v;
                const props = omit(v, ['text', 'visible', 'query', 'tooltip', 'PopconfirmConfig']);
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
                const buttonNode = (
                    <Button key={[i, text].join()} type="link" size="small" {...{ ...defaultProps, ...props }} />
                );
                if (tooltip) {
                    return <Tooltip title={getTooltipTitleNode(tooltip)}>{buttonNode}</Tooltip>;
                }
                if (PopconfirmConfig) {
                    let onConfirm = noop;
                    if (PopconfirmConfig.onConfirm) {
                        onConfirm = async () => {
                            await PopconfirmConfig.onConfirm();
                            context.handleSearch({}, false);
                        };
                    }
                    return (
                        <Popconfirm {...PopconfirmConfig} onConfirm={onConfirm}>
                            {buttonNode}
                        </Popconfirm>
                    );
                }
                return buttonNode;
            });
        }
    };
};