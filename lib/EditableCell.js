import React, { useContext, useEffect } from 'react';
import { InputNumber, DatePicker } from 'antd';
import { get, find, omit, flatten, isString } from 'lodash';
import moment from 'moment';
import { Input, Select, RangeNumber, Switch, Slider } from './components';
import Form from './Form';

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
        const { editable, children, index, dataIndex, record, rules, handleSave } = props;
        const restProps = omit(props, ['editable', 'children', 'index', 'dataIndex', 'record', 'rules', 'handleSave']);
        if (!record) {
            return <td {...restProps}>{children}</td>;
        }
        const form = useContext(EditableContext);
        const computedRules = flatten([rules]).filter(Boolean);
        let value = get(record, dataIndex);

        useEffect(() => {
            form.setFieldsValue({ [dataIndex]: value });
        });

        const save = async () => {
            try {
                const values = await form.validateFields();
                let tempValue = get(values, dataIndex);
                tempValue = isString(tempValue) ? tempValue.trim() : tempValue;
                handleSave({ index, dataIndex, record, value: tempValue });
            } catch (errInfo) {
                // eslint-disable-next-line no-console
                console.error('保存失败:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            const column = find(columns, { dataIndex });
            const { width, template } = column;
            const { tpl } = template;
            let FormItemNode;
            const FormItemNodeProps = {
                onBlur: save,
                size,
                style: { width: width ? width - 20 : 100 }
            };
            Object.assign(FormItemNodeProps, omit(template, ['emptyText']));
            if (tpl === 'input') {
                FormItemNodeProps.inputWidth = FormItemNodeProps.style.width;
                FormItemNode = <Input {...FormItemNodeProps} onPressEnter={save} onBlur={save} />;
            }
            if (tpl === 'input-number') {
                FormItemNode = <InputNumber {...FormItemNodeProps} onChange={save} />;
            }
            if (tpl === 'select') {
                FormItemNode = <Select {...FormItemNodeProps} onCustomChange={save} />;
            }
            if (tpl === 'range-number') {
                FormItemNode = <RangeNumber {...FormItemNodeProps} onCustomChange={save} />;
            }
            if (tpl === 'date-picker') {
                value = new Date(value);
                value = moment(value);
                FormItemNode = <DatePicker {...FormItemNodeProps} onChange={save} />;
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
                    initialValue={value}
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
