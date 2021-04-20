import React, { useContext, useState, useEffect, useRef } from 'react';
import { Input, Form } from 'antd';
import { flatten } from 'lodash';
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
    const { title, editable, children, dataIndex, rules, record, handleSave, ...restProps } = props;
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
            handleSave({ ...record, ...values });
        } catch (errInfo) {
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
