import React, { useContext, useEffect } from 'react';
import { Input, Form } from 'antd';
import { find, omit, flatten, isString } from 'lodash';
import { Select, RangeNumber, Switch, Slider } from './components';

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
    const { size, columns } = tableProps;
    return props => {
        const { title, editable, children, index, dataIndex, record, rules, handleSave, ...restProps } = props;
        if (!record) {
            return <td {...restProps}>{children}</td>;
        }
        const form = useContext(EditableContext);
        const computedRules = flatten([rules]).filter(Boolean);
        const value = record[dataIndex];

        useEffect(() => {
            form.setFieldsValue({ [dataIndex]: value });
        });

        const save = async () => {
            try {
                const values = await form.validateFields();
                let value = values[dataIndex];
                value = isString(value) ? value.trim() : value;
                handleSave({ index, dataIndex, record, value });
            } catch (errInfo) {
                // eslint-disable-next-line no-console
                console.error('保存失败:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            const column = find(columns, { dataIndex });
            const { template } = column;
            const { tpl } = template;
            const { width = 100 } = template;
            let FormItemNode;
            const FormItemNodeProps = {
                onBlur: save,
                size,
                style: { width }
            };
            if (tpl === 'input') {
                FormItemNode = <Input onPressEnter={save} onBlur={save} {...FormItemNodeProps} />;
            }
            if (tpl === 'select') {
                Object.assign(FormItemNodeProps, omit(template, ['emptyText']));
                FormItemNode = <Select {...FormItemNodeProps} onCustomChange={save} />;
            }
            if (tpl === 'range-number') {
                FormItemNode = <RangeNumber {...FormItemNodeProps} onCustomChange={save} />;
            }
            if (tpl === 'switch') {
                FormItemNode = <Switch {...FormItemNodeProps} onCustomChange={save} />;
            }
            if (tpl === 'slider') {
                FormItemNode = <Slider {...FormItemNodeProps} onCustomChange={save} />;
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
        }

        return <td {...restProps}>{childNode}</td>;
    };
};

export default tableProps => {
    return {
        body: {
            row: EditableRow,
            cell: getEditableCell(tableProps)
        }
    };
};
