import * as React from 'react';
import classNames from 'classnames';
import omit from 'rc-util/lib/omit';
import RcTable, { Summary } from 'rc-table';
import { TableProps as RcTableProps, INTERNAL_HOOKS } from 'rc-table/lib/Table';
import { convertChildrenToColumns } from 'rc-table/lib/hooks/useColumns';
import { Spin, Pagination } from 'antd';
import { ConfigContext } from './config-provider/context';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useLazyKVMap from './hooks/useLazyKVMap';
import { Breakpoint } from './_util/responsiveObserve';
import useSelection, {
  SELECTION_ALL,
  SELECTION_INVERT,
  SELECTION_NONE,
} from './hooks/useSelection';
import useSorter, { getSortData, SortState } from './hooks/useSorter';
import useFilter, { getFilterData, FilterState } from './hooks/useFilter';
import useTitleColumns from './hooks/useTitleColumns';
import renderExpandIcon from './ExpandIcon';
import scrollTo from './_util/scrollTo';
import { getAntdLocaleZhCN } from '@nbfe/tools';
import SizeContext, { SizeType } from './config-provider/SizeContext';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import devWarning from './_util/devWarning';
import useBreakpoint from './_util/hooks/useBreakpoint';

const defaultLocale = getAntdLocaleZhCN();

const EMPTY_LIST = [];

function InternalTable(
  props,
  ref,
) {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    size: customizeSize,
    bordered,
    dropdownPrefixCls: customizeDropdownPrefixCls,
    dataSource,
    pagination,
    rowSelection,
    rowKey,
    rowClassName,
    columns,
    children,
    childrenColumnName: legacyChildrenColumnName,
    onChange,
    getPopupContainer,
    loading,
    expandIcon,
    expandable,
    expandedRowRender,
    expandIconColumnIndex,
    indentSize,
    scroll,
    sortDirections,
    locale,
    showSorterTooltip = true,
  } = props;

  devWarning(
    !(typeof rowKey === 'function' && rowKey.length > 1),
    'Table',
    '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.',
  );

  const screens = useBreakpoint();
  const mergedColumns = React.useMemo(() => {
    const matched = new Set(Object.keys(screens).filter((m) => screens[m]));

    return (columns || convertChildrenToColumns(children)).filter(
      (c) =>
        !c.responsive || c.responsive.some((r) => matched.has(r)),
    );
  }, [children, columns, screens]);

  const tableProps = omit(props, ['className', 'style', 'columns']);

  const size = React.useContext(SizeContext);
  const {
    locale: contextLocale = defaultLocale,
    renderEmpty,
    direction,
  } = React.useContext(ConfigContext);
  const mergedSize = customizeSize || size;
  const tableLocale = { ...contextLocale.Table, ...locale };
  const rawData = dataSource || EMPTY_LIST;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('table', customizePrefixCls);
  const dropdownPrefixCls = getPrefixCls('dropdown', customizeDropdownPrefixCls);

  const mergedExpandable = {
    childrenColumnName: legacyChildrenColumnName,
    expandIconColumnIndex,
    ...expandable,
  };
  const { childrenColumnName = 'children' } = mergedExpandable;

  const expandType = React.useMemo(() => {
    if (rawData.some(item => (item)?.[childrenColumnName])) {
      return 'nest';
    }

    if (expandedRowRender || (expandable && expandable.expandedRowRender)) {
      return 'row';
    }

    return null;
  }, [rawData]);

  const internalRefs = {
    body: React.useRef(),
  };

  // ============================ RowKey ============================
  const getRowKey = React.useMemo(() => {
    if (typeof rowKey === 'function') {
      return rowKey;
    }

    return (record) => (record)?.[rowKey];
  }, [rowKey]);

  const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);

  // ============================ Events =============================
  const changeEventInfo = {};

  const triggerOnChange = (
    info,
    action,
    reset,
  ) => {
    const changeInfo = {
      ...changeEventInfo,
      ...info,
    };

    if (reset) {
      changeEventInfo.resetPagination();

      // Reset event param
      if (changeInfo.pagination.current) {
        changeInfo.pagination.current = 1;
      }

      // Trigger pagination events
      if (pagination && pagination.onChange) {
        pagination.onChange(1, changeInfo.pagination.pageSize);
      }
    }

    if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body.current) {
      scrollTo(0, {
        getContainer: () => internalRefs.body.current,
      });
    }

    onChange?.(changeInfo.pagination, changeInfo.filters, changeInfo.sorter, {
      currentDataSource: getFilterData(
        getSortData(rawData, changeInfo.sorterStates, childrenColumnName),
        changeInfo.filterStates,
      ),
      action,
    });
  };

  /**
   * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
   * state out and then put it back to title render. Move these code into `hooks` but still too
   * complex. We should provides Table props like `sorter` & `filter` to handle control in next big version.
   */

  // ============================ Sorter =============================
  const onSorterChange = (
    sorter,
    sorterStates
  ) => {
    triggerOnChange(
      {
        sorter,
        sorterStates,
      },
      'sort',
      false,
    );
  };
  const [transformSorterColumns, sortStates, sorterTitleProps, getSorters] = useSorter({
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections: sortDirections || ['ascend', 'descend'],
    tableLocale,
    showSorterTooltip,
  });
  const sortedData = React.useMemo(
    () => getSortData(rawData, sortStates, childrenColumnName),
    [rawData, sortStates],
  );

  changeEventInfo.sorter = getSorters();
  changeEventInfo.sorterStates = sortStates;

  // ============================ Filter ============================
  const onFilterChange = (
    filters,
    filterStates,
  ) => {
    triggerOnChange(
      {
        filters,
        filterStates,
      },
      'filter',
      true,
    );
  };

  const [transformFilterColumns, filterStates, getFilters] = useFilter({
    prefixCls,
    locale: tableLocale,
    dropdownPrefixCls,
    mergedColumns,
    onFilterChange,
    getPopupContainer,
  });
  const mergedData = getFilterData(sortedData, filterStates);

  changeEventInfo.filters = getFilters();
  changeEventInfo.filterStates = filterStates;

  // ============================ Column ============================
  const columnTitleProps = React.useMemo(
    () => ({
      ...sorterTitleProps,
    }),
    [sorterTitleProps],
  );
  const [transformTitleColumns] = useTitleColumns(columnTitleProps);

  // ========================== Pagination ==========================
  const onPaginationChange = (current, pageSize) => {
    triggerOnChange(
      {
        pagination: { ...changeEventInfo.pagination, current, pageSize },
      },
      'paginate',
    );
  };

  const [mergedPagination, resetPagination] = usePagination(
    mergedData.length,
    pagination,
    onPaginationChange,
  );

  changeEventInfo.pagination =
    pagination === false ? {} : getPaginationParam(pagination, mergedPagination);

  changeEventInfo.resetPagination = resetPagination;

  // ============================= Data =============================
  const pageData = React.useMemo(() => {
    if (pagination === false || !mergedPagination.pageSize) {
      return mergedData;
    }

    const { current = 1, total, pageSize = DEFAULT_PAGE_SIZE } = mergedPagination;
    devWarning(current > 0, 'Table', '`current` should be positive number.');

    // Dynamic table data
    if (mergedData.length < total) {
      if (mergedData.length > pageSize) {
        devWarning(
          false,
          'Table',
          '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.',
        );
        return mergedData.slice((current - 1) * pageSize, current * pageSize);
      }
      return mergedData;
    }

    return mergedData.slice((current - 1) * pageSize, current * pageSize);
  }, [
    !!pagination,
    mergedData,
    mergedPagination && mergedPagination.current,
    mergedPagination && mergedPagination.pageSize,
    mergedPagination && mergedPagination.total,
  ]);

  // ========================== Selections ==========================
  const [transformSelectionColumns, selectedKeySet] = useSelection(rowSelection, {
    prefixCls,
    data: mergedData,
    pageData,
    getRowKey,
    getRecordByKey,
    expandType,
    childrenColumnName,
    locale: tableLocale,
    expandIconColumnIndex: mergedExpandable.expandIconColumnIndex,
    getPopupContainer,
  });

  const internalRowClassName = (record, index, indent) => {
    let mergedRowClassName;
    if (typeof rowClassName === 'function') {
      mergedRowClassName = classNames(rowClassName(record, index, indent));
    } else {
      mergedRowClassName = classNames(rowClassName);
    }

    return classNames(
      {
        [`${prefixCls}-row-selected`]: selectedKeySet.has(getRowKey(record, index)),
      },
      mergedRowClassName,
    );
  };

  // ========================== Expandable ==========================

  // Pass origin render status into `rc-table`, this can be removed when refactor with `rc-table`
  (mergedExpandable).__PARENT_RENDER_ICON__ = mergedExpandable.expandIcon;

  // Customize expandable icon
  mergedExpandable.expandIcon =
    mergedExpandable.expandIcon || expandIcon || renderExpandIcon(tableLocale);

  // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
  if (expandType === 'nest' && mergedExpandable.expandIconColumnIndex === undefined) {
    mergedExpandable.expandIconColumnIndex = rowSelection ? 1 : 0;
  } else if (mergedExpandable.expandIconColumnIndex > 0 && rowSelection) {
    mergedExpandable.expandIconColumnIndex -= 1;
  }

  // Indent size
  if (typeof mergedExpandable.indentSize !== 'number') {
    mergedExpandable.indentSize = typeof indentSize === 'number' ? indentSize : 15;
  }

  // ============================ Render ============================
  const transformColumns = React.useCallback(
    (innerColumns) =>
      transformTitleColumns(
        transformSelectionColumns(transformFilterColumns(transformSorterColumns(innerColumns))),
      ),
    [transformSorterColumns, transformFilterColumns, transformSelectionColumns],
  );

  let topPaginationNode;
  let bottomPaginationNode;
  if (pagination !== false && mergedPagination?.total) {
    let paginationSize;
    if (mergedPagination.size) {
      paginationSize = mergedPagination.size;
    } else {
      paginationSize = mergedSize === 'small' || mergedSize === 'middle' ? 'small' : undefined;
    }

    const renderPagination = (position) => (
      <Pagination
        {...mergedPagination}
        className={classNames(
          `${prefixCls}-pagination ${prefixCls}-pagination-${position}`,
          mergedPagination.className,
        )}
        size={paginationSize}
      />
    );
    const defaultPosition = direction === 'rtl' ? 'left' : 'right';
    const { position } = mergedPagination;
    if (position !== null && Array.isArray(position)) {
      const topPos = position.find(p => p.indexOf('top') !== -1);
      const bottomPos = position.find(p => p.indexOf('bottom') !== -1);
      const isDisable = position.every(p => `${p}` === 'none');
      if (!topPos && !bottomPos && !isDisable) {
        bottomPaginationNode = renderPagination(defaultPosition);
      }
      if (topPos) {
        topPaginationNode = renderPagination(topPos.toLowerCase().replace('top', ''));
      }
      if (bottomPos) {
        bottomPaginationNode = renderPagination(bottomPos.toLowerCase().replace('bottom', ''));
      }
    } else {
      bottomPaginationNode = renderPagination(defaultPosition);
    }
  }

  // >>>>>>>>> Spinning
  let spinProps;
  if (typeof loading === 'boolean') {
    spinProps = {
      spinning: loading,
    };
  } else if (typeof loading === 'object') {
    spinProps = {
      spinning: true,
      ...loading,
    };
  }

  const wrapperClassNames = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-wrapper-rtl`]: direction === 'rtl',
    },
    className,
  );
  return (
    <div ref={ref} className={wrapperClassNames} style={style}>
      <Spin spinning={false} {...spinProps}>
        {topPaginationNode}
        <RcTable
          {...tableProps}
          columns={mergedColumns}
          direction={direction}
          expandable={mergedExpandable}
          prefixCls={prefixCls}
          className={classNames({
            [`${prefixCls}-middle`]: mergedSize === 'middle',
            [`${prefixCls}-small`]: mergedSize === 'small',
            [`${prefixCls}-bordered`]: bordered,
            [`${prefixCls}-empty`]: rawData.length === 0,
          })}
          data={pageData}
          rowKey={getRowKey}
          rowClassName={internalRowClassName}
          emptyText={(locale && locale.emptyText) || renderEmpty('Table')}
          // Internal
          internalHooks={INTERNAL_HOOKS}
          internalRefs={internalRefs}
          transformColumns={transformColumns}
        />
        {bottomPaginationNode}
      </Spin>
    </div>
  );
}

const ForwardTable = React.forwardRef(InternalTable);

const Table = ForwardTable;

Table.defaultProps = {
  rowKey: 'key',
};

Table.SELECTION_ALL = SELECTION_ALL;
Table.SELECTION_INVERT = SELECTION_INVERT;
Table.SELECTION_NONE = SELECTION_NONE;
Table.Column = Column;
Table.ColumnGroup = ColumnGroup;
Table.Summary = Summary;

export default Table;
