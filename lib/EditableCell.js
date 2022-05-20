import React, { useContext, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { get, find, omit, flatten, isString } from 'lodash';
import moment from 'moment';
import { isEveryTruthy } from '@nbfe/tools';
import Form from './Form';
import BuiltInComponents from './components';
import { getComponentName, getClassNames } from './config';

const EditableContext = React.createContext(null);

const DragType = getComponentName('DraggableBodyRow');

const EditableDraggableRow = ({ index, moveRow, className, style, draggable, ...props }) => {
    const [form] = Form.useForm();
    const dragRef = useRef();
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: DragType,
        collect: monitor => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: getClassNames(dragIndex < index ? 'drop-over-downward' : 'drop-over-upward')
            };
        },
        drop: item => {
            moveRow(item.index, index);
        }
    });
    const [, drag] = useDrag({
        type: DragType,
        item: {
            index
        },
        collect: monitor => {
            return {
                isDragging: monitor.isDragging()
            };
        }
    });
    if (draggable) {
        drop(drag(dragRef));
        style.cursor = 'move';
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr
                        ref={dragRef}
                        className={`${className} ${isOver ? dropClassName : ''}`}
                        style={{ ...style }}
                        {...props}
                    />
                </EditableContext.Provider>
            </Form>
        );
    }
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
            const { template } = column;
            const { tpl } = template;
            let FormItemNode;
            const FormItemNodeProps = {
                onChange: save,
                size,
                style: { width: '100%' }
            };

            Object.assign(FormItemNodeProps, omit(template, ['emptyText']));

            // 内置组件
            if (Object.keys(BuiltInComponents).includes(tpl)) {
                const BuiltInComponent = BuiltInComponents[tpl];
                if (tpl === 'input') {
                    delete FormItemNodeProps.onChange;
                    FormItemNodeProps.onPressEnter = save;
                    FormItemNodeProps.onBlur = save;
                    FormItemNodeProps.inputWidth = '100%';
                }
                if (tpl === 'range-number') {
                    const [key1, key2] = dataIndex.split(',');
                    if (isEveryTruthy(get(record, key1), get(record, key2))) {
                        value = [get(record, key1), get(record, key2)];
                    } else {
                        value = [];
                    }
                }
                if (tpl === 'date-picker' && value) {
                    value = moment(value);
                }
                if (tpl === 'date-range-picker') {
                    const [key1, key2] = dataIndex.split(',');
                    if (isEveryTruthy(get(record, key1), get(record, key2))) {
                        value = [moment(get(record, key1)), moment(get(record, key2))];
                    }
                }
                if (tpl === 'time-picker') {
                    const { format = 'HH:mm:ss' } = template;
                    if (value) {
                        value = moment(value, format);
                    }
                }
                if (tpl === 'time-range-picker') {
                    const { format = 'HH:mm:ss' } = template;
                    const [key1, key2] = dataIndex.split(',');
                    if (isEveryTruthy(get(record, key1), get(record, key2))) {
                        value = [moment(get(record, key1), format), moment(get(record, key2), format)];
                    }
                }

                FormItemNode = <BuiltInComponent {...FormItemNodeProps} />;
            }

            childNode = (
                <Form.Item noStyle name={dataIndex} initialValue={value} rules={computedRules}>
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
            row: EditableDraggableRow,
            cell: getEditableCell(tableProps)
        }
    };
};
