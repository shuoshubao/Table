import React, { useContext, useState, useEffect, useRef } from 'react';
import { isString, flatten } from 'lodash';
import EditOutlined from '@ant-design/icons/EditOutlined';
import { Input, Form } from './antd';
import { getClassNames } from './util.jsx';
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

const EditableCell = props => {
    const { title, editable, children, index, dataIndex, record, rules, handleSave, ...restProps } = props;
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const computedRules = flatten([rules]).filter(Boolean);
    useEffect(() => {
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
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        if (editing) {
            childNode = (
                <Form.Item
                    style={{
                        margin: 0
                    }}
                    name={dataIndex}
                    rules={computedRules}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            );
        } else {
            childNode = (
                <div
                    className={getClassNames('editable-cell-value-wrap')}
                    style={{
                        paddingRight: 24
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
    }

    return <td {...restProps}>{childNode}</td>;
};

export default {
    body: {
        row: EditableRow,
        cell: EditableCell
    }
};
