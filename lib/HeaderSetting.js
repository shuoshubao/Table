import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, map, remove, sortBy, debounce } from 'lodash';
import { Card, Tooltip, Dropdown, Button } from 'antd';
import { ReactSortable } from 'react-sortablejs';
import { setAsyncState, isSomeFalsy } from '@nbfe/tools';
import { SettingOutlined, MenuOutlined, CheckOutlined } from './Icons';
import { isAntdV3, getComponentName, getStorageKey, getClassNames } from './util';
import './index.scss';

class Index extends Component {
    static displayName = getComponentName('HeaderSetting');

    static defaultProps = {
        columns: []
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

    onSelect = async column => {
        const { title } = column;
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
        const storageKey = getStorageKey(this.props.storageKey);
        const columnsDataList = columnsTitleList
            .map(v => {
                const item = columns.find(v2 => {
                    return v2.title === v;
                });
                if (!item) {
                    return null;
                }
                return v;
            })
            .filter(Boolean);
        window.localStorage.setItem(storageKey, JSON.stringify(columnsDataList));
        this.props.onChange(columnsTitleList);
    }, 10);

    renderOverlay = () => {
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
                            setList={async columns2 => {
                                await setAsyncState(this, { columns: columns2 });
                                this.update();
                            }}
                            handle={['.', getClassNames('header-setting-item-sort')].join('')}
                            ghostClass={getClassNames('header-setting-item-sort-ghost')}
                            filter={['.', getClassNames('header-setting-item-sort-disabled')].join('')}
                            animation={150}
                        >
                            {columns.map((v, i) => {
                                const { title, canSort, canHide } = v;
                                return (
                                    <div
                                        className={getClassNames('header-setting-item', {
                                            'header-setting-item-not-allowed': !canHide
                                        })}
                                        key={[i].join()}
                                        onClick={() => {
                                            if (canHide) {
                                                onSelect(v);
                                            }
                                        }}
                                    >
                                        <div
                                            className={getClassNames('header-setting-item-sort', {
                                                'header-setting-item-sort-disabled': !canSort
                                            })}
                                            onClick={e => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <MenuOutlined />
                                        </div>
                                        <div className={getClassNames('header-setting-item-label')}>{title}</div>
                                        <div
                                            className={getClassNames('header-setting-item-check', {
                                                'header-setting-item-check-disabled': !canHide
                                            })}
                                        >
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
    };

    render() {
        const { props, state, renderOverlay } = this;
        const { shape } = props;
        const { visible } = state;
        const isIcon = shape === 'icon';
        const buttonNode = (
            <Button
                type={isIcon ? '' : 'primary'}
                icon={isIcon ? isAntdV3 ? 'setting' : <SettingOutlined /> : null}
                onClick={() => {
                    this.setState({ visible: true });
                }}
            >
                {isIcon ? null : '表头设置'}
            </Button>
        );
        return (
            <Dropdown visible={visible} trigger={['click']} overlay={renderOverlay()}>
                <Tooltip title={isIcon ? '表头设置' : null} placement="topRight" arrowPointAtCenter>
                    <span ref={this.triggerRef}>{buttonNode}</span>
                </Tooltip>
            </Dropdown>
        );
    }
}

export default Index;
