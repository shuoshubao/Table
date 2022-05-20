import React, { useContext, useEffect } from 'react';
import { InputNumber, DatePicker } from 'antd';
import { get, find, omit, flatten, isString } from 'lodash';
import moment from 'moment';
import { isEveryTruthy } from '@nbfe/tools';
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
                size,
                style: { width: width ? width - 20 : 100 }
            };
            Object.assign(FormItemNodeProps, omit(template, ['emptyText']));
            if (tpl === 'input') {
                FormItemNodeProps.inputWidth = '100%';
                FormItemNodeProps.onPressEnter = save;
                FormItemNodeProps.onBlur = save;
                FormItemNode = <Input {...FormItemNodeProps} />;
            }
            if (tpl === 'input-number') {
                FormItemNodeProps.onChange = save;
                FormItemNode = <InputNumber {...FormItemNodeProps} />;
            }
            if (tpl === 'select') {
                FormItemNodeProps.onChange = save;
                FormItemNode = <Select {...FormItemNodeProps} />;
            }
            if (tpl === 'range-number') {
                FormItemNodeProps.onChange = save;
                FormItemNode = <RangeNumber {...FormItemNodeProps} />;
            }
            if (tpl === 'date-picker') {
                if (value) {
                    value = moment(new Date(value));
                }
                FormItemNode = <DatePicker {...FormItemNodeProps} onChange={save} />;
            }
            if (tpl === 'date-range-picker') {
                const [key1, key2] = dataIndex.split(',');
                if (isEveryTruthy(get(record, key1), get(record, key2))) {
                    value = [moment(new Date(get(record, key1))), moment(new Date(get(record, key2)))];
                }
                FormItemNode = <DatePicker.RangePicker {...FormItemNodeProps} onChange={save} />;
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
