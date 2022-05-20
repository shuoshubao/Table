import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Select, Form } from './antd';
import { find, omit, flatten, isString } from 'lodash';
import { classNames } from '@nbfe/tools';
import EditOutlined from '@ant-design/icons/EditOutlined';
import DynamicForm from '@nbfe/form';
import { getClassNames } from './util.jsx';

const { ComplexInput, RangeNumber, Tabs, Switch, Slider } = DynamicForm;

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const getEditableCell = tableProps => {
    const { editTrigger, size, columns } = tableProps;
    const editTriggerNone = editTrigger === 'none';
    const editTriggerHover = editTrigger === 'hover';
    const editTriggerClick = editTrigger === 'click';
    const EditableCell = props => {
        const { title, editable, children, index, dataIndex, record, rules, handleSave, ...restProps } = props;
        if (!record) {
            return <td {...restProps}>{children}</td>;
        }
        const [editing, setEditing] = useState(editTriggerNone);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        const computedRules = flatten([rules]).filter(Boolean);
        const value = record[dataIndex];

        useEffect(() => {
            if (editTriggerNone) {
                form.setFieldsValue({ [dataIndex]: value })
                return;
            }
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex]
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                let value = values[dataIndex];
                value = isString(value) ? value.trim() : value;
                handleSave({ index, dataIndex, record, value });
            } catch (errInfo) {
                toggleEdit();
                console.error('保存失败:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            const column = find(columns, { dataIndex });
            const { template } = column;
            const { tpl } = template;
            if (editing) {
                let FormItemNode;
                if (tpl === 'input') {
                    const { width = 100 } = template;
                    FormItemNode = (
                        <Input
                            ref={inputRef}
                            onBlur={save}
                            size={size}
                            style={{ width }}
                        />
                    );
                }
                if (tpl === 'select') {
                    const { options = [], width = 100 } = template;
                    FormItemNode = (
                        <Select
                            ref={inputRef}
                            onBlur={save}
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
                childNode = (
                    <Form.Item
                        style={{
                            margin: 0
                        }}
                        name={dataIndex}
                        rules={computedRules}
                    >
                        {FormItemNode}
                    </Form.Item>
                );
            } else {
                childNode = (
                    <div
                        className={classNames({
                            [getClassNames('editable-cell-value-wrap')]: editTriggerHover
                        })}
                        style={{
                            paddingRight: 24
                        }}
                        onClick={() => {
                            if (editTriggerHover) {
                                toggleEdit();
                            }
                        }}
                    >
                        {children}
                        {editTriggerClick && (
                            <EditOutlined onClick={toggleEdit} style={{ color: '#1890ff', marginLeft: 4 }} />
                        )}
                    </div>
                );
            }
        }

        return <td {...restProps}>{childNode}</td>;
    };
    return EditableCell;
};

export default tableProps => {
    return {
        body: {
            row: EditableRow,
            cell: getEditableCell(tableProps)
        }
    };
};
