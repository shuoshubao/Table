import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Card, Tooltip, Dropdown, Button } from 'antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { ReactSortable } from 'react-sortablejs';
import { isSomeFalsy } from '@nbfe/tools';
import { getComponentName, getClassNames } from './util.jsx';
import './index.scss';

class Index extends Component {
    static displayName = getComponentName('HeaderSetting');

    static defaultProps = {
        columns: []
    };

    static propTypes = {
        type: PropTypes.oneOf(['button', 'icon']).isRequired,
        columns: PropTypes.array
    };

    constructor(props) {
        super(props);
        const columns = cloneDeep(props.columns);
        this.state = {
            visible: false,
            columns: columns
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    componentDidMount() {
        document.addEventListener('click', e => {
            if (isSomeFalsy(this.cardRef.current, this.triggerRef.current)) {
                return;
            }
            const isCard = this.cardRef.current.contains(e.target);
            const isTriggerEle = this.triggerRef.current.contains(e.target);
            if (isTriggerEle) {
                return;
            }
            if (!isCard) {
                this.setState({ visible: false });
            }
        });
    }

    getCustomEvents() {
        return {};
    }

    getDomEvents() {
        return {};
    }

    getRenderResult() {
        return {
            overlay: () => {
                const { columns } = this.state;
                return (
                    <div>
                        <Card
                            className={getClassNames('header-setting')}
                            title="表头设置"
                            style={{ width: 250 }}
                            headStyle={{ textAlign: 'center' }}
                            size="small"
                            bordered={false}
                        >
                            <div className={getClassNames('header-setting-items')} ref={this.cardRef}>
                                <ReactSortable
                                    list={columns}
                                    setList={columns => this.setState({ columns: columns })}
                                    handle={['.', getClassNames('header-setting-item-sort')].join('')}
                                    ghostClass={getClassNames('header-setting-item-sort-ghost')}
                                    filter={getClassNames('header-setting-item-sort-disabled')}
                                    animation={150}
                                >
                                    {columns.map((v, i) => {
                                        const { title } = v;
                                        return (
                                            <div className={getClassNames('header-setting-item')} key={[i].join()}>
                                                <div className={getClassNames('header-setting-item-sort')}>
                                                    <MenuOutlined />
                                                </div>
                                                <div className={getClassNames('header-setting-item-label')}>
                                                    {title}
                                                </div>
                                                <div className={getClassNames('header-setting-item-check')}>
                                                    <CheckOutlined />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ReactSortable>
                            </div>
                        </Card>
                    </div>
                );
            }
        };
    }

    render() {
        const { props, state, domEvents, customEvents, renderResult } = this;
        const { type } = props;
        const { visible } = state;
        return (
            <Dropdown visible={visible} trigger={['click']} overlay={renderResult.overlay()}>
                {type === 'button' ? (
                    <Button
                        ref={this.triggerRef}
                        type="primary"
                        onClick={() => {
                            this.setState({ visible: true });
                        }}
                    >
                        表头设置
                    </Button>
                ) : (
                    <Tooltip title="表头设置" placement="topRight" arrowPointAtCenter>
                        <SettingOutlined ref={this.triggerRef} />
                    </Tooltip>
                )}
            </Dropdown>
        );
    }
}

export default Index;
