import React from 'react';
import { Button, Typography, Tag, Image, Tooltip, Popconfirm, Modal, Menu, Dropdown } from './antd';
import { get, filter, find, omit, flatten, merge, noop, isString, isObject } from 'lodash';
import FileImageOutlined from '@ant-design/icons/FileImageOutlined';
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import { getLabelByValue, isEmptyValue, isEmptyObject, isEmptyArray, stringifyUrl, formatTime } from '@nbfe/tools';
import { getClassNames, getTooltipTitleNode } from './util.jsx';

const { Paragraph } = Typography;

const getValue = (column, record, emptyText) => {
    const { dataIndex, template } = column;
    const value = get(record, template.dataIndex || dataIndex);
    return isEmptyValue(value) ? emptyText : value;
};

const renderButtonList = (list, context) => {
    return list.map((v, i) => {
        const { text, key, visible, query, tooltip, isMore, PopconfirmConfig, ModalConfirmConfig } = v;
        const props = omit(v, [
            'key',
            'text',
            'visible',
            'query',
            'tooltip',
            'isMore',
            'PopconfirmConfig',
            'ModalConfirmConfig'
        ]);
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
        const getButtonNode = (extraProps = {}) => {
            const buttonNode = (
                <Button key={key} type="link" size="small" {...{ ...defaultProps, ...props, ...extraProps }} />
            );
            if (tooltip) {
                return (
                    <Tooltip title={getTooltipTitleNode(tooltip)} key={key}>
                        {buttonNode}
                    </Tooltip>
                );
            }
            return buttonNode;
        };
        if (PopconfirmConfig) {
            return (
                <Popconfirm
                    {...PopconfirmConfig}
                    key={key}
                    onConfirm={async () => {
                        await PopconfirmConfig.onConfirm();
                        context.handleSearch({}, false);
                    }}
                >
                    {getButtonNode()}
                </Popconfirm>
            );
        }
        if (ModalConfirmConfig) {
            const handleClick = () => {
                Modal.confirm({
                    ...ModalConfirmConfig,
                    onOk: async () => {
                        await ModalConfirmConfig.onOk();
                        context.handleSearch({}, false);
                    }
                });
            };
            return getButtonNode({ onClick: handleClick });
        }
        return getButtonNode();
    });
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
            const list = flatten([render(text, record, index)]).map((v, i) => {
                const { text, icon, tooltip } = v;
                let iconName = '';
                if (isString(icon)) {
                    iconName = icon;
                }
                if (isObject(icon)) {
                    iconName = get(icon, 'type.render.displayName');
                }
                const key = [i, text, iconName, tooltip].join();
                return merge(
                    {},
                    {
                        key,
                        visible: true,
                        query: {},
                        tooltip: '',
                        isMore: false
                    },
                    v
                );
            });

            const dropdownList = filter(list, { isMore: true });

            const menu = (
                <Menu>
                    {dropdownList.map(v => {
                        return <Menu.Item key={v.key}>{renderButtonList([v], context)}</Menu.Item>;
                    })}
                </Menu>
            );

            return [
                ...renderButtonList(filter(list, { isMore: false }), context),
                !isEmptyArray(dropdownList) && (
                    <Dropdown
                        key="Dropdown"
                        overlayClassName={getClassNames('render-link-dropdown')}
                        overlay={menu}
                        placement="bottomRight"
                        arrow
                    >
                        <Button icon={<EllipsisOutlined />} type="link" size="small" />
                    </Dropdown>
                )
            ];
        }
    };
};
