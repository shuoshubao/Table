import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, map, remove, sortBy, debounce } from 'lodash';
import { Card, Tooltip, Dropdown, Button } from './antd';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { ReactSortable } from 'react-sortablejs';
import { setAsyncState, isSomeFalsy } from '@nbfe/tools';
import { getComponentName, getClassNames } from './util.jsx';
import './index.scss';

class Index extends Component {
    static displayName = getComponentName('HeaderSetting');

    static defaultProps = {
        columns: []
    };

    static propTypes = {
        shape: PropTypes.oneOf(['button', 'icon']).isRequired,
        columns: PropTypes.array,
        onChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const columns = cloneDeep(props.columns);
        this.state = {
            visible: true,
            columns: columns,
            selectList: []
        };
        this.cardRef = React.createRef();
        this.triggerRef = React.createRef();
        this.customEvents = this.getCustomEvents();
        this.domEvents = this.getDomEvents();
        this.renderResult = this.getRenderResult();
    }

    componentDidMount() {
        const { columns } = this.state;
        this.setState({
            selectList: map(columns, 'title')
        });
        return;
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

    onSelect = async column => {
        const { title } = column;
        const { columns } = this.state;
        const selectList = [...this.state.selectList];
        if (selectList.includes(title)) {
            remove(selectList, v => {
                return v === title;
            });
        } else {
            selectList.push(title);
        }
        await setAsyncState(this, { selectList });
        this.update();
    };

    update = debounce(() => {
        const { columns, selectList } = this.state;
        const columnsTitleList = sortBy(selectList, v => {
            return map(columns, 'title').indexOf(v);
        });
        this.props.onChange(columnsTitleList);
    }, 10);

    getRenderResult() {
        return {
            overlay: () => {
                const { state, onSelect } = this;
                const { columns, selectList } = state;
                return (
                    <React.Fragment>
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
                                    setList={async columns => {
                                        await setAsyncState(this, { columns });
                                        this.update();
                                    }}
                                    handle={['.', getClassNames('header-setting-item-sort')].join('')}
                                    ghostClass={getClassNames('header-setting-item-sort-ghost')}
                                    filter={getClassNames('header-setting-item-sort-disabled')}
                                    animation={150}
                                >
                                    {columns.map((v, i) => {
                                        const { title, configurable } = v;
                                        return (
                                            <div
                                                className={getClassNames('header-setting-item')}
                                                key={[i].join()}
                                                onClick={() => {
                                                    onSelect(v);
                                                }}
                                            >
                                                <div
                                                    className={getClassNames('header-setting-item-sort', {
                                                        'header-setting-item-sort-disabled': !configurable
                                                    })}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <MenuOutlined />
                                                </div>
                                                <div className={getClassNames('header-setting-item-label')}>
                                                    {title}
                                                </div>
                                                <div className={getClassNames('header-setting-item-check')}>
                                                    {selectList.includes(title) && <CheckOutlined />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </ReactSortable>
                            </div>
                        </Card>
                    </React.Fragment>
                );
            }
        };
    }

    render() {
        const { props, state, domEvents, customEvents, renderResult } = this;
        const { shape } = props;
        const { visible } = state;
        const isIcon = shape === 'icon';
        return (
            <Dropdown visible={visible} trigger={['click']} overlay={renderResult.overlay()}>
                <Tooltip title={isIcon ? '表头设置' : null} placement="topRight" arrowPointAtCenter>
                    <Button
                        ref={this.triggerRef}
                        type={isIcon ? '' : 'primary'}
                        icon={isIcon ? <SettingOutlined /> : null}
                        onClick={() => {
                            this.setState({ visible: true });
                        }}
                    >
                        {isIcon ? null : '表头设置'}
                    </Button>
                </Tooltip>
            </Dropdown>
        );
    }
}

export default Index;
