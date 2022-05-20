import React from 'react';
import { Table, Input, Button, Form } from 'antd';
import { find, omit, flatten, isString } from 'lodash';
import { EditOutlined } from './Icons';
import { classNames } from '@nbfe/tools';
import DynamicForm from '@nbfe/form';
import { getClassNames } from './util';

const { Select, RangeNumber, Switch, Slider } = DynamicForm;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    );
};

const getEditableCell = tableProps => {
    const { size, columns } = tableProps;
    class EditableCell extends React.Component {
        constructor(props) {
            super(props);
        }

        save = e => {
            const { index, dataIndex, record, handleSave } = this.props;
            this.form.validateFields((error, values) => {
                if (error && error[e.currentTarget.id]) {
                    console.error('保存失败:', error[e.currentTarget.id]);
                    return;
                }
                let value = values[dataIndex];
                value = isString(value) ? value.trim() : value;
                handleSave({ index, dataIndex, record, value });
            });
        };

        renderCell = form => {
            this.form = form;
            const { children, dataIndex, rules, record, title } = this.props;
            let childNode = children;
            const computedRules = flatten([rules]).filter(Boolean);
            const column = find(columns, { dataIndex });
            const { template } = column;
            const { tpl } = template;
            const value = record[dataIndex];
            const { width = 100 } = template;
            let FormItemNode;
            const FormItemNodeProps = {
                ref: node => {
                    this.input = node;
                },
                size,
                style: { width }
            };
            if (tpl === 'input') {
                FormItemNode = <Input onPressEnter={this.save} onBlur={this.save} {...FormItemNodeProps} />;
            }
            if (tpl === 'select') {
                Object.assign(FormItemNodeProps, omit(template, ['emptyText']));
                FormItemNode = <Select {...FormItemNodeProps} onCustomChange={this.save} />;
            }
            if (tpl === 'range-number') {
                FormItemNode = <RangeNumber {...FormItemNodeProps} onCustomChange={this.save} />;
            }
            if (tpl === 'switch') {
                FormItemNode = <Switch {...FormItemNodeProps} onCustomChange={this.save} />;
            }
            if (tpl === 'slider') {
                FormItemNode = <Slider {...FormItemNodeProps} onCustomChange={this.save} />;
            }
            childNode = (
                <Form.Item style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                        rules: computedRules,
                        initialValue: record[dataIndex]
                    })(FormItemNode)}
                </Form.Item>
            );
            return <div>{childNode}</div>;
        };

        render() {
            const { editable, dataIndex, title, record, index, handleSave, children, rules, ...restProps } = this.props;
            return (
                <td {...restProps}>
                    {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
                </td>
            );
        }
    }
    return EditableCell;
};

export default tableProps => {
    const EditableFormRow = Form.create()(EditableRow);
    return {
        body: {
            row: EditableFormRow,
            cell: getEditableCell(tableProps)
        }
    };
};
