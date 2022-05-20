import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, map, remove, sortBy, debounce } from 'lodash';
import { Card, Tooltip, Popover, Button } from 'antd';
import { setAsyncState, isSomeFalsy } from '@nbfe/tools';
import { SettingOutlined, MenuOutlined, CheckOutlined } from './Icons';
import { isAntdV3, getComponentName, getClassNames } from './config';
import { getStorageKey } from './util';

class Index extends Component {
    static displayName = getComponentName('ColumnsSetting');

    static defaultProps = {
        columns: [],
        shape: 'icon'
    };

    static propTypes = {
        storageKey: PropTypes.string,
        shape: PropTypes.oneOf(['button', 'icon']).isRequired,
        columns: PropTypes.array,
        value: PropTypes.array,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const columns = cloneDeep(props.columns);
        this.state = {
            visible: false,
            columns,
            selectList: []
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
    }

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            selectList: cloneDeep(value)
        });
    }

    render() {
        const { props, state } = this;
        const { shape = 'icon' } = props;
        const { visible } = state;
        const isIcon = shape === 'icon';
        return (
            <Popover title="列设置" trigger="click" content={'123'} placement="bottomRight">
                <SettingOutlined className={getClassNames('columns-setting-icon-setting')} ref={this.triggerRef} />
            </Popover>
        );
    }
}

export default Index;
