import * as React from 'react';
import { classNames } from '@nbfe/tools';
import { isEqual } from 'lodash';
import { FilterFilled } from '../../../Icons';
import { Button, Menu, Tree, Checkbox, Radio, Dropdown, Empty } from 'antd';
import FilterDropdownMenuWrapper from './FilterWrapper';
import FilterSearch from './FilterSearch';
import { flattenKeys } from '.';
import useSyncState from '../../_util/hooks/useSyncState';
import { ConfigContext } from '../../config-provider/context';

function hasSubMenu(filters) {
    return filters.some(({ children }) => children);
}

function searchValueMatched(searchValue, text) {
    if (typeof text === 'string' || typeof text === 'number') {
        return text?.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
    }
    return false;
}

function renderFilterItems({ filters, prefixCls, filteredKeys, filterMultiple, searchValue }) {
    return filters.map((filter, index) => {
        const key = String(filter.value);

        if (filter.children) {
            return (
                <Menu.SubMenu key={key || index} title={filter.text} popupClassName={`${prefixCls}-dropdown-submenu`}>
                    {renderFilterItems({
                        filters: filter.children,
                        prefixCls,
                        filteredKeys,
                        filterMultiple,
                        searchValue
                    })}
                </Menu.SubMenu>
            );
        }

        const Component = filterMultiple ? Checkbox : Radio;

        const item = (
            <Menu.Item key={filter.value !== undefined ? key : index}>
                <Component checked={filteredKeys.includes(key)} />
                <span>{filter.text}</span>
            </Menu.Item>
        );
        if (searchValue.trim()) {
            return searchValueMatched(searchValue, filter.text) ? item : undefined;
        }
        return item;
    });
}

function FilterDropdown(props) {
    const {
        tablePrefixCls,
        prefixCls,
        column,
        dropdownPrefixCls,
        columnKey,
        filterMultiple,
        filterMode = 'menu',
        filterSearch = false,
        filterState,
        triggerFilter,
        locale,
        children,
        getPopupContainer
    } = props;

    const { filterDropdownVisible, onFilterDropdownVisibleChange } = column;
    const [visible, setVisible] = React.useState(false);

    const filtered = !!(filterState && (filterState.filteredKeys?.length || filterState.forceFiltered));
    const triggerVisible = newVisible => {
        setVisible(newVisible);
        onFilterDropdownVisibleChange?.(newVisible);
    };

    const mergedVisible = typeof filterDropdownVisible === 'boolean' ? filterDropdownVisible : visible;

    // ===================== Select Keys =====================
    const propFilteredKeys = filterState?.filteredKeys;
    const [getFilteredKeysSync, setFilteredKeysSync] = useSyncState(propFilteredKeys || []);

    const onSelectKeys = ({ selectedKeys }) => {
        setFilteredKeysSync(selectedKeys);
    };

    const onCheck = (keys, { node, checked }) => {
        if (!filterMultiple) {
            onSelectKeys({ selectedKeys: checked && node.key ? [node.key] : [] });
        } else {
            onSelectKeys({ selectedKeys: keys });
        }
    };

    React.useEffect(() => {
        if (!visible) {
            return;
        }
        onSelectKeys({ selectedKeys: propFilteredKeys || [] });
    }, [propFilteredKeys]);

    // ====================== Open Keys ======================
    const [openKeys, setOpenKeys] = React.useState([]);
    const openRef = React.useRef();
    const onOpenChange = keys => {
        openRef.current = window.setTimeout(() => {
            setOpenKeys(keys);
        });
    };
    const onMenuClick = () => {
        window.clearTimeout(openRef.current);
    };
    React.useEffect(
        () => () => {
            window.clearTimeout(openRef.current);
        },
        []
    );

    // search in tree mode column filter
    const [searchValue, setSearchValue] = React.useState('');
    const onSearch = e => {
        const { value } = e.target;
        setSearchValue(value);
    };
    // clear search value after close filter dropdown
    React.useEffect(() => {
        if (!visible) {
            setSearchValue('');
        }
    }, [visible]);

    // ======================= Submit ========================
    const internalTriggerFilter = keys => {
        const mergedKeys = keys && keys.length ? keys : null;
        if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
            return;
        }

        if (isEqual(mergedKeys, filterState?.filteredKeys)) {
            return;
        }

        triggerFilter({
            column,
            key: columnKey,
            filteredKeys: mergedKeys
        });
    };

    const onConfirm = () => {
        triggerVisible(false);
        internalTriggerFilter(getFilteredKeysSync());
    };

    const onReset = () => {
        setSearchValue('');
        setFilteredKeysSync([]);
    };

    const doFilter = ({ closeDropdown } = { closeDropdown: true }) => {
        if (closeDropdown) {
            triggerVisible(false);
        }
        internalTriggerFilter(getFilteredKeysSync());
    };

    const onVisibleChange = newVisible => {
        if (newVisible && propFilteredKeys !== undefined) {
            // Sync filteredKeys on appear in controlled mode (propFilteredKeys !== undefiend)
            setFilteredKeysSync(propFilteredKeys || []);
        }

        triggerVisible(newVisible);

        // Default will filter when closed
        if (!newVisible && !column.filterDropdown) {
            onConfirm();
        }
    };

    // ======================== Style ========================
    const dropdownMenuClass = classNames({
        [`${dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(column.filters || [])
    });

    const onCheckAll = e => {
        if (e.target.checked) {
            const allFilterKeys = flattenKeys(column?.filters).map(key => String(key));
            setFilteredKeysSync(allFilterKeys);
        } else {
            setFilteredKeysSync([]);
        }
    };

    const getTreeData = ({ filters }) => {
        return (filters || []).map((filter, index) => {
            const key = String(filter.value);
            const item = {
                title: filter.text,
                key: filter.value !== undefined ? key : index
            };
            if (filter.children) {
                item.children = getTreeData({ filters: filter.children });
            }
            return item;
        });
    };

    let dropdownContent;
    if (typeof column.filterDropdown === 'function') {
        dropdownContent = column.filterDropdown({
            prefixCls: `${dropdownPrefixCls}-custom`,
            setSelectedKeys: selectedKeys => onSelectKeys({ selectedKeys }),
            selectedKeys: getFilteredKeysSync(),
            confirm: doFilter,
            clearFilters: onReset,
            filters: column.filters,
            visible: mergedVisible
        });
    } else if (column.filterDropdown) {
        dropdownContent = column.filterDropdown;
    } else {
        const selectedKeys = getFilteredKeysSync() || [];
        const getFilterComponent = () => {
            if ((column.filters || []).length === 0) {
                return (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={locale.filterEmptyText}
                        imageStyle={{
                            height: 24
                        }}
                        style={{
                            margin: 0,
                            padding: '16px 0'
                        }}
                    />
                );
            }
            if (filterMode === 'tree') {
                return (
                    <React.Fragment>
                        <FilterSearch
                            filterSearch={filterSearch}
                            value={searchValue}
                            onChange={onSearch}
                            tablePrefixCls={tablePrefixCls}
                            locale={locale}
                        />
                        <div className={`${tablePrefixCls}-filter-dropdown-tree`}>
                            {filterMultiple ? (
                                <Checkbox
                                    className={`${tablePrefixCls}-filter-dropdown-checkall`}
                                    onChange={onCheckAll}
                                >
                                    {locale.filterCheckall}
                                </Checkbox>
                            ) : null}
                            <Tree
                                checkable
                                selectable={false}
                                blockNode
                                multiple={filterMultiple}
                                checkStrictly={!filterMultiple}
                                className={`${dropdownPrefixCls}-menu`}
                                onCheck={onCheck}
                                checkedKeys={selectedKeys}
                                selectedKeys={selectedKeys}
                                showIcon={false}
                                treeData={getTreeData({ filters: column.filters })}
                                autoExpandParent
                                defaultExpandAll
                                filterTreeNode={
                                    searchValue.trim() ? node => searchValueMatched(searchValue, node.title) : undefined
                                }
                            />
                        </div>
                    </React.Fragment>
                );
            }
            return (
                <React.Fragment>
                    <FilterSearch
                        filterSearch={filterSearch}
                        value={searchValue}
                        onChange={onSearch}
                        tablePrefixCls={tablePrefixCls}
                        locale={locale}
                    />
                    <Menu
                        multiple={filterMultiple}
                        prefixCls={`${dropdownPrefixCls}-menu`}
                        className={dropdownMenuClass}
                        onClick={onMenuClick}
                        onSelect={onSelectKeys}
                        onDeselect={onSelectKeys}
                        selectedKeys={selectedKeys}
                        getPopupContainer={getPopupContainer}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                    >
                        {renderFilterItems({
                            filters: column.filters || [],
                            prefixCls,
                            filteredKeys: getFilteredKeysSync(),
                            filterMultiple,
                            searchValue
                        })}
                    </Menu>
                </React.Fragment>
            );
        };

        dropdownContent = (
            <React.Fragment>
                {getFilterComponent()}
                <div className={`${prefixCls}-dropdown-btns`}>
                    <Button type="link" size="small" disabled={selectedKeys.length === 0} onClick={onReset}>
                        {locale.filterReset}
                    </Button>
                    <Button type="primary" size="small" onClick={onConfirm}>
                        {locale.filterConfirm}
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    const menu = (
        <FilterDropdownMenuWrapper className={`${prefixCls}-dropdown`}>{dropdownContent}</FilterDropdownMenuWrapper>
    );

    let filterIcon;
    if (typeof column.filterIcon === 'function') {
        filterIcon = column.filterIcon(filtered);
    } else if (column.filterIcon) {
        filterIcon = column.filterIcon;
    } else {
        filterIcon = <FilterFilled />;
    }

    const { direction } = React.useContext(ConfigContext);

    return (
        <div className={`${prefixCls}-column`}>
            <span className={`${tablePrefixCls}-column-title`}>{children}</span>
            <Dropdown
                overlay={menu}
                trigger={['click']}
                visible={mergedVisible}
                onVisibleChange={onVisibleChange}
                getPopupContainer={getPopupContainer}
                placement={direction === 'rtl' ? 'bottomLeft' : 'bottomRight'}
            >
                <span
                    role="button"
                    tabIndex={-1}
                    className={classNames(`${prefixCls}-trigger`, {
                        active: filtered
                    })}
                    onClick={e => {
                        e.stopPropagation();
                    }}
                >
                    {filterIcon}
                </span>
            </Dropdown>
        </div>
    );
}

export default FilterDropdown;
