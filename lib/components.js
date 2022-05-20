import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { version, Input, Select, InputNumber, Checkbox, Tabs, Cascader, TreeSelect, AutoComplete, Switch, Slider } from 'antd';
import { inRange, kebabCase, isFunction, omit, cloneDeep, debounce, pick, noop, isObject, map, isNumber, last } from 'lodash';
import { classNames, setAsyncState, isEveryTruthy, isEmptyValue, convertDataToEnum, isEmptyArray } from '@nbfe/tools';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isAntdV3 = inRange(parseInt(version, 10), 3, 4);
inRange(parseInt(version, 10), 4, 5);
var componentName = 'DynamicForm';
var prefixClassName = kebabCase(componentName);

var getDisplayName = function getDisplayName() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return [componentName, name].join('');
};
var getClassNames = function getClassNames() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return classNames(args).split(' ').map(function (v) {
    return [prefixClassName, v].filter(Boolean).join('-');
  }).join(' ');
}; // 处理 props.columns

var SubInputMap = {
  input: Input,
  textarea: Input.TextArea,
  password: Input.Password,
  search: Input.Search
};

var Index$9 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(_props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "onSelectChange", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return setAsyncState(_assertThisInitialized(_this), {
                  selectValue: value
                });

              case 2:
                _this.onChange();

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "onInputChange", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return setAsyncState(_assertThisInitialized(_this), {
                  inputValue: e.target.value.trim()
                });

              case 2:
                _this.onChange();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "onSearch", function () {
      var _assertThisInitialize = _assertThisInitialized(_this),
          props = _assertThisInitialize.props;

      var onSearch = props.onSearch;

      if (!isFunction(onSearch)) {
        return;
      }

      onSearch();
    });

    _defineProperty(_assertThisInitialized(_this), "onChange", function () {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
          props = _assertThisInitialize2.props,
          state = _assertThisInitialize2.state;

      var onChange = props.onChange;

      if (!isFunction(onChange)) {
        return;
      }

      var column = props.column;
      var selectValue = state.selectValue,
          inputValue = state.inputValue;
      var template = column.template;
      var inputType = template.inputType;

      if (['select-search', 'select-input'].includes(inputType)) {
        onChange([selectValue, inputValue]);
        return;
      }

      onChange(inputValue);
    });

    _this.state = {
      selectValue: null,
      inputValue: _props.value
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var props = this.props;
      var column = props.column;
      var defaultValue = column.defaultValue,
          template = column.template;
      var inputType = template.inputType,
          options = template.options;

      if (['select-search', 'select-input'].includes(inputType)) {
        if (defaultValue === '') {
          this.setState({
            selectValue: options[0].value
          });
        }

        if (Array.isArray(defaultValue) && defaultValue.length === 2) {
          this.setState({
            selectValue: defaultValue[0],
            inputValue: defaultValue[1]
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props,
          state = this.state,
          onSelectChange = this.onSelectChange,
          onInputChange = this.onInputChange,
          _onSearch = this.onSearch;
      var column = props.column;
      var selectValue = state.selectValue,
          inputValue = state.inputValue;
      var template = column.template;
      var inputType = template.inputType,
          options = template.options,
          selectWidth = template.selectWidth,
          inputWidth = template.inputWidth;
      var componentProps = omit(props, ['column', 'defaultValue', 'value', 'onChange', 'onSearch', 'style', 'inputType', 'inputWidth', 'selectWidth']);
      componentProps.style = {
        width: inputWidth || template.width
      };

      if (['input', 'textarea', 'password', 'search'].includes(inputType)) {
        var InputComponent = SubInputMap[inputType];

        if (['input', 'search'].includes(inputType)) {
          componentProps.onPressEnter = function () {
            _onSearch();
          };

          if (['search'].includes(inputType)) {
            componentProps.onSearch = function () {
              _onSearch();
            };
          }
        }

        return /*#__PURE__*/React.createElement(InputComponent, _extends({}, componentProps, {
          value: inputValue,
          onChange: onInputChange
        }));
      }

      if (['select-search', 'select-input'].includes(inputType)) {
        var _ref3 = options.find(function (v) {
          return v.value === selectValue;
        }) || {},
            label = _ref3.label;

        return /*#__PURE__*/React.createElement(Input.Group, {
          compact: true
        }, /*#__PURE__*/React.createElement(Select, {
          disabled: props.disabled,
          value: selectValue,
          onChange: onSelectChange,
          style: {
            width: selectWidth
          }
        }, options.map(function (v) {
          return /*#__PURE__*/React.createElement(Select.Option, {
            value: v.value,
            key: v.value
          }, v.label);
        })), inputType === 'select-search' ? /*#__PURE__*/React.createElement(Input.Search, _extends({}, componentProps, {
          value: inputValue,
          onChange: onInputChange,
          onSearch: function onSearch() {
            _onSearch();
          },
          placeholder: ['请输入', label].join('')
        })) : /*#__PURE__*/React.createElement(Input, _extends({}, omit(componentProps, ['enterButton']), {
          value: inputValue,
          onChange: onInputChange,
          placeholder: ['请输入', label].join('')
        })));
      }

      return null;
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$9, "displayName", getDisplayName('Input'));

_defineProperty(Index$9, "defaultProps", {});

_defineProperty(Index$9, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired
});

var Index$8 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);
    var value = props.value || [];
    _this.state = {
      minValue: value[0],
      maxValue: value[1]
    };
    return _this;
  }

  _createClass(Index, [{
    key: "onInputChange",
    value: function onInputChange() {
      var props = this.props,
          state = this.state;
      var onChange = props.onChange;
      var minValue = state.minValue,
          maxValue = state.maxValue; // 反转

      var isNeedReverse = isEveryTruthy(!isEmptyValue(minValue), !isEmptyValue(maxValue), minValue > maxValue);

      if (isNeedReverse) {
        onChange([maxValue, minValue]);
      } else {
        onChange([minValue, maxValue]);
      }

      if (this.props.onCustomChange) {
        this.props.onCustomChange();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = this.props,
          state = this.state;
      var column = props.column,
          separator = props.separator,
          separatorWidth = props.separatorWidth;
      var minValue = state.minValue,
          maxValue = state.maxValue;
      var placeholder = column.placeholder,
          template = column.template;
      var inputWidth = (template.width - separatorWidth) / 2;
      var componentProps = omit(template, ['defaultValue', 'value', 'onChange', 'tpl', 'width', 'separator']);
      return /*#__PURE__*/React.createElement(Input.Group, {
        compact: true,
        className: getClassNames('range-number')
      }, /*#__PURE__*/React.createElement(InputNumber, _extends({
        disabled: props.disabled,
        value: minValue,
        onChange: /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return setAsyncState(_this2, {
                      minValue: value
                    });

                  case 2:
                    _this2.onInputChange();

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }(),
        className: getClassNames('range-number-min'),
        style: {
          width: inputWidth
        }
      }, componentProps, {
        placeholder: placeholder.split(',')[0]
      })), /*#__PURE__*/React.createElement(Input, {
        disabled: true,
        className: getClassNames('range-number-separator'),
        style: {
          width: separatorWidth
        },
        placeholder: separator
      }), /*#__PURE__*/React.createElement(InputNumber, _extends({
        disabled: props.disabled,
        value: maxValue,
        onChange: /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(value) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return setAsyncState(_this2, {
                      maxValue: value
                    });

                  case 2:
                    _this2.onInputChange();

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }(),
        className: getClassNames('range-number-max'),
        style: {
          width: inputWidth
        }
      }, componentProps, {
        placeholder: placeholder.split(',')[1]
      })));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$8, "displayName", getDisplayName('RangeNumber'));

_defineProperty(Index$8, "defaultProps", {
  separator: '~',
  separatorWidth: 30
});

_defineProperty(Index$8, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  column: PropTypes.object,
  separator: PropTypes.string,
  // 分割符
  separatorWidth: PropTypes.number // 分割符宽度

});

var Index$7 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleSearch", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(searchText) {
        var remoteConfig, value, fetchFunc, _remoteConfig$process, processFunc, responseData, options;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                remoteConfig = _this.props.remoteConfig;
                value = searchText.trim().replace(/'/g, '');

                if (value) {
                  _context.next = 5;
                  break;
                }

                _this.setState({
                  options: []
                });

                return _context.abrupt("return");

              case 5:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process = remoteConfig.process, processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process;
                _context.next = 8;
                return fetchFunc(value);

              case 8:
                responseData = _context.sent;
                options = convertDataToEnum(processFunc(responseData) || responseData, pick(remoteConfig, ['path', 'valueKey', 'labelKey']));

                _this.setState({
                  options: options
                });

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _this.state = {
      options: cloneDeep(props.options)
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var props, remoteConfig, showSearch, fetchFunc, _remoteConfig$process2, processFunc, responseData, options;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                props = this.props;
                remoteConfig = props.remoteConfig, showSearch = props.showSearch;

                if (isObject(remoteConfig)) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                if (!showSearch) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return");

              case 6:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process2 = remoteConfig.process, processFunc = _remoteConfig$process2 === void 0 ? noop : _remoteConfig$process2;
                _context2.next = 9;
                return fetchFunc();

              case 9:
                responseData = _context2.sent;
                options = convertDataToEnum(processFunc(responseData) || responseData, pick(remoteConfig, ['path', 'valueKey', 'labelKey']));
                this.setState({
                  options: options
                });

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var props = this.props,
          state = this.state;
      var value = props.value,
          _onChange = props.onChange,
          allItem = props.allItem,
          showSearch = props.showSearch;
      var options = state.options;
      var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'options', 'allItem', 'remoteConfig']);

      if (showSearch) {
        componentProps.onSearch = debounce(this.handleSearch, 200);
      }

      return /*#__PURE__*/React.createElement(Select, _extends({}, componentProps, {
        value: value,
        onChange: function onChange(val) {
          _onChange(val);

          if (props.onCustomChange) {
            props.onCustomChange();
          }
        }
      }), [allItem].concat(_toConsumableArray(options)).filter(Boolean).map(function (v) {
        var optionProps = pick(v, ['className', 'disabled', 'title', 'value']);
        return /*#__PURE__*/React.createElement(Select.Option, _extends({
          key: v.value
        }, optionProps), v.label);
      }));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$7, "displayName", getDisplayName('Select'));

_defineProperty(Index$7, "defaultProps", {
  options: []
});

_defineProperty(Index$7, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  allItem: PropTypes.object,
  remoteConfig: PropTypes.object
});

var Index$6 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onCheckAllChange", function (e) {
      var options = cloneDeep(_this.state.options);
      var checked = e.target.checked;
      var checkedList = checked ? map(options, 'value') : [];

      _this.setState({
        checkAll: checked,
        checkedList: checkedList,
        indeterminate: false
      });

      _this.props.onChange(checkedList);
    });

    _defineProperty(_assertThisInitialized(_this), "setCheckAll", function () {
      var value = _this.props.value;
      var options = _this.state.options;

      _this.setState({
        indeterminate: value.length && options.length !== value.length,
        checkAll: options.length === value.length
      });
    });

    var _value = cloneDeep(props.value);

    var _options = cloneDeep(props.options);

    _this.state = {
      options: _options,
      checkedList: _value,
      indeterminate: false,
      checkAll: false
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var props, defaultSelectAll, remoteConfig, fetchFunc, _remoteConfig$process, processFunc, responseData, options;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                props = this.props;
                defaultSelectAll = props.defaultSelectAll, remoteConfig = props.remoteConfig;

                if (isObject(remoteConfig)) {
                  _context.next = 5;
                  break;
                }

                this.setCheckAll();
                return _context.abrupt("return");

              case 5:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process = remoteConfig.process, processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process;
                _context.next = 8;
                return fetchFunc();

              case 8:
                responseData = _context.sent;
                options = convertDataToEnum(processFunc(responseData) || responseData, pick(remoteConfig, ['path', 'valueKey', 'labelKey']));

                if (defaultSelectAll) {
                  this.setState({
                    options: options,
                    checkAll: true
                  }, function () {
                    var checkedList = map(options, 'value');

                    _this2.props.onChange(checkedList);
                  });
                } else {
                  this.setState({
                    options: options
                  }, function () {
                    _this2.setCheckAll();
                  });
                }

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var props = this.props,
          state = this.state;
      var value = props.value,
          _onChange = props.onChange;
      var options = state.options,
          indeterminate = state.indeterminate,
          checkAll = state.checkAll;
      var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'options', 'onCustomChange', 'remoteConfig', 'indeterminate', 'defaultSelectAll']);
      return /*#__PURE__*/React.createElement(Fragment, null, !!props.indeterminate && !isEmptyArray(options) && /*#__PURE__*/React.createElement(Checkbox, {
        indeterminate: indeterminate,
        onChange: this.onCheckAllChange,
        checked: checkAll
      }, "\u5168\u9009"), /*#__PURE__*/React.createElement(Checkbox.Group, _extends({}, componentProps, {
        options: options,
        value: value,
        onChange: function onChange(val) {
          _onChange(val);

          _this3.setState({
            indeterminate: val.length && options.length !== val.length,
            checkAll: options.length === val.length
          });

          if (props.onCustomChange) {
            props.onCustomChange();
          }
        }
      })));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$6, "displayName", getDisplayName('Checkbox'));

_defineProperty(Index$6, "defaultProps", {
  // 是否展示全部
  indeterminate: false,
  defaultSelectAll: false // 默认选择全部

});

_defineProperty(Index$6, "propTypes", {
  indeterminate: PropTypes.bool,
  defaultSelectAll: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object
});

var TabPane = Tabs.TabPane;

var Index$5 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);
    _this.state = {};
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = this.props;
      var _onChange = props.onChange,
          options = props.options;
      var shouldBeNumber = isNumber(last(options).value);
      var innerValue = String(props.value);
      var componentProps = omit(props, ['column', 'defaultValue', 'value', 'onChange', 'onCustomChange', 'style']);
      return /*#__PURE__*/React.createElement(Tabs, _extends({
        animated: false
      }, componentProps, {
        activeKey: innerValue,
        defaultActiveKey: innerValue,
        onChange: function onChange(activeKey) {
          _onChange(shouldBeNumber ? Number(activeKey) : activeKey);

          if (_this2.props.onCustomChange) {
            _this2.props.onCustomChange();
          }
        }
      }), options.map(function (v) {
        var value = v.value,
            label = v.label;
        return /*#__PURE__*/React.createElement(TabPane, {
          tab: label,
          key: value
        });
      }));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$5, "displayName", getDisplayName('Tabs'));

_defineProperty(Index$5, "defaultProps", {});

_defineProperty(Index$5, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  column: PropTypes.object
});

var Index$4 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);
    _this.state = {
      options: cloneDeep(props.options)
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var props, remoteConfig, fetchFunc, _remoteConfig$process, processFunc, responseData, options;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                props = this.props;
                remoteConfig = props.remoteConfig;

                if (isObject(remoteConfig)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process = remoteConfig.process, processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process;
                _context.next = 7;
                return fetchFunc();

              case 7:
                responseData = _context.sent;
                options = convertDataToEnum(processFunc(responseData) || responseData, remoteConfig);
                this.setState({
                  options: options
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = this.props,
          state = this.state;
      var value = props.value,
          _onChange = props.onChange,
          loadData = props.loadData;
      var options = state.options;
      var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'options', 'remoteConfig', 'loadData']);

      if (loadData) {
        componentProps.loadData = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(selectedOptions) {
            var remoteConfig, targetOption, fetchFunc, _remoteConfig$process2, processFunc, responseData, options;

            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    remoteConfig = props.loadData;
                    targetOption = last(selectedOptions);
                    targetOption.loading = true;
                    fetchFunc = remoteConfig.fetch, _remoteConfig$process2 = remoteConfig.process, processFunc = _remoteConfig$process2 === void 0 ? noop : _remoteConfig$process2;
                    _context2.next = 6;
                    return fetchFunc(selectedOptions, targetOption);

                  case 6:
                    responseData = _context2.sent;
                    targetOption.loading = false;
                    options = convertDataToEnum(processFunc(responseData) || responseData, remoteConfig);
                    targetOption.children = options;

                    _this2.setState({
                      options: _toConsumableArray(_this2.state.options)
                    });

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }();
      }

      return /*#__PURE__*/React.createElement(Cascader, _extends({}, componentProps, {
        value: value,
        options: options,
        onChange: function onChange(val) {
          _onChange(val);

          if (props.onCustomChange) {
            props.onCustomChange();
          }
        }
      }));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$4, "displayName", getDisplayName('Cascader'));

_defineProperty(Index$4, "defaultProps", {
  options: []
});

_defineProperty(Index$4, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  loadData: PropTypes.object,
  remoteConfig: PropTypes.object
});

var Index$3 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);
    _this.state = {
      treeData: cloneDeep(props.treeData)
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var props, remoteConfig, fetchFunc, _remoteConfig$process, processFunc, responseData, treeData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                props = this.props;
                remoteConfig = props.remoteConfig;

                if (isObject(remoteConfig)) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt("return");

              case 4:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process = remoteConfig.process, processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process;
                _context.next = 7;
                return fetchFunc();

              case 7:
                responseData = _context.sent;
                treeData = processFunc(responseData) || responseData;
                this.setState({
                  treeData: treeData
                });

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var props = this.props,
          state = this.state;
      var value = props.value,
          _onChange = props.onChange;
      var treeData = state.treeData;
      var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'treeData', 'remoteConfig']);
      return /*#__PURE__*/React.createElement(TreeSelect, _extends({}, componentProps, {
        value: value,
        treeData: treeData,
        onChange: function onChange(val) {
          _onChange(val);

          if (props.onCustomChange) {
            props.onCustomChange();
          }
        }
      }));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$3, "displayName", getDisplayName('TreeSelect'));

_defineProperty(Index$3, "defaultProps", {});

_defineProperty(Index$3, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object
});

var Index$2 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index(_props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "onSearch", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(searchText) {
        var _assertThisInitialize, props, remoteConfig, query, fetchFunc, _remoteConfig$process, processFunc, responseData, options;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _assertThisInitialize = _assertThisInitialized(_this), props = _assertThisInitialize.props;
                remoteConfig = props.remoteConfig;
                query = searchText.trim();

                if (query) {
                  _context.next = 6;
                  break;
                }

                _this.setState({
                  options: []
                });

                return _context.abrupt("return");

              case 6:
                fetchFunc = remoteConfig.fetch, _remoteConfig$process = remoteConfig.process, processFunc = _remoteConfig$process === void 0 ? noop : _remoteConfig$process;
                _context.next = 9;
                return fetchFunc(query);

              case 9:
                responseData = _context.sent;
                options = convertDataToEnum(processFunc(responseData) || responseData, pick(remoteConfig, ['path', 'valueKey', 'labelKey']));

                _this.setState({
                  options: options
                });

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _this.state = {
      inputValue: _props.value || '',
      options: _props.options || []
    };
    _this.formRef = /*#__PURE__*/React.createRef();
    _this.onDebounceSearch = debounce(_this.onSearch, _props.debounce);
    return _this;
  }

  _createClass(Index, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var props = this.props,
          state = this.state;
      var onChange = props.onChange;
      var inputValue = state.inputValue,
          options = state.options;
      var componentProps = omit(props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'options', 'remoteConfig']);

      if (isAntdV3) {
        componentProps.dataSource = options.map(function (v) {
          return {
            value: v.value,
            text: v.label
          };
        });
      } else {
        componentProps.options = options;
      }

      return /*#__PURE__*/React.createElement(AutoComplete, _extends({}, componentProps, {
        ref: this.formRef,
        value: inputValue,
        onChange: function onChange(text) {
          _this2.setState({
            inputValue: String(text).trim()
          });
        },
        onSearch: this.onDebounceSearch,
        onSelect: function onSelect(val) {
          onChange(val);

          if (props.onCustomChange) {
            props.onCustomChange();
          }

          _this2.formRef.current.blur();
        }
      }));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$2, "displayName", getDisplayName('AutoComplete'));

_defineProperty(Index$2, "defaultProps", {
  debounce: 200
});

_defineProperty(Index$2, "propTypes", {
  value: PropTypes.any,
  onChange: PropTypes.func,
  remoteConfig: PropTypes.object.isRequired,
  debounce: PropTypes.number
});

var Index$1 = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index() {
    var _this;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onChange", function (checked, event) {
      if (!isFunction(_this.props.onChange)) {
        return;
      }

      _this.props.onChange(checked, event);

      if (_this.props.onCustomChange) {
        _this.props.onCustomChange();
      }
    });

    return _this;
  }

  _createClass(Index, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          defaultValue = _this$props.defaultValue,
          value = _this$props.value,
          style = _this$props.style;
      var onChange = this.onChange;
      var componentProps = omit(this.props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'style']);
      return /*#__PURE__*/React.createElement("div", {
        style: style
      }, /*#__PURE__*/React.createElement(Switch, _extends({
        checked: value,
        defaultChecked: defaultValue,
        onChange: onChange
      }, componentProps)));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index$1, "displayName", 'DynamicFormSwitch');

_defineProperty(Index$1, "defaultProps", {});

_defineProperty(Index$1, "propTypes", {
  value: PropTypes.bool,
  onChange: PropTypes.func
});

var Index = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  function Index() {
    var _this;

    _classCallCheck(this, Index);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onChange", function (value) {
      _this.props.onChange(value);
    });

    _defineProperty(_assertThisInitialized(_this), "onAfterChange", function (value) {
      _this.props.onChange(value);

      if (_this.props.onCustomChange) {
        _this.props.onCustomChange();
      }
    });

    return _this;
  }

  _createClass(Index, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          value = _this$props.value,
          style = _this$props.style,
          InputNumberWidth = _this$props.InputNumberWidth;
      var onChange = this.onChange,
          onAfterChange = this.onAfterChange;
      var componentProps = omit(this.props, ['defaultValue', 'value', 'onChange', 'onCustomChange', 'style', 'InputNumberWidth']);
      return /*#__PURE__*/React.createElement("div", {
        style: _objectSpread2({
          display: 'flex',
          justifyContent: 'space-between'
        }, style)
      }, /*#__PURE__*/React.createElement(Slider, _extends({
        style: {
          width: style.width - InputNumberWidth - 15
        },
        value: value,
        onChange: onChange,
        onAfterChange: onAfterChange
      }, componentProps)), /*#__PURE__*/React.createElement(InputNumber, _extends({
        style: {
          width: InputNumberWidth
        },
        value: value,
        onChange: onAfterChange
      }, componentProps)));
    }
  }]);

  return Index;
}(Component);

_defineProperty(Index, "displayName", 'DynamicFormSlider');

_defineProperty(Index, "defaultProps", {
  InputNumberWidth: 65
});

_defineProperty(Index, "propTypes", {
  value: PropTypes.number,
  onChange: PropTypes.func,
  InputNumberWidth: PropTypes.number
});

export { Index$2 as AutoComplete, Index$4 as Cascader, Index$6 as Checkbox, Index$9 as Input, Index$8 as RangeNumber, Index$7 as Select, Index as Slider, Index$1 as Switch, Index$5 as Tabs, Index$3 as TreeSelect };
