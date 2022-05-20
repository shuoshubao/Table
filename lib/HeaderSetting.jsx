import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Tooltip, Dropdown, Button } from 'antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.scss';

class Index extends Component {
    static displayName = 'DynaTableHeaderSetting';

    static defaultProps = {
        columns: []
    };

    static propTypes = {
        type: PropTypes.oneOf(['button', 'icon']).isRequired,
        columns: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    componentDidMount() {
        document.addEventListener('click', e => {
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
                const { columns } = this.props;
                return (
                    <div ref={this.cardRef}>
                        <Card
                            className="dyna-table-header-setting"
                            title="表头设置"
                            style={{ width: 250 }}
                            headStyle={{ textAlign: 'center' }}
                            size="small"
                            bordered={false}
                        >
                            <DndProvider backend={HTML5Backend}>
                                {columns.map((v, i) => {
                                    const { title } = v;
                                    return (
                                        <div className="dyna-table-header-setting-item" key={[i].join()}>
                                            <div className="dyna-table-header-setting-item-sort">
                                                <MenuOutlined />
                                            </div>
                                            <div className="dyna-table-header-setting-item-label">{title}</div>
                                            <div className="dyna-table-header-setting-item-check">
                                                <CheckOutlined />
                                            </div>
                                        </div>
                                    );
                                })}
                            </DndProvider>
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
