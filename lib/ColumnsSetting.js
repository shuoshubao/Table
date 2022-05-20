import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Tooltip, Popover, Checkbox, Button } from 'antd';
import { cloneDeep, map, isNull } from 'lodash';
import { setAsyncState, isSomeFalsy } from '@nbfe/tools';
import { SettingOutlined, MenuOutlined, CheckOutlined } from './Icons';
import { isAntdV3, getComponentName, getClassNames } from './config';
import { getStorageKey, getTitleNode } from './util';

class Index extends Component {
    static displayName = getComponentName('ColumnsSetting');

    static propTypes = {
        storageKey: PropTypes.string,
        columns: PropTypes.array,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            checkedList: [], // 选中的
            indeterminate: false, // 半角
            checkAll: true // 全选
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
    }

    componentDidMount() {
        const { storageKey, columns } = this.props;
        const value = JSON.parse(window.localStorage.getItem(storageKey));
        // 未设置
        if (isNull(value)) {
            this.setState({
                checkedList: map(columns, 'title'),
                indeterminate: false,
                checkAll: true
            });
            return;
        }
        this.setState({
            checkedList: value,
            indeterminate: !!value.length && value.length < columns.length,
            checkAll: value.length === columns.length
        });
    }

    onChange = value => {
        const { storageKey, columns } = this.props;
        const checkedList = value;
        this.setState({
            checkedList,
            indeterminate: !!value.length && value.length < columns.length,
            checkAll: value.length === columns.length
        });
        this.props.onChange(checkedList);
        window.localStorage.setItem(storageKey, JSON.stringify(checkedList));
    };

    onCheckAllChange = e => {
        const { storageKey, columns } = this.props;
        const { checked } = e.target;
        const checkedList = checked ? map(columns, 'title') : [];
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: checked
        });
        this.props.onChange(checkedList);
        window.localStorage.setItem(storageKey, JSON.stringify(checkedList));
    };

    getPopoverTitle = () => {
        const { state, onCheckAllChange } = this;
        const { indeterminate, checkAll } = state;
        return (
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                表头设置
            </Checkbox>
        );
    };

    getPopoverContent = () => {
        const { state, props, onChange } = this;
        const { columns } = props;
        const { checkedList } = state;
        return (
            <Checkbox.Group
                value={checkedList}
                options={columns.map(v => {
                    const { title, tooltip } = v;
                    return {
                        label: getTitleNode(title, tooltip),
                        value: title
                    };
                })}
                onChange={onChange}
            />
        );
    };

    render() {
        const { props, state, getPopoverTitle, getPopoverContent } = this;
        return (
            <Popover
                title={getPopoverTitle()}
                trigger="click"
                content={getPopoverContent()}
                placement="bottomRight"
                arrowPointAtCenter
                overlayClassName={getClassNames('columns-setting-popover')}
            >
                <Tooltip title="表头设置">
                    <SettingOutlined className={getClassNames('columns-setting-icon-setting')} ref={this.triggerRef} />
                </Tooltip>
            </Popover>
        );
    }
}

export default Index;
