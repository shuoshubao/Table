import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { Card, Tooltip, Dropdown, Button } from 'antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HeaderSettingColumn from './HeaderSettingColumn.jsx';
import { exchange } from './util';
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
        const columns = cloneDeep(props.columns);
        this.state = {
            visible: true,
            columns: columns
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    componentDidMount() {
        return;
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
                const { columns } = this.state;
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
                                    const column = {
                                        ...v,
                                        id: title,
                                        index: i,
                                        onMove: (dragIndex, hoverIndex) => {
                                            this.setState({
                                                columns: exchange(columns, dragIndex, hoverIndex)
                                            });
                                        }
                                    };
                                    return <HeaderSettingColumn column={column} key={[i].join()} />;
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
