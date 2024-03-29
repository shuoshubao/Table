import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, message } from 'antd'
import { red } from '@ant-design/colors'
import { cloneDeep, get, omit, isEqual, isFunction, debounce, map, find, isNull, noop } from 'lodash'
import { setAsyncState, classNames, isEmptyArray, isEveryFalsy } from '@nbfe/tools'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import getRender from './Render'
import { CloseCircleFilled } from './Icons'
import getTableComponents from './EditableCell'
import Toolbar from './Toolbar'
import Descriptions from './Descriptions'
import { componentName, getClassNames } from './config'
import {
  getStorageKey,
  defaultExtraConfig,
  mergeColumns,
  getRenderColumns,
  getRenderTotalNum,
  getRowKeyData,
  renderTotalNum,
  arrayMove,
  injectPropsReactElement,
  formatDataSource
} from './util'

class Index extends Component {
  static displayName = componentName

  static defaultProps = {
    size: 'default',
    pagination: {},
    extraConfig: defaultExtraConfig,
    draggable: false,
    onDragSortEnd: noop
  }

  static propTypes = {
    remoteConfig: PropTypes.object,
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array,
    size: PropTypes.string,
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), // 分页
    draggable: PropTypes.bool, // 拖拽排序
    onDragSortEnd: PropTypes.func, // 拖动排序完成回调
    extraConfig: PropTypes.object // 额外配置, 方便管理扩展
  }

  constructor(props) {
    super(props)
    const { defaultCurrent, defaultPageSize } = props.pagination || {}
    this.state = {
      fetchError: false, // 接口出错
      loading: false,
      columns: [],
      dataSource: [],
      columnsTitleList: [], // 显示|隐藏
      total: 0,
      current: defaultCurrent || 1,
      pageSize: defaultPageSize || 10,
      filterParams: {}, // 筛选的数据
      treeSelectOpens: {} // TreeSelect 的显示状态
    }
    this.tableRef = React.createRef()
    this.search = debounce(this.handleSearch, 100)
    // 缓存 filterParams
    this.prevFilterValue = {}
    // 缓存 searchParams
    this.cacheSearchParams = {}
  }

  componentDidMount() {
    const { storageKey } = { ...defaultExtraConfig, ...this.props.extraConfig }
    const columns = mergeColumns(this.props.columns, this)
    let columnsTitleList = map(columns, 'title')
    if (storageKey) {
      const storageCompleteKey = getStorageKey(storageKey)
      const titleList = JSON.parse(window.localStorage.getItem(storageCompleteKey))
      if (!isNull(titleList)) {
        columnsTitleList = titleList.filter(v => {
          return map(columns, 'title').includes(v)
        })
      }
    }
    this.setState({ columns, columnsTitleList })
    if (this.isLocalData()) {
      this.setState({ dataSource: cloneDeep(this.props.dataSource) })
    }
  }

  // 外部获取数据
  getDataSource = () => {
    return cloneDeep(this.state.dataSource)
  }

  // 本地数据源
  isLocalData = () => {
    const fetchFunc = get(this.props, 'remoteConfig.fetch')
    return !isFunction(fetchFunc)
  }

  // 参数: 排序
  getFilterParams = () => {
    return this.state.filterParams
  }

  // 筛选
  onFilterChange = (dataIndex, value) => {
    this.setState(prevState => {
      return {
        filterParams: {
          ...prevState.filterParams,
          [dataIndex]: value
        }
      }
    })
  }

  // 筛选 TreeSelect
  changeTreeSelect = (visible, dataIndex) => {
    this.setState(prevState => {
      const { treeSelectOpens } = prevState
      treeSelectOpens[dataIndex] = visible
      return {
        treeSelectOpens
      }
    })
  }

  // 筛选-确认
  onFilterConfirm = debounce(async () => {
    await setAsyncState(this, { current: 1 })
    this.handleSearch({}, false)
  }, 10)

  // 筛选-重置
  onFilterReset = async (dataIndex, filterMultiple) => {
    await setAsyncState(this, prevState => {
      return {
        filterParams: {
          ...prevState.filterParams,
          [dataIndex]: filterMultiple ? [] : ''
        }
      }
    })
    this.onFilterConfirm()
  }

  // 分页 - 切换
  onChange = async page => {
    await setAsyncState(this, { current: page })
    this.handleSearch({}, false)
  }

  // 分页 - 每页的设置
  onShowSizeChange = (current, size) => {
    setTimeout(async () => {
      await setAsyncState(this, { pageSize: size, current: 1 })
      this.handleSearch({}, false)
    }, 0)
  }

  // 触发数据请求
  handleSearch = async (searchParams = {}, isReset = true) => {
    // 本地
    if (this.isLocalData()) {
      return
    }
    // 重置
    // 回到第一页
    // 清空筛选项
    // 清空排序
    if (isReset) {
      await setAsyncState(this, { current: 1, filterParams: {} })
    }
    const { props, state } = this
    const { pagination } = props
    const {
      fetch: fetchFunc,
      process = v => v,
      dataSourceKey,
      path,
      totalKey = 'total',
      pageSizeKey = 'pageSize',
      currentPageKey = 'currentPage'
    } = props.remoteConfig
    const { current, pageSize } = state
    const paginationParams = {
      [pageSizeKey]: pageSize,
      [currentPageKey]: current
    }
    const filterParams = this.getFilterParams()
    const fetchParams = {
      ...paginationParams,
      ...filterParams,
      ...this.cacheSearchParams,
      ...searchParams
    }
    if (!pagination) {
      delete fetchParams[pageSizeKey]
      delete fetchParams[currentPageKey]
    }
    this.setState({ loading: true, fetchError: false })
    const resOrigin = await fetchFunc(fetchParams).catch(() => {
      this.setState({ fetchError: true })
    })
    this.setState({ loading: false })
    const res = process(cloneDeep(resOrigin)) || resOrigin
    const dataSource = get(res, dataSourceKey || path || 'list', [])
    const total = get(res, totalKey, 0)
    this.setState({ dataSource, total })
    if (isReset) {
      this.cacheSearchParams = { ...searchParams }
    }
  }

  // 编辑-单元格 保存
  // 请求接口, 接口完成后, 刷新数据(当前页)
  handleEditRow = async ({ index, dataIndex, value }) => {
    const { state, isLocalData } = this
    const { columns, dataSource, current, pageSize } = state
    const column = find(columns, { dataIndex })
    const pivot = isLocalData() ? (current - 1) * pageSize : 0
    const computedIndex = pivot + index
    const record = dataSource[computedIndex]
    const oldDataSource = cloneDeep(dataSource)
    const newDataSource = formatDataSource({ dataSource, index: computedIndex, dataIndex, value, column })

    // 未变化
    if (isEqual(value, get(record, dataIndex))) {
      return
    }

    const { onEditableCellSave } = this.props

    if (!onEditableCellSave) {
      this.setState({ dataSource: newDataSource })
      return
    }
    let hideLoading
    await setAsyncState(this, { loading: true, dataSource: newDataSource })
    try {
      await onEditableCellSave(
        {
          index: computedIndex,
          dataIndex,
          value
        },
        cloneDeep(this.state)
      )
      this.handleSearch({}, false)
      this.setState({ loading: false })
    } catch (e) {
      message.error(['数据保存失败', e].filter(Boolean).join(': '))
      this.setState({ loading: false, dataSource: oldDataSource })
    }
    if (hideLoading) {
      hideLoading()
    }
  }

  // 删除一条数据
  handleRemoveRow = key => {
    this.setState(prevState => {
      return {
        dataSource: prevState.dataSource.filter(v => {
          return getRowKeyData(this.props.rowKey, v) !== key
        })
      }
    })
  }

  // 换行
  handleMoveRow = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) {
      return
    }
    const { props, state, isLocalData } = this
    const { onDragSortEnd } = props
    const { current, pageSize, dataSource } = state
    const pivot = isLocalData() ? (current - 1) * pageSize : 0
    const newDataSource = arrayMove(dataSource, pivot + fromIndex, pivot + toIndex)
    this.setState({
      dataSource: newDataSource
    })
    onDragSortEnd({
      newDataSource,
      dataSource,
      fromIndex: pivot + fromIndex,
      toIndex: pivot + toIndex
    })
  }

  // 表头
  renderHeader = () => {
    const { props, state } = this
    const { size, prependHeader, appendHeader } = props
    const { dataSource, total, columns } = state
    const { showTotal, storageKey, fullScreen } = { ...defaultExtraConfig, ...props.extraConfig }
    const hideHeader = isEveryFalsy(showTotal, prependHeader, appendHeader, storageKey, fullScreen)
    const totalNum = total || dataSource.length
    if (hideHeader) {
      return null
    }
    return (
      <div className={getClassNames('header')}>
        <div className={getClassNames('header-left')}>
          {!!totalNum && showTotal && <div>{getRenderTotalNum(totalNum, showTotal)}</div>}
          {injectPropsReactElement(prependHeader, { size })}
        </div>
        <div className={getClassNames('header-right')}>
          {injectPropsReactElement(appendHeader, { size })}
          {!isEveryFalsy(storageKey, fullScreen) && (
            <Toolbar
              storageKey={storageKey}
              fullScreen={fullScreen}
              getPopupContainer={() => {
                return this.tableRef.current
              }}
              columns={columns}
              onColumnsChange={value => {
                this.setState({
                  columnsTitleList: [...value]
                })
              }}
              onFullscreenonChange={fullscreened => {
                if (fullscreened) {
                  this.tableRef.current.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
            />
          )}
        </div>
      </div>
    )
  }

  render() {
    const { props, state, onChange, onShowSizeChange, renderHeader } = this
    const { size, pagination, extraConfig } = props
    const { columns, columnsTitleList, dataSource, total, current, pageSize } = state
    const tableProps = omit(props, [
      'class',
      'className',
      'style',
      'columns',
      'dataSource',
      'remoteConfig',
      'pagination'
    ])

    if (isEmptyArray(columns)) {
      return null
    }

    const loadingConfig = {
      spinning: state.loading,
      size: 'large',
      tip: '数据加载中...'
    }

    if (state.fetchError) {
      loadingConfig.wrapperClassName = getClassNames('fetch-error')
      loadingConfig.spinning = true
      loadingConfig.tip = <span style={{ color: red.primary }}>数据加载出错!</span>
      loadingConfig.indicator = <CloseCircleFilled style={{ color: red.primary }} />
    }

    // 拖拽-单元格
    const cellDraggable = columns.some(v => {
      return v.template.tpl === 'sort'
    })

    // 拖拽-整行
    const rowDraggable = !cellDraggable && tableProps.draggable
    const { disabledSort } = { ...defaultExtraConfig, ...extraConfig }

    return (
      <div
        className={classNames('dynamic-table', props.class, props.className, getClassNames(size), {
          [getClassNames('bordered')]: !!props.bordered,
          [getClassNames('disable-pagination')]: !props.pagination
        })}
        ref={this.tableRef}
      >
        {renderHeader()}
        <DndProvider backend={HTML5Backend}>
          <Table
            loading={loadingConfig}
            {...tableProps}
            columns={getRenderColumns(columns, columnsTitleList, () => {
              return this.tableRef.current
            })}
            dataSource={dataSource}
            components={getTableComponents({
              size,
              columns,
              cellDraggable,
              rowDraggable,
              handleMoveRow: this.handleMoveRow
            })}
            onRow={(record, index) => {
              return {
                record,
                index,
                handleMoveRow: this.handleMoveRow,
                cellDraggable,
                rowDraggable,
                disabledSort
              }
            }}
            rowClassName={() => {
              return getClassNames('editable-row')
            }}
            pagination={
              pagination && {
                ...pagination,
                style: { padding: '16px 10px', margin: 0 },
                onChange,
                onShowSizeChange,
                showSizeChanger: true,
                total,
                current,
                pageSize,
                showTotal: renderTotalNum
              }
            }
          />
        </DndProvider>
      </div>
    )
  }
}

Index.Descriptions = Descriptions
Index.getRender = getRender

export default Index
