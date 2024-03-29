import React, { Component, Fragment } from 'react'
import { get, omit, cloneDeep, merge, isEqual } from 'lodash'
import { isEmptyObject, isEmptyValue, classNames } from '@nbfe/tools'
import { Descriptions, Spin, Tooltip } from 'antd'
import { QuestionCircleOutlined } from './Icons'
import { isAntdV3, getClassNames, getTooltipTitleNode, getComponentName } from './config'
import getRender from './Render'

const defaultColumn = {
  key: '',
  label: '',
  name: '',
  visible: true,
  tooltip: '',
  transform: null, // 数据转换器
  render: null, // 自定义渲染函数
  template: {
    tpl: 'text',
    emptyText: '--'
  }
}

const mergeColumns = (columns = []) => {
  return cloneDeep(columns).map(v => {
    return merge({}, defaultColumn, v)
  })
}

class Index extends Component {
  static displayName = getComponentName('Descriptions')

  static defaultProps = {}

  static propTypes = {}

  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.data, prevState.data)) {
      return {
        data: nextProps.data,
        loading: isEmptyObject(nextProps.data) || isEmptyValue(nextProps.data)
      }
    }
    return null
  }

  render() {
    const { props, state } = this

    const { columns, data } = props

    const { loading } = state

    const DescriptionsProps = omit(props, ['columns', 'data'])

    if (isAntdV3) {
      const { title, extra } = DescriptionsProps
      if (DescriptionsProps.extra) {
        DescriptionsProps.title = (
          <Fragment>
            <div className={getClassNames('descriptions-title')}>{title}</div>
            <div className={getClassNames('descriptions-extra')}>{extra}</div>
          </Fragment>
        )
      }
    }

    return (
      <Spin spinning={loading} tip="数据加载中...">
        <Descriptions
          {...DescriptionsProps}
          className={classNames(getClassNames('descriptions'), {
            [getClassNames('antd-v3')]: isAntdV3
          })}
        >
          {mergeColumns(columns)
            .filter(v => Boolean(v.visible))
            .map((v, i) => {
              const { name, label, tooltip, render, transform, template } = v
              const value = get(data, name)
              const key = [label, name, v.key, i].join('__')
              const DescriptionsItemProps = {
                ...omit(v, ['name']),
                key
              }
              if (tooltip) {
                getTooltipTitleNode
                DescriptionsItemProps.label = (
                  <Fragment>
                    {label}
                    <Tooltip title={getTooltipTitleNode(tooltip)} overlayClassName={getClassNames('descriptions')}>
                      <QuestionCircleOutlined className={getClassNames('descriptions-item-label-tooltip')} />
                    </Tooltip>
                  </Fragment>
                )
              }
              let content
              if (render) {
                content = render(value, data, i)
              } else {
                content = getRender({
                  dataIndex: name,
                  transform,
                  template
                })(value, data, i)
              }
              return <Descriptions.Item {...DescriptionsItemProps}>{content}</Descriptions.Item>
            })}
        </Descriptions>
      </Spin>
    )
  }
}

export default Index
