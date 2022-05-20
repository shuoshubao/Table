import React from 'react';
import { isString, flatten } from 'lodash';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { classNames } from '@nbfe/tools';
import { Table, Input, Button, Form } from './antd';
import { getClassNames } from './util.jsx';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    );
};

const getEditableCell = tableProps => {
    const { editTrigger, size } = tableProps;
    const editTriggerHover = editTrigger === 'hover';
    const editTriggerClick = editTrigger === 'click';
    class EditableCell extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                editing: false
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
            const { index, dataIndex, record, handleSave } = this.props;
            this.form.validateFields((error, values) => {
                if (error && error[e.currentTarget.id]) {
                    console.log('Save failed:', error[e.currentTarget.id]);
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
            if (editing) {
                return (
                    <Form.Item style={{ margin: 0 }}>
                        {form.getFieldDecorator(dataIndex, {
                            rules: computedRules,
                            initialValue: record[dataIndex]
                        })(
                            <Input
                                ref={node => {
                                    this.input = node;
                                }}
                                onPressEnter={this.save}
                                onBlur={this.save}
                                size={size}
                            />
                        )}
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
