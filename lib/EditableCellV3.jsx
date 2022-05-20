import React from 'react';
import { Table, Input, Button, Popconfirm, Form } from './antd';
import { flatten } from 'lodash';
import { getClassNames } from './util.jsx';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    );
};

class EditableCell extends React.Component {
    state = {
        editing: false
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
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
                        />
                    )}
                </Form.Item>
            );
        }
        return (
            <div
                className={getClassNames('editable-cell-value-wrap')}
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const { editable, dataIndex, title, record, index, handleSave, children, ...restProps } = this.props;
        return (
            <td {...restProps}>
                {editable ? <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer> : children}
            </td>
        );
    }
}

export default {
    body: {
        row: EditableRow,
        cell: EditableCell
    }
};
