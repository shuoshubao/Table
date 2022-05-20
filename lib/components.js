import {
  version,
  Input,
  Select,
  InputNumber,
  Divider,
  Checkbox,
  Tabs,
  Cascader,
  TreeSelect,
  AutoComplete,
  Switch,
  Slider,
  Button,
  message,
  Upload,
  Image,
  Radio,
  DatePicker,
  TimePicker,
  Rate
} from 'antd'
import React, { Component, Fragment, PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  omit,
  inRange,
  kebabCase,
  isFunction,
  isEqual,
  map,
  cloneDeep,
  debounce,
  pick,
  noop,
  isObject,
  find,
  isNumber,
  last,
  flatten,
  isString
} from 'lodash'
import { classNames, setAsyncState, isEveryTruthy, isEmptyValue, isEmptyArray, convertDataToEnum } from '@nbfe/tools'
import 'moment'
import 'filesize'

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    enumerableOnly &&
      (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })),
      keys.push.apply(keys, symbols)
  }

  return keys
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {}
    i % 2
      ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key])
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
      : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
        })
  }

  return target
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg)
    var value = info.value
  } catch (error) {
    reject(error)
    return
  }

  if (info.done) {
    resolve(value)
  } else {
    Promise.resolve(value).then(_next, _throw)
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args)

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value)
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err)
      }

      _next(undefined)
    })
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  Object.defineProperty(Constructor, 'prototype', {
    writable: false
  })
  return Constructor
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }

  return obj
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError('Super expression must either be null or a function')
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  })
  Object.defineProperty(subClass, 'prototype', {
    writable: false
  })
  if (superClass) _setPrototypeOf(subClass, superClass)
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o)
      }
  return _getPrototypeOf(o)
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p
      return o
    }

  return _setPrototypeOf(o, p)
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === 'undefined' || !Reflect.construct) return false
  if (Reflect.construct.sham) return false
  if (typeof Proxy === 'function') return true

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}))
    return true
  } catch (e) {
    return false
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  }

  return self
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === 'object' || typeof call === 'function')) {
    return call
  } else if (call !== void 0) {
    throw new TypeError('Derived constructors may only return object or undefined')
  }

  return _assertThisInitialized(self)
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct()

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor

      result = Reflect.construct(Super, arguments, NewTarget)
    } else {
      result = Super.apply(this, arguments)
    }

    return _possibleConstructorReturn(this, result)
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr)
}

function _iterableToArray(iter) {
  if ((typeof Symbol !== 'undefined' && iter[Symbol.iterator] != null) || iter['@@iterator'] != null)
    return Array.from(iter)
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if (n === 'Object' && o.constructor) n = o.constructor.name
  if (n === 'Map' || n === 'Set') return Array.from(o)
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen)
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]

  return arr2
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  )
}

var defaultSvgProps = {
  viewBox: '64 64 896 896',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  width: '1em',
  height: '1em'
}

var getSvgProps = function getSvgProps(props) {
  return _objectSpread2(_objectSpread2({}, defaultSvgProps), omit(props, 'className'))
}
var PlusOutlined = function PlusOutlined(props) {
  var svgProps = getSvgProps(props)
  return /*#__PURE__*/ React.createElement(
    'span',
    {
      className: classNames('anticon', props.className)
    },
    /*#__PURE__*/ React.createElement(
      'svg',
      svgProps,
      /*#__PURE__*/ React.createElement('path', {
        d: 'M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z'
      }),
      /*#__PURE__*/ React.createElement('path', {
        d: 'M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z'
      })
    )
  )
}
var UploadOutlined = function UploadOutlined(props) {
  var svgProps = getSvgProps(props)
  return /*#__PURE__*/ React.createElement(
    'span',
    {
      className: classNames('anticon', props.className)
    },
    /*#__PURE__*/ React.createElement(
      'svg',
      svgProps,
      /*#__PURE__*/ React.createElement('path', {
        d: 'M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z'
      })
    )
  )
}

var isAntdV3 = inRange(parseInt(version, 10), 3, 4)
inRange(parseInt(version, 10), 4, 5)
var componentName = 'DynamicForm'
var prefixClassName = kebabCase(componentName)

var getDisplayName = function getDisplayName() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''
  return [componentName, name].join('')
}
var getClassNames = function getClassNames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key]
  }

  return classNames(args)
    .split(' ')
    .map(function (v) {
      return [prefixClassName, v].filter(Boolean).join('-')
    })
    .join(' ')
} // 处理 props.columns
var IconMap = {
  upload: UploadOutlined
}
var getIconButtonProps = function getIconButtonProps() {
  var iconName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ''

  if (isAntdV3) {
    return {
      type: iconName
    }
  }

  var IconComponent = IconMap[iconName]
  return {
    icon: /*#__PURE__*/ React.createElement(IconComponent, null)
  }
}

var SubInputMap = {
  input: Input,
  textarea: Input.TextArea,
  password: Input.Password,
  search: Input.Search
}

var Index$a = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(_props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, _props)

    _defineProperty(
      _assertThisInitialized(_this),
      'onSelectChange',
      /*#__PURE__*/ (function () {
        var _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(value) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    _context.next = 2
                    return setAsyncState(_assertThisInitialized(_this), {
                      selectValue: value
                    })

                  case 2:
                    _this.onChange()

                  case 3:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function (_x) {
          return _ref.apply(this, arguments)
        }
      })()
    )

    _defineProperty(
      _assertThisInitialized(_this),
      'onInputChange',
      /*#__PURE__*/ (function () {
        var _ref2 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(e) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    _context2.next = 2
                    return setAsyncState(_assertThisInitialized(_this), {
                      inputValue: e.target.value.trim()
                    })

                  case 2:
                    _this.onChange()

                  case 3:
                  case 'end':
                    return _context2.stop()
                }
              }
            }, _callee2)
          })
        )

        return function (_x2) {
          return _ref2.apply(this, arguments)
        }
      })()
    )

    _defineProperty(_assertThisInitialized(_this), 'onSearch', function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
        props = _assertThisInitialize.props

      var onSearch = props.onSearch

      if (!isFunction(onSearch)) {
        return
      }

      onSearch()
    })

    _defineProperty(_assertThisInitialized(_this), 'onChange', function () {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
        props = _assertThisInitialize2.props,
        state = _assertThisInitialize2.state

      var onChange = props.onChange

      if (!isFunction(onChange)) {
        return
      }

      var inputType = props.inputType
      var selectValue = state.selectValue,
        inputValue = state.inputValue

      if (['select-search', 'select-input'].includes(inputType)) {
        onChange([selectValue, inputValue])
        return
      }

      onChange(inputValue)
    })

    _this.state = {
      selectValue: null,
      inputValue: _props.value
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var props = this.props
        var value = props.value,
          inputType = props.inputType,
          options = props.options

        if (['select-search', 'select-input'].includes(inputType)) {
          if (value === '') {
            this.setState({
              selectValue: options[0].value
            })
          }

          if (Array.isArray(value) && value.length === 2) {
            this.setState({
              selectValue: value[0],
              inputValue: value[1]
            })
          }
        }
      }
    },
    {
      key: 'render',
      value: function render() {
        var props = this.props,
          state = this.state,
          onSelectChange = this.onSelectChange,
          onInputChange = this.onInputChange,
          _onSearch = this.onSearch
        var inputType = props.inputType,
          options = props.options,
          selectWidth = props.selectWidth,
          inputWidth = props.inputWidth
        var selectValue = state.selectValue,
          inputValue = state.inputValue
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onSearch',
          'inputType',
          'inputWidth',
          'selectWidth'
        ])

        if (['input', 'textarea', 'password', 'search'].includes(inputType)) {
          var InputComponent = SubInputMap[inputType]

          if (['input', 'search'].includes(inputType)) {
            componentProps.onPressEnter = function () {
              _onSearch()
            }

            if (['search'].includes(inputType)) {
              componentProps.onSearch = function () {
                _onSearch()
              }
            }
          }

          return /*#__PURE__*/ React.createElement(
            InputComponent,
            _extends({}, componentProps, {
              value: inputValue,
              onChange: onInputChange
            })
          )
        }

        if (['select-search', 'select-input'].includes(inputType)) {
          var _ref3 =
              options.find(function (v) {
                return v.value === selectValue
              }) || {},
            label = _ref3.label

          return /*#__PURE__*/ React.createElement(
            Input.Group,
            {
              compact: true
            },
            /*#__PURE__*/ React.createElement(
              Select,
              {
                disabled: props.disabled,
                value: selectValue,
                onChange: onSelectChange,
                style: {
                  width: selectWidth
                }
              },
              options.map(function (v) {
                return /*#__PURE__*/ React.createElement(
                  Select.Option,
                  {
                    value: v.value,
                    key: v.value
                  },
                  v.label
                )
              })
            ),
            inputType === 'select-search'
              ? /*#__PURE__*/ React.createElement(
                  Input.Search,
                  _extends({}, componentProps, {
                    value: inputValue,
                    onChange: onInputChange,
                    onSearch: function onSearch() {
                      _onSearch()
                    },
                    style: {
                      width: inputWidth
                    },
                    placeholder: ['请输入', label].join('')
                  })
                )
              : /*#__PURE__*/ React.createElement(
                  Input,
                  _extends({}, omit(componentProps, ['enterButton']), {
                    value: inputValue,
                    onChange: onInputChange,
                    style: {
                      width: inputWidth
                    },
                    placeholder: ['请输入', label].join('')
                  })
                )
          )
        }

        return null
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$a, 'displayName', getDisplayName('Input'))

_defineProperty(Index$a, 'defaultProps', {
  inputType: 'input',
  options: [],
  inputWidth: 200,
  selectWidth: 100
})

_defineProperty(Index$a, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  inputType: PropTypes.oneOf(['input', 'textarea', 'password', 'search', 'select-search', 'select-input']),
  options: PropTypes.array,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inputWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
})

var Index$9 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, props)
    var value = props.value || []
    _this.state = {
      minValue: value[0],
      maxValue: value[1]
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'onInputChange',
      value: function onInputChange() {
        var props = this.props,
          state = this.state
        var onChange = props.onChange
        var minValue = state.minValue,
          maxValue = state.maxValue // 反转

        var isNeedReverse = isEveryTruthy(!isEmptyValue(minValue), !isEmptyValue(maxValue), minValue > maxValue)

        if (isNeedReverse) {
          onChange([maxValue, minValue])
        } else {
          onChange([minValue, maxValue])
        }

        if (this.props.onCustomChange) {
          this.props.onCustomChange()
        }
      }
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this

        var props = this.props,
          state = this.state
        var placeholder = props.placeholder,
          style = props.style,
          separator = props.separator,
          separatorWidth = props.separatorWidth
        var minValue = state.minValue,
          maxValue = state.maxValue
        var inputWidth = 'calc(50% - '.concat(separatorWidth / 2, 'px)')
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'style',
          'separator',
          'separatorWidth'
        ])
        return /*#__PURE__*/ React.createElement(
          Input.Group,
          {
            compact: true,
            className: getClassNames('number-range'),
            style: style
          },
          /*#__PURE__*/ React.createElement(
            InputNumber,
            _extends(
              {
                disabled: props.disabled,
                value: minValue,
                onChange: /*#__PURE__*/ (function () {
                  var _ref = _asyncToGenerator(
                    /*#__PURE__*/ regeneratorRuntime.mark(function _callee(value) {
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch ((_context.prev = _context.next)) {
                            case 0:
                              _context.next = 2
                              return setAsyncState(_this2, {
                                minValue: value
                              })

                            case 2:
                              _this2.onInputChange()

                            case 3:
                            case 'end':
                              return _context.stop()
                          }
                        }
                      }, _callee)
                    })
                  )

                  return function (_x) {
                    return _ref.apply(this, arguments)
                  }
                })(),
                className: getClassNames('number-range-min'),
                style: {
                  width: inputWidth
                }
              },
              componentProps,
              {
                placeholder: placeholder.split(',')[0]
              }
            )
          ),
          /*#__PURE__*/ React.createElement(Input, {
            disabled: true,
            className: getClassNames('number-range-separator'),
            style: {
              width: separatorWidth
            },
            placeholder: separator
          }),
          /*#__PURE__*/ React.createElement(
            InputNumber,
            _extends(
              {
                disabled: props.disabled,
                value: maxValue,
                onChange: /*#__PURE__*/ (function () {
                  var _ref2 = _asyncToGenerator(
                    /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(value) {
                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch ((_context2.prev = _context2.next)) {
                            case 0:
                              _context2.next = 2
                              return setAsyncState(_this2, {
                                maxValue: value
                              })

                            case 2:
                              _this2.onInputChange()

                            case 3:
                            case 'end':
                              return _context2.stop()
                          }
                        }
                      }, _callee2)
                    })
                  )

                  return function (_x2) {
                    return _ref2.apply(this, arguments)
                  }
                })(),
                className: getClassNames('number-range-max'),
                style: {
                  width: inputWidth
                }
              },
              componentProps,
              {
                placeholder: placeholder.split(',')[1]
              }
            )
          )
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$9, 'displayName', getDisplayName('NumberRange'))

_defineProperty(Index$9, 'defaultProps', {
  placeholder: '最小值,最大值',
  separator: '~',
  separatorWidth: 30
})

_defineProperty(Index$9, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  // placeholder
  separator: PropTypes.string,
  // 分割符
  separatorWidth: PropTypes.number // 分割符宽度
})

var CacheFetch$3 = []

var getCacheFetch$3 = function getCacheFetch(remoteConfig) {
  var item = find(CacheFetch$3, {
    remoteConfig: remoteConfig
  })

  if (item) {
    return item.request
  }

  var requestInstance = remoteConfig.fetch()
  CacheFetch$3.push({
    remoteConfig: remoteConfig,
    request: requestInstance
  })
  return requestInstance
}

var Index$8 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(_props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, _props)

    _defineProperty(
      _assertThisInitialized(_this),
      'handleSearch',
      /*#__PURE__*/ (function () {
        var _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(searchText) {
            var remoteConfig, value, fetchFunc, _remoteConfig$process, processFunc, responseData, options

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    remoteConfig = _this.props.remoteConfig
                    value = searchText.trim().replace(/'/g, '')

                    if (value) {
                      _context.next = 5
                      break
                    }

                    _this.setState({
                      options: []
                    })

                    return _context.abrupt('return')

                  case 5:
                    ;(fetchFunc = remoteConfig.fetch),
                      (_remoteConfig$process = remoteConfig.process),
                      (processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process)
                    _context.next = 8
                    return fetchFunc(value)

                  case 8:
                    responseData = _context.sent
                    options = convertDataToEnum(
                      processFunc(responseData) || responseData,
                      pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
                    )

                    _this.setState({
                      options: options
                    })

                  case 11:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function (_x) {
          return _ref.apply(this, arguments)
        }
      })()
    )

    _defineProperty(_assertThisInitialized(_this), 'handleChange', function (value) {
      var _this$state = _this.state,
        options = _this$state.options,
        isMultipleAllSelect = _this$state.isMultipleAllSelect

      if (isMultipleAllSelect) {
        var indeterminate = !isEqual(map(options, 'value').sort(), value.sort())

        _this.setState({
          indeterminate: !isEmptyArray(value) && indeterminate,
          checkAll: !indeterminate
        })
      }
    })

    _defineProperty(_assertThisInitialized(_this), 'onCheckAllChange', function (e) {
      var _assertThisInitialize = _assertThisInitialized(_this),
        props = _assertThisInitialize.props,
        state = _assertThisInitialize.state

      var onChange = props.onChange
      var options = state.options
      var checked = e.target.checked

      _this.setState({
        checkAll: checked,
        indeterminate: false
      })

      onChange(checked ? map(options, 'value') : [])
    })

    _this.state = {
      options: cloneDeep(_props.options),
      // 多选 + 全选
      isMultipleAllSelect: ['multiple', 'tags'].includes(_props.mode) && _props.allItem,
      checkAll: false,
      indeterminate: false // 多选模式的全选按钮的 indeterminate 状态
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'componentDidMount',
      value: (function () {
        var _componentDidMount = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee2() {
            var props,
              value,
              remoteConfig,
              showSearch,
              isMultipleAllSelect,
              _options,
              indeterminate,
              _remoteConfig$process2,
              processFunc,
              responseData,
              options,
              _indeterminate

            return regeneratorRuntime.wrap(
              function _callee2$(_context2) {
                while (1) {
                  switch ((_context2.prev = _context2.next)) {
                    case 0:
                      props = this.props
                      ;(value = props.value),
                        (remoteConfig = props.remoteConfig),
                        (showSearch = props.showSearch),
                        (isMultipleAllSelect = props.isMultipleAllSelect)

                      if (isObject(remoteConfig)) {
                        _context2.next = 5
                        break
                      }

                      if (isMultipleAllSelect) {
                        _options = props.options
                        indeterminate = !isEqual(map(_options, 'value').sort(), value.sort())
                        this.setState({
                          indeterminate: indeterminate,
                          checkAll: !indeterminate
                        })
                      }

                      return _context2.abrupt('return')

                    case 5:
                      if (!showSearch) {
                        _context2.next = 7
                        break
                      }

                      return _context2.abrupt('return')

                    case 7:
                      ;(_remoteConfig$process2 = remoteConfig.process),
                        (processFunc = _remoteConfig$process2 === void 0 ? noop : _remoteConfig$process2)
                      _context2.next = 10
                      return getCacheFetch$3(remoteConfig)

                    case 10:
                      responseData = _context2.sent
                      options = convertDataToEnum(
                        processFunc(responseData) || responseData,
                        pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
                      )
                      this.setState({
                        options: options
                      })

                      if (isMultipleAllSelect) {
                        _indeterminate = !isEqual(map(options, 'value').sort(), value.sort())
                        this.setState({
                          indeterminate: _indeterminate,
                          checkAll: !_indeterminate
                        })
                      }

                    case 14:
                    case 'end':
                      return _context2.stop()
                  }
                }
              },
              _callee2,
              this
            )
          })
        )

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments)
        }

        return componentDidMount
      })()
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this

        var props = this.props,
          state = this.state
        var value = props.value,
          _onChange = props.onChange,
          allItem = props.allItem,
          showSearch = props.showSearch
        var options = state.options,
          checkAll = state.checkAll,
          isMultipleAllSelect = state.isMultipleAllSelect,
          indeterminate = state.indeterminate
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'options',
          'allItem',
          'remoteConfig'
        ])

        if (showSearch) {
          componentProps.onSearch = debounce(this.handleSearch, 200)
        } // 复选 - 全选

        if (isMultipleAllSelect && options.length) {
          componentProps.dropdownRender = function (menu) {
            return /*#__PURE__*/ React.createElement(
              Fragment,
              null,
              menu,
              /*#__PURE__*/ React.createElement(Divider, {
                style: {
                  margin: '4px 0'
                }
              }),
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  style: {
                    padding: '4px 12px'
                  }
                },
                /*#__PURE__*/ React.createElement(
                  Checkbox,
                  {
                    checked: checkAll,
                    indeterminate: indeterminate,
                    onChange: _this2.onCheckAllChange
                  },
                  allItem.label
                )
              )
            )
          }
        }

        return /*#__PURE__*/ React.createElement(
          Select,
          _extends({}, componentProps, {
            value: value,
            onChange: function onChange(val) {
              _onChange(val)

              _this2.handleChange(val)

              if (props.onCustomChange) {
                props.onCustomChange(val, options)
              }
            }
          }),
          [isMultipleAllSelect ? null : allItem]
            .concat(_toConsumableArray(options))
            .filter(Boolean)
            .map(function (v) {
              var optionProps = pick(v, ['className', 'disabled', 'title', 'value'])
              return /*#__PURE__*/ React.createElement(
                Select.Option,
                _extends(
                  {
                    key: v.value
                  },
                  optionProps
                ),
                v.label
              )
            })
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$8, 'displayName', getDisplayName('Select'))

_defineProperty(Index$8, 'defaultProps', {
  options: []
})

_defineProperty(Index$8, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  allItem: PropTypes.object,
  options: PropTypes.array,
  remoteConfig: PropTypes.object
})

var CacheFetch$2 = []

var getCacheFetch$2 = function getCacheFetch(remoteConfig) {
  var item = find(CacheFetch$2, {
    remoteConfig: remoteConfig
  })

  if (item) {
    return item.request
  }

  var requestInstance = remoteConfig.fetch()
  CacheFetch$2.push({
    remoteConfig: remoteConfig,
    request: requestInstance
  })
  return requestInstance
}

var Index$7 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, props)

    _defineProperty(_assertThisInitialized(_this), 'onCheckAllChange', function (e) {
      var options = cloneDeep(_this.state.options)
      var checked = e.target.checked
      var checkedList = checked ? map(options, 'value') : []

      _this.setState({
        checkAll: checked,
        indeterminate: false
      })

      _this.props.onChange(checkedList)
    })

    _defineProperty(_assertThisInitialized(_this), 'setCheckAll', function () {
      var value = _this.props.value
      var options = _this.state.options

      _this.setState({
        indeterminate: value.length && options.length !== value.length,
        checkAll: options.length === value.length
      })
    })

    var _options = cloneDeep(props.options)

    _this.state = {
      options: _options,
      indeterminate: false,
      checkAll: false
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'componentDidMount',
      value: (function () {
        var _componentDidMount = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var _this2 = this

            var props, defaultSelectAll, remoteConfig, _remoteConfig$process, processFunc, responseData, options

            return regeneratorRuntime.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      props = this.props
                      ;(defaultSelectAll = props.defaultSelectAll), (remoteConfig = props.remoteConfig)

                      if (isObject(remoteConfig)) {
                        _context.next = 5
                        break
                      }

                      this.setCheckAll()
                      return _context.abrupt('return')

                    case 5:
                      ;(_remoteConfig$process = remoteConfig.process),
                        (processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process)
                      _context.next = 8
                      return getCacheFetch$2(remoteConfig)

                    case 8:
                      responseData = _context.sent
                      options = convertDataToEnum(
                        processFunc(responseData) || responseData,
                        pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
                      )

                      if (defaultSelectAll) {
                        this.setState(
                          {
                            options: options,
                            checkAll: true
                          },
                          function () {
                            var checkedList = map(options, 'value')

                            _this2.props.onChange(checkedList)
                          }
                        )
                      } else {
                        this.setState(
                          {
                            options: options
                          },
                          function () {
                            _this2.setCheckAll()
                          }
                        )
                      }

                    case 11:
                    case 'end':
                      return _context.stop()
                  }
                }
              },
              _callee,
              this
            )
          })
        )

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments)
        }

        return componentDidMount
      })()
    },
    {
      key: 'render',
      value: function render() {
        var _this3 = this

        var props = this.props,
          state = this.state
        var value = props.value,
          _onChange = props.onChange
        var options = state.options,
          indeterminate = state.indeterminate,
          checkAll = state.checkAll
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'options',
          'onCustomChange',
          'remoteConfig',
          'indeterminate',
          'defaultSelectAll'
        ])
        return /*#__PURE__*/ React.createElement(
          Fragment,
          null,
          !!props.indeterminate &&
            !isEmptyArray(options) &&
            /*#__PURE__*/ React.createElement(
              Checkbox,
              {
                indeterminate: indeterminate,
                onChange: this.onCheckAllChange,
                checked: checkAll
              },
              '\u5168\u9009'
            ),
          /*#__PURE__*/ React.createElement(
            Checkbox.Group,
            _extends({}, componentProps, {
              options: options,
              value: value,
              onChange: function onChange(val) {
                _onChange(val)

                _this3.setState({
                  indeterminate: val.length && options.length !== val.length,
                  checkAll: options.length === val.length
                })

                if (props.onCustomChange) {
                  props.onCustomChange()
                }
              }
            })
          )
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$7, 'displayName', getDisplayName('Checkbox'))

_defineProperty(Index$7, 'defaultProps', {
  // 是否展示全部
  indeterminate: false,
  defaultSelectAll: false // 默认选择全部
})

_defineProperty(Index$7, 'propTypes', {
  indeterminate: PropTypes.bool,
  defaultSelectAll: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object
})

var TabPane = Tabs.TabPane

var Index$6 = /*#__PURE__*/ (function (_PureComponent) {
  _inherits(Index, _PureComponent)

  var _super = _createSuper(Index)

  function Index() {
    _classCallCheck(this, Index)

    return _super.apply(this, arguments)
  }

  _createClass(Index, [
    {
      key: 'render',
      value: function render() {
        var props = this.props
        var _onChange = props.onChange,
          options = props.options
        var shouldBeNumber = isNumber(last(options).value)
        var innerValue = String(props.value)
        var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'style', 'emitReset'])
        return /*#__PURE__*/ React.createElement(
          Tabs,
          _extends(
            {
              animated: false
            },
            componentProps,
            {
              activeKey: innerValue,
              defaultActiveKey: innerValue,
              onChange: function onChange(activeKey) {
                _onChange(shouldBeNumber ? Number(activeKey) : activeKey)

                if (props.onCustomChange) {
                  props.onCustomChange()
                }
              }
            }
          ),
          options.map(function (v) {
            var value = v.value,
              label = v.label
            return /*#__PURE__*/ React.createElement(TabPane, {
              tab: label,
              key: value
            })
          })
        )
      }
    }
  ])

  return Index
})(PureComponent)

_defineProperty(Index$6, 'displayName', getDisplayName('Tabs'))

_defineProperty(Index$6, 'defaultProps', {})

_defineProperty(Index$6, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func
})

var CacheFetch$1 = []

var getCacheFetch$1 = function getCacheFetch(remoteConfig) {
  var item = find(CacheFetch$1, {
    remoteConfig: remoteConfig
  })

  if (item) {
    return item.request
  }

  var requestInstance = remoteConfig.fetch()
  CacheFetch$1.push({
    remoteConfig: remoteConfig,
    request: requestInstance
  })
  return requestInstance
}

var Index$5 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, props)
    _this.state = {
      options: cloneDeep(props.options)
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'componentDidMount',
      value: (function () {
        var _componentDidMount = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var props, remoteConfig, _remoteConfig$process, processFunc, responseData, options

            return regeneratorRuntime.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      props = this.props
                      remoteConfig = props.remoteConfig

                      if (isObject(remoteConfig)) {
                        _context.next = 4
                        break
                      }

                      return _context.abrupt('return')

                    case 4:
                      ;(_remoteConfig$process = remoteConfig.process),
                        (processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process)
                      _context.next = 7
                      return getCacheFetch$1(remoteConfig)

                    case 7:
                      responseData = _context.sent
                      options = convertDataToEnum(processFunc(responseData) || responseData, remoteConfig)
                      this.setState({
                        options: options
                      })

                    case 10:
                    case 'end':
                      return _context.stop()
                  }
                }
              },
              _callee,
              this
            )
          })
        )

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments)
        }

        return componentDidMount
      })()
    },
    {
      key: 'render',
      value: function render() {
        var _this2 = this

        var props = this.props,
          state = this.state
        var value = props.value,
          _onChange = props.onChange,
          loadData = props.loadData
        var options = state.options
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'options',
          'remoteConfig',
          'loadData'
        ])

        if (loadData) {
          componentProps.loadData = /*#__PURE__*/ (function () {
            var _ref = _asyncToGenerator(
              /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(selectedOptions) {
                var remoteConfig, targetOption, fetchFunc, _remoteConfig$process2, processFunc, responseData

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch ((_context2.prev = _context2.next)) {
                      case 0:
                        remoteConfig = props.loadData
                        targetOption = last(selectedOptions)
                        targetOption.loading = true
                        ;(fetchFunc = remoteConfig.fetch),
                          (_remoteConfig$process2 = remoteConfig.process),
                          (processFunc = _remoteConfig$process2 === void 0 ? noop : _remoteConfig$process2)
                        _context2.next = 6
                        return fetchFunc(selectedOptions, targetOption)

                      case 6:
                        responseData = _context2.sent
                        targetOption.loading = false
                        targetOption.children = convertDataToEnum(
                          processFunc(responseData) || responseData,
                          remoteConfig
                        )

                        _this2.setState(function (prevState) {
                          return {
                            options: _toConsumableArray(prevState.options)
                          }
                        })

                      case 10:
                      case 'end':
                        return _context2.stop()
                    }
                  }
                }, _callee2)
              })
            )

            return function (_x) {
              return _ref.apply(this, arguments)
            }
          })()
        }

        return /*#__PURE__*/ React.createElement(
          Cascader,
          _extends({}, componentProps, {
            value: value,
            options: options,
            onChange: function onChange(val) {
              _onChange(val)

              if (props.onCustomChange) {
                props.onCustomChange()
              }
            }
          })
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$5, 'displayName', getDisplayName('Cascader'))

_defineProperty(Index$5, 'defaultProps', {
  options: []
})

_defineProperty(Index$5, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  loadData: PropTypes.object,
  options: PropTypes.array,
  remoteConfig: PropTypes.object
})

var CacheFetch = []

var getCacheFetch = function getCacheFetch(remoteConfig) {
  var item = find(CacheFetch, {
    remoteConfig: remoteConfig
  })

  if (item) {
    return item.request
  }

  var requestInstance = remoteConfig.fetch()
  CacheFetch.push({
    remoteConfig: remoteConfig,
    request: requestInstance
  })
  return requestInstance
}

var Index$4 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, props)
    _this.state = {
      treeData: cloneDeep(props.treeData)
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'componentDidMount',
      value: (function () {
        var _componentDidMount = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var props, remoteConfig, _remoteConfig$process, processFunc, responseData, treeData

            return regeneratorRuntime.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      props = this.props
                      remoteConfig = props.remoteConfig

                      if (isObject(remoteConfig)) {
                        _context.next = 4
                        break
                      }

                      return _context.abrupt('return')

                    case 4:
                      ;(_remoteConfig$process = remoteConfig.process),
                        (processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process)
                      _context.next = 7
                      return getCacheFetch(remoteConfig)

                    case 7:
                      responseData = _context.sent
                      treeData = processFunc(responseData) || responseData
                      this.setState({
                        treeData: treeData
                      })

                    case 10:
                    case 'end':
                      return _context.stop()
                  }
                }
              },
              _callee,
              this
            )
          })
        )

        function componentDidMount() {
          return _componentDidMount.apply(this, arguments)
        }

        return componentDidMount
      })()
    },
    {
      key: 'render',
      value: function render() {
        var props = this.props,
          state = this.state
        var value = props.value,
          _onChange = props.onChange
        var treeData = state.treeData
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'treeData',
          'remoteConfig'
        ])
        return /*#__PURE__*/ React.createElement(
          TreeSelect,
          _extends({}, componentProps, {
            value: value,
            treeData: treeData,
            onChange: function onChange(val) {
              _onChange(val)

              if (props.onCustomChange) {
                props.onCustomChange()
              }
            }
          })
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$4, 'displayName', getDisplayName('TreeSelect'))

_defineProperty(Index$4, 'defaultProps', {})

_defineProperty(Index$4, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object
})

var Index$3 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(_props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, _props)

    _defineProperty(
      _assertThisInitialized(_this),
      'onSearch',
      /*#__PURE__*/ (function () {
        var _ref = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(searchText) {
            var _assertThisInitialize,
              props,
              remoteConfig,
              query,
              fetchFunc,
              _remoteConfig$process,
              processFunc,
              responseData,
              options

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    ;(_assertThisInitialize = _assertThisInitialized(_this)), (props = _assertThisInitialize.props)
                    remoteConfig = props.remoteConfig
                    query = searchText.trim()

                    if (query) {
                      _context.next = 6
                      break
                    }

                    _this.setState({
                      options: []
                    })

                    return _context.abrupt('return')

                  case 6:
                    ;(fetchFunc = remoteConfig.fetch),
                      (_remoteConfig$process = remoteConfig.process),
                      (processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process)
                    _context.next = 9
                    return fetchFunc(query)

                  case 9:
                    responseData = _context.sent
                    options = convertDataToEnum(
                      processFunc(responseData) || responseData,
                      pick(remoteConfig, ['path', 'valueKey', 'labelKey'])
                    )

                    _this.setState({
                      options: options
                    })

                  case 12:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function (_x) {
          return _ref.apply(this, arguments)
        }
      })()
    )

    _this.state = {
      inputValue: _props.value || '',
      options: _props.options || []
    }
    _this.formRef = /*#__PURE__*/ React.createRef()
    _this.onDebounceSearch = debounce(_this.onSearch, _props.debounce)
    return _this
  }

  _createClass(Index, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this

        var props = this.props,
          state = this.state
        var onChange = props.onChange
        var inputValue = state.inputValue,
          options = state.options
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'options',
          'remoteConfig'
        ])

        if (isAntdV3) {
          componentProps.dataSource = options.map(function (v) {
            return {
              value: v.value,
              text: v.label
            }
          })
        } else {
          componentProps.options = options
        }

        return /*#__PURE__*/ React.createElement(
          AutoComplete,
          _extends({}, componentProps, {
            ref: this.formRef,
            value: inputValue,
            onChange: function onChange(text) {
              _this2.setState({
                inputValue: String(text).trim()
              })
            },
            onSearch: this.onDebounceSearch,
            onSelect: function onSelect(val) {
              onChange(val)

              if (props.onCustomChange) {
                props.onCustomChange()
              }

              _this2.formRef.current.blur()
            }
          })
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$3, 'displayName', getDisplayName('AutoComplete'))

_defineProperty(Index$3, 'defaultProps', {
  debounce: 200
})

_defineProperty(Index$3, 'propTypes', {
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object.isRequired,
  debounce: PropTypes.number
})

var Index$2 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index() {
    var _this

    _classCallCheck(this, Index)

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))

    _defineProperty(_assertThisInitialized(_this), 'onChange', function (checked, event) {
      if (!isFunction(_this.props.onChange)) {
        return
      }

      _this.props.onChange(checked, event)

      if (_this.props.onCustomChange) {
        _this.props.onCustomChange()
      }
    })

    return _this
  }

  _createClass(Index, [
    {
      key: 'render',
      value: function render() {
        var _this$props = this.props,
          defaultValue = _this$props.defaultValue,
          value = _this$props.value,
          style = _this$props.style
        var onChange = this.onChange
        var componentProps = omit(this.props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'style'])
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: style
          },
          /*#__PURE__*/ React.createElement(
            Switch,
            _extends(
              {
                checked: value,
                defaultChecked: defaultValue,
                onChange: onChange
              },
              componentProps
            )
          )
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$2, 'displayName', 'DynamicFormSwitch')

_defineProperty(Index$2, 'defaultProps', {})

_defineProperty(Index$2, 'propTypes', {
  value: PropTypes.bool,
  onChange: PropTypes.func
})

var Index$1 = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index() {
    var _this

    _classCallCheck(this, Index)

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key]
    }

    _this = _super.call.apply(_super, [this].concat(args))

    _defineProperty(_assertThisInitialized(_this), 'onChange', function (value) {
      _this.props.onChange(value)
    })

    _defineProperty(_assertThisInitialized(_this), 'onAfterChange', function (value) {
      _this.props.onChange(value)

      if (_this.props.onCustomChange) {
        _this.props.onCustomChange()
      }
    })

    return _this
  }

  _createClass(Index, [
    {
      key: 'render',
      value: function render() {
        var props = this.props,
          onChange = this.onChange,
          onAfterChange = this.onAfterChange
        var value = props.value,
          style = props.style,
          InputNumberWidth = props.InputNumberWidth
        var componentProps = omit(props, [
          'defaultValue',
          'value',
          'onChange',
          'onCustomChange',
          'style',
          'InputNumberWidth'
        ])
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            style: _objectSpread2(
              {
                display: 'flex',
                justifyContent: 'space-between'
              },
              style
            )
          },
          /*#__PURE__*/ React.createElement(
            Slider,
            _extends(
              {
                style: {
                  width: style.width - InputNumberWidth - 15
                },
                value: value,
                onChange: onChange,
                onAfterChange: onAfterChange
              },
              componentProps
            )
          ),
          /*#__PURE__*/ React.createElement(
            InputNumber,
            _extends(
              {
                style: {
                  width: InputNumberWidth
                },
                value: value,
                onChange: onAfterChange
              },
              componentProps
            )
          )
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index$1, 'displayName', 'DynamicFormSlider')

_defineProperty(Index$1, 'defaultProps', {
  InputNumberWidth: 65
})

_defineProperty(Index$1, 'propTypes', {
  value: PropTypes.number,
  onChange: PropTypes.func,
  InputNumberWidth: PropTypes.number
})

var getBase64 = function getBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = function () {
      resolve(reader.result)
    }

    reader.onerror = function (error) {
      reject(error)
    }
  })
}

var getFileList = function getFileList(value) {
  return flatten([value])
    .filter(Boolean)
    .map(function (v) {
      if (isString(v)) {
        return {
          url: v,
          name: v
        }
      }

      return _objectSpread2(
        {
          name: v.url
        },
        v
      )
    })
}

var Index = /*#__PURE__*/ (function (_Component) {
  _inherits(Index, _Component)

  var _super = _createSuper(Index)

  function Index(_props) {
    var _this

    _classCallCheck(this, Index)

    _this = _super.call(this, _props)

    _defineProperty(_assertThisInitialized(_this), 'handleChange', function (_ref) {
      var fileList = _ref.fileList

      var _assertThisInitialize = _assertThisInitialized(_this),
        props = _assertThisInitialize.props

      var maxCount = props.maxCount,
        onChange = props.onChange

      _this.setState({
        fileList: fileList
      })

      if (isFunction(onChange)) {
        if (maxCount === 1) {
          onChange(fileList[0])
        } else {
          onChange(fileList)
        }
      }
    })

    _defineProperty(
      _assertThisInitialized(_this),
      'handlePreview',
      /*#__PURE__*/ (function () {
        var _ref2 = _asyncToGenerator(
          /*#__PURE__*/ regeneratorRuntime.mark(function _callee(file) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    if (!(!file.url && !file.preview)) {
                      _context.next = 4
                      break
                    }

                    _context.next = 3
                    return getBase64(file.originFileObj)

                  case 3:
                    file.preview = _context.sent

                  case 4:
                    _this.setState({
                      previewImage: file.url || file.preview,
                      previewVisible: true
                    })

                  case 5:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function (_x) {
          return _ref2.apply(this, arguments)
        }
      })()
    )

    _defineProperty(_assertThisInitialized(_this), 'getUploadButton', function () {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
        props = _assertThisInitialize2.props,
        state = _assertThisInitialize2.state

      var _props$disabled = props.disabled,
        disabled = _props$disabled === void 0 ? false : _props$disabled,
        maxCount = props.maxCount,
        listType = props.listType
      var fileList = state.fileList

      var disabledFunc = function disabledFunc(e) {
        if (fileList.length >= maxCount) {
          message.error(
            '\u6700\u591A\u4E0A\u4F20'.concat(
              maxCount,
              '\u4E2A\u6587\u4EF6, \u53EF\u5148\u5220\u9664\u5176\u4ED6\u6587\u4EF6!'
            )
          )
          e.stopPropagation()
        }
      }

      if (listType === 'picture-card') {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            onClick: disabledFunc,
            className: getClassNames('upload-button')
          },
          /*#__PURE__*/ React.createElement(PlusOutlined, null),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              style: {
                marginTop: 8
              }
            },
            '\u4E0A\u4F20'
          )
        )
      }

      return /*#__PURE__*/ React.createElement(
        Button,
        _extends(
          {
            disabled: disabled,
            onClick: disabledFunc
          },
          getIconButtonProps('upload')
        ),
        '\u4E0A\u4F20'
      )
    })

    _this.state = {
      fileList: getFileList(_props.value),
      previewVisible: false,
      previewImage: ''
    }
    return _this
  }

  _createClass(Index, [
    {
      key: 'render',
      value: function render() {
        var _this2 = this

        var props = this.props,
          state = this.state
        var fileList = state.fileList,
          previewVisible = state.previewVisible,
          previewImage = state.previewImage
        var UploadProps = omit(props, ['value', 'onChange'])
        return /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          /*#__PURE__*/ React.createElement(
            Upload,
            _extends(
              {
                fileList: fileList,
                onChange: this.handleChange,
                onPreview: props.onPreview || this.handlePreview
              },
              UploadProps
            ),
            this.getUploadButton()
          ),
          /*#__PURE__*/ React.createElement(Image, {
            width: 200,
            style: {
              display: 'none'
            },
            src: previewImage,
            preview: {
              visible: previewVisible,
              src: previewImage,
              onVisibleChange: function onVisibleChange(value) {
                _this2.setState({
                  previewVisible: value
                })
              }
            }
          })
        )
      }
    }
  ])

  return Index
})(Component)

_defineProperty(Index, 'displayName', 'DynamicFormUpload')

_defineProperty(Index, 'defaultProps', {
  maxCount: 1 // 文件数量
})

_defineProperty(Index, 'propTypes', {
  maxCount: PropTypes.number,
  value: PropTypes.any,
  onChange: PropTypes.func
})

/*
 * @Author: fangt11
 * @Date:   2021-11-17 13:53:21
 * @Last Modified by:   fangt11
 * @Last Modified time: 2022-03-31 15:23:32
 */

var components = {
  input: Index$a,
  number: InputNumber,
  'number-range': Index$9,
  radio: Radio.Group,
  checkbox: Index$7,
  tabs: Index$6,
  select: Index$8,
  cascader: Index$5,
  'tree-select': Index$4,
  'date-picker': DatePicker,
  'date-range-picker': DatePicker.RangePicker,
  'time-picker': TimePicker,
  'time-range-picker': TimePicker.RangePicker,
  'auto-complete': Index$3,
  switch: Index$2,
  rate: Rate,
  slider: Index$1,
  upload: Index
}

export { components as default }
