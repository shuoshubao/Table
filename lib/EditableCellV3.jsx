import React from 'react';
import { Table, Input, Select, Button, Form } from './antd';
import { find, omit, flatten, isString } from 'lodash';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { classNames } from '@nbfe/tools';
import DynamicForm from '@nbfe/form';
import { getClassNames } from './util.jsx';

const { ComplexInput, RangeNumber, Tabs, Switch, Slider } = DynamicForm;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    );
};

const getEditableCell = tableProps => {
    const { editTrigger, size, columns } = tableProps;
    const editTriggerNone = editTrigger === 'none';
    const editTriggerHover = editTrigger === 'hover';
    const editTriggerClick = editTrigger === 'click';
    class EditableCell extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                editing: editTriggerNone
            };
        }

        toggleEdit = () => {
            const editing = !this.state.editing;
            this.setState({ editing }, () => {
                if (editing) {
                    this.input.focus();
                }
            });
        };

        save = e => {
            // if (editTriggerNone) {
            //     return;
            // }
            const { index, dataIndex, record, handleSave } = this.props;
            this.form.validateFields((error, values) => {
                if (error && error[e.currentTarget.id]) {
                    console.error('保存失败:', error[e.currentTarget.id]);
                    this.toggleEdit();
                    return;
                }
                this.toggleEdit();
                let value = values[dataIndex];
                value = isString(value) ? value.trim() : value;
                handleSave({ index, dataIndex, record, value });
            });
        };

        renderCell = form => {
            this.form = form;
            const { children, dataIndex, rules, record, title } = this.props;
            const { editing } = this.state;
            const computedRules = flatten([rules]).filter(Boolean);
            const column = find(columns, { dataIndex });
            const { template } = column;
            const { tpl } = template;
            const value = record[dataIndex];
            if (editing) {
                let FormItemNode;
                if (tpl === 'input') {
                    const { width = 100 } = template;
                    FormItemNode = (
                        <Input
                            ref={node => {
                                this.input = node;
                            }}
                            onPressEnter={this.save}
                            onBlur={this.save}
                            size={size}
                            style={{ width }}
                        />
                    );
                }
                if (tpl === 'select') {
                    const { options = [], width = 100 } = template;
                    FormItemNode = (
                        <Select
                            ref={node => {
                                this.input = node;
                            }}
                            onBlur={this.save}
                            size={size}
                            style={{ width }}
                        >
                            {options.map(v => {
                                return (
                                    <Select.Option key={v.value} {...omit(v, ['label', 'options'])}>
                                        {v.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                }
                return (
                    <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: computedRules,
                            initialValue: record[dataIndex]
                        })(FormItemNode)}
                    </Form.Item>
                );
            }
            return (
                <div
                    className={classNames({
                        [getClassNames('editable-cell-value-wrap')]: editTriggerHover
                    })}
                    style={{ paddingRight: editTriggerHover ? 24 : 0 }}
                    onClick={() => {
                        if (editTriggerHover) {
                            this.toggleEdit();
                        }
                    }}
                >
                    {children}
                    {editTriggerClick && (
                        <EditOutlined onClick={this.toggleEdit} style={{ color: '#1890ff', marginLeft: 4 }} />
                    )}
                </div>
            );
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
