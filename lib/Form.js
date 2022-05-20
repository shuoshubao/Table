import * as React from 'react';
import React__default, { useMemo, useRef, useContext } from 'react';
import { classNames } from '@nbfe/tools';
import FieldForm, { FormProvider as FormProvider$1, useForm as useForm$1, Field, List } from 'rc-field-form';
import { omit } from 'lodash';
import scrollIntoView from 'scroll-into-view-if-needed';
import { Col, Tooltip, Row } from 'antd';
import FieldContext from 'rc-field-form/lib/FieldContext';
import { composeRef, supportRef } from 'rc-util/lib/ref';
import CSSMotion, { CSSMotionList } from 'rc-motion';
import devWarning$1 from 'rc-util/lib/warning';
import raf from 'rc-util/lib/raf';

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

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var FormContext = /*#__PURE__*/React.createContext({
  labelAlign: 'right',
  vertical: false,
  itemRef: function itemRef() {}
});
/** `noStyle` Form Item Context. Used for error collection */

var NoStyleItemContext = /*#__PURE__*/React.createContext(null);
var FormProvider = function FormProvider(props) {
  var providerProps = omit(props, ['prefixCls']);
  return /*#__PURE__*/React.createElement(FormProvider$1, providerProps);
};
var FormItemPrefixContext = /*#__PURE__*/React.createContext({
  prefixCls: ''
});

function toArray(candidate) {
  if (candidate === undefined || candidate === false) return [];
  return Array.isArray(candidate) ? candidate : [candidate];
}
function getFieldId(namePath, formName) {
  if (!namePath.length) return undefined;
  var mergedId = namePath.join('_');
  return formName ? "".concat(formName, "_").concat(mergedId) : mergedId;
}

function toNamePathStr(name) {
  var namePath = toArray(name);
  return namePath.join('_');
}

function useForm(form) {
  var _useRcForm = useForm$1(),
      _useRcForm2 = _slicedToArray(_useRcForm, 1),
      rcForm = _useRcForm2[0];

  var itemsRef = React.useRef({});
  var wrapForm = React.useMemo(function () {
    return form !== null && form !== void 0 ? form : _objectSpread2(_objectSpread2({}, rcForm), {}, {
      __INTERNAL__: {
        itemRef: function itemRef(name) {
          return function (node) {
            var namePathStr = toNamePathStr(name);

            if (node) {
              itemsRef.current[namePathStr] = node;
            } else {
              delete itemsRef.current[namePathStr];
            }
          };
        }
      },
      scrollToField: function scrollToField(name) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var namePath = toArray(name);
        var fieldId = getFieldId(namePath, wrapForm.__INTERNAL__.name);
        var node = fieldId ? document.getElementById(fieldId) : null;

        if (node) {
          scrollIntoView(node, _objectSpread2({
            scrollMode: 'if-needed',
            block: 'nearest'
          }, options));
        }
      },
      getFieldInstance: function getFieldInstance(name) {
        var namePathStr = toNamePathStr(name);
        return itemsRef.current[namePathStr];
      }
    });
  }, [form, rcForm]);
  return [wrapForm];
}

var _excluded$3 = ["prefixCls", "className", "size", "form", "colon", "labelAlign", "labelCol", "wrapperCol", "hideRequiredMark", "layout", "scrollToFirstError", "requiredMark", "onFinishFailed", "name"];

var InternalForm = function InternalForm(props, ref) {
  var _classNames;

  var contextForm = null;

  props.prefixCls;
      var _props$className = props.className,
      className = _props$className === void 0 ? '' : _props$className,
      size = props.size,
      form = props.form,
      colon = props.colon,
      labelAlign = props.labelAlign,
      labelCol = props.labelCol,
      wrapperCol = props.wrapperCol,
      hideRequiredMark = props.hideRequiredMark,
      _props$layout = props.layout,
      layout = _props$layout === void 0 ? 'horizontal' : _props$layout,
      scrollToFirstError = props.scrollToFirstError,
      requiredMark = props.requiredMark,
      onFinishFailed = props.onFinishFailed,
      name = props.name,
      restFormProps = _objectWithoutProperties(props, _excluded$3);

  var mergedRequiredMark = useMemo(function () {
    if (requiredMark !== undefined) {
      return requiredMark;
    }

    if (hideRequiredMark) {
      return false;
    }

    return true;
  }, [hideRequiredMark, requiredMark, contextForm]);
  var prefixCls = 'ant-form';
  var formClassName = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(layout), true), _defineProperty(_classNames, "".concat(prefixCls, "-hide-required-mark"), mergedRequiredMark === false), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), size), _classNames), className);

  var _useForm = useForm(form),
      _useForm2 = _slicedToArray(_useForm, 1),
      wrapForm = _useForm2[0];

  var __INTERNAL__ = wrapForm.__INTERNAL__;
  __INTERNAL__.name = name;
  var formContextValue = useMemo(function () {
    return {
      name: name,
      labelAlign: labelAlign,
      labelCol: labelCol,
      wrapperCol: wrapperCol,
      vertical: layout === 'vertical',
      colon: colon,
      requiredMark: mergedRequiredMark,
      itemRef: __INTERNAL__.itemRef
    };
  }, [name, labelAlign, labelCol, wrapperCol, layout, colon, mergedRequiredMark]);
  React.useImperativeHandle(ref, function () {
    return wrapForm;
  });

  var onInternalFinishFailed = function onInternalFinishFailed(errorInfo) {
    onFinishFailed === null || onFinishFailed === void 0 ? void 0 : onFinishFailed(errorInfo);
    var defaultScrollToFirstError = {
      block: 'nearest'
    };

    if (scrollToFirstError && errorInfo.errorFields.length) {
      if (_typeof(scrollToFirstError) === 'object') {
        defaultScrollToFirstError = scrollToFirstError;
      }

      wrapForm.scrollToField(errorInfo.errorFields[0].name, defaultScrollToFirstError);
    }
  };

  return /*#__PURE__*/React.createElement(FormContext.Provider, {
    value: formContextValue
  }, /*#__PURE__*/React.createElement(FieldForm, _extends({
    id: name
  }, restFormProps, {
    name: name,
    onFinishFailed: onInternalFinishFailed,
    form: wrapForm,
    className: formClassName
  })));
};

var Form$1 = /*#__PURE__*/React.forwardRef(InternalForm);

var defaultSvgProps = {
  viewBox: '64 64 896 896',
  focusable: 'false',
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'currentColor',
  width: '1em',
  height: '1em'
};

var getSvgProps = function getSvgProps(props) {
  return _objectSpread2(_objectSpread2({}, defaultSvgProps), omit(props, 'className'));
};

var QuestionCircleOutlined = function QuestionCircleOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React__default.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React__default.createElement("svg", _extends({
    viewBox: "64 64 896 896",
    focusable: "false",
    xmlns: "http://www.w3.org/2000/svg"
  }, svgProps), /*#__PURE__*/React__default.createElement("path", {
    d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"
  })));
};
var CloseCircleFilled = function CloseCircleFilled(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React__default.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React__default.createElement("svg", svgProps, /*#__PURE__*/React__default.createElement("path", {
    d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
  })));
};
var LoadingOutlined = function LoadingOutlined(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React__default.createElement("span", {
    className: classNames('anticon', 'anticon-spin', props.className)
  }, /*#__PURE__*/React__default.createElement("svg", svgProps, /*#__PURE__*/React__default.createElement("path", {
    d: "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"
  })));
};
var CheckCircleFilled = function CheckCircleFilled(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React__default.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React__default.createElement("svg", svgProps, /*#__PURE__*/React__default.createElement("path", {
    d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"
  })));
};
var ExclamationCircleFilled = function ExclamationCircleFilled(props) {
  var svgProps = getSvgProps(props);
  return /*#__PURE__*/React__default.createElement("span", {
    className: classNames('anticon', props.className)
  }, /*#__PURE__*/React__default.createElement("svg", svgProps, /*#__PURE__*/React__default.createElement("path", {
    d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z"
  })));
};

var _excluded$2 = ["icon"];

function toTooltipProps(tooltip) {
  if (!tooltip) {
    return null;
  }

  if (_typeof(tooltip) === 'object' && ! /*#__PURE__*/React.isValidElement(tooltip)) {
    return tooltip;
  }

  return {
    title: tooltip
  };
}

var FormItemLabel = function FormItemLabel(_ref) {
  var prefixCls = _ref.prefixCls,
      label = _ref.label,
      htmlFor = _ref.htmlFor,
      labelCol = _ref.labelCol,
      labelAlign = _ref.labelAlign,
      colon = _ref.colon,
      required = _ref.required,
      requiredMark = _ref.requiredMark,
      tooltip = _ref.tooltip;
  if (!label) return null;
  return /*#__PURE__*/React.createElement(FormContext.Consumer, {
    key: "label"
  }, function (_ref2) {
    var _classNames;

    var vertical = _ref2.vertical,
        contextLabelAlign = _ref2.labelAlign,
        contextLabelCol = _ref2.labelCol,
        contextColon = _ref2.colon;
    var mergedLabelCol = labelCol || contextLabelCol || {};
    var mergedLabelAlign = labelAlign || contextLabelAlign;
    var labelClsBasic = "".concat(prefixCls, "-item-label");
    var labelColClassName = classNames(labelClsBasic, mergedLabelAlign === 'left' && "".concat(labelClsBasic, "-left"), mergedLabelCol.className);
    var labelChildren = label; // Keep label is original where there should have no colon

    var computedColon = colon === true || contextColon !== false && colon !== false;
    var haveColon = computedColon && !vertical; // Remove duplicated user input colon

    if (haveColon && typeof label === 'string' && label.trim() !== '') {
      labelChildren = label.replace(/[:|：]\s*$/, '');
    } // Tooltip


    var tooltipProps = toTooltipProps(tooltip);

    if (tooltipProps) {
      var _tooltipProps$icon = tooltipProps.icon,
          icon = _tooltipProps$icon === void 0 ? /*#__PURE__*/React.createElement(QuestionCircleOutlined, null) : _tooltipProps$icon,
          restTooltipProps = _objectWithoutProperties(tooltipProps, _excluded$2);

      var tooltipNode = /*#__PURE__*/React.createElement(Tooltip, restTooltipProps, /*#__PURE__*/React.cloneElement(icon, {
        className: "".concat(prefixCls, "-item-tooltip"),
        title: ''
      }));
      labelChildren = /*#__PURE__*/React.createElement(React.Fragment, null, labelChildren, tooltipNode);
    }

    var labelClassName = classNames((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-item-required"), required), _defineProperty(_classNames, "".concat(prefixCls, "-item-required-mark-optional"), requiredMark === 'optional'), _defineProperty(_classNames, "".concat(prefixCls, "-item-no-colon"), !computedColon), _classNames));
    return /*#__PURE__*/React.createElement(Col, _extends({}, mergedLabelCol, {
      className: labelColClassName
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: htmlFor,
      className: labelClassName,
      title: typeof label === 'string' ? label : ''
    }, labelChildren));
  });
};

// ================== Collapse Motion ==================
var getCollapsedHeight = function getCollapsedHeight() {
  return {
    height: 0,
    opacity: 0
  };
};

var getRealHeight = function getRealHeight(node) {
  var scrollHeight = node.scrollHeight;
  return {
    height: scrollHeight,
    opacity: 1
  };
};

var getCurrentHeight = function getCurrentHeight(node) {
  return {
    height: node ? node.offsetHeight : 0
  };
};

var skipOpacityTransition = function skipOpacityTransition(_, event) {
  return (event === null || event === void 0 ? void 0 : event.deadline) === true || event.propertyName === 'height';
};

var collapseMotion = {
  motionName: 'ant-motion-collapse',
  onAppearStart: getCollapsedHeight,
  onEnterStart: getCollapsedHeight,
  onAppearActive: getRealHeight,
  onEnterActive: getRealHeight,
  onLeaveStart: getCurrentHeight,
  onLeaveActive: getCollapsedHeight,
  onAppearEnd: skipOpacityTransition,
  onEnterEnd: skipOpacityTransition,
  onLeaveEnd: skipOpacityTransition,
  motionDeadline: 500
};

var EMPTY_LIST = [];

function toErrorEntity(error, errorStatus, prefix) {
  var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return {
    key: typeof error === 'string' ? error : "".concat(prefix, "-").concat(index),
    error: error,
    errorStatus: errorStatus
  };
}

function ErrorList(_ref) {
  var help = _ref.help,
      helpStatus = _ref.helpStatus,
      _ref$errors = _ref.errors,
      errors = _ref$errors === void 0 ? EMPTY_LIST : _ref$errors,
      _ref$warnings = _ref.warnings,
      warnings = _ref$warnings === void 0 ? EMPTY_LIST : _ref$warnings,
      rootClassName = _ref.className;
  var baseClassName = 'ant-form';
  var rootPrefixCls = 'ant';
  var fullKeyList = React.useMemo(function () {
    if (help !== undefined && help !== null) {
      return [toErrorEntity(help, helpStatus, 'help')];
    }

    return [].concat(_toConsumableArray(errors.map(function (error, index) {
      return toErrorEntity(error, 'error', 'error', index);
    })), _toConsumableArray(warnings.map(function (warning, index) {
      return toErrorEntity(warning, 'warning', 'warning', index);
    })));
  }, [help, helpStatus, errors, warnings]);
  return /*#__PURE__*/React.createElement(CSSMotion, _extends({}, collapseMotion, {
    motionName: "".concat(rootPrefixCls, "-show-help"),
    motionAppear: false,
    motionEnter: false,
    visible: !!fullKeyList.length,
    onLeaveStart: function onLeaveStart(node) {
      // Force disable css override style in index.less configured
      node.style.height = 'auto';
      return {
        height: node.offsetHeight
      };
    }
  }), function (holderProps) {
    var holderClassName = holderProps.className,
        holderStyle = holderProps.style;
    return /*#__PURE__*/React.createElement("div", {
      className: classNames(baseClassName, holderClassName, rootClassName),
      style: holderStyle
    }, /*#__PURE__*/React.createElement(CSSMotionList, _extends({
      keys: fullKeyList
    }, collapseMotion, {
      motionName: "".concat(rootPrefixCls, "-show-help-item"),
      component: false
    }), function (itemProps) {
      var key = itemProps.key,
          error = itemProps.error,
          errorStatus = itemProps.errorStatus,
          itemClassName = itemProps.className,
          itemStyle = itemProps.style;
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        role: "alert",
        className: classNames(itemClassName, _defineProperty({}, "".concat(baseClassName, "-").concat(errorStatus), errorStatus)),
        style: itemStyle
      }, error);
    }));
  });
}

var iconMap = {
  success: CheckCircleFilled,
  warning: ExclamationCircleFilled,
  error: CloseCircleFilled,
  validating: LoadingOutlined
};

var FormItemInput = function FormItemInput(props) {
  var prefixCls = props.prefixCls,
      status = props.status,
      wrapperCol = props.wrapperCol,
      children = props.children,
      errors = props.errors,
      warnings = props.warnings,
      hasFeedback = props.hasFeedback,
      formItemRender = props._internalItemRender,
      validateStatus = props.validateStatus,
      extra = props.extra,
      help = props.help;
  var baseClassName = "".concat(prefixCls, "-item");
  var formContext = React.useContext(FormContext);
  var mergedWrapperCol = wrapperCol || formContext.wrapperCol || {};
  var className = classNames("".concat(baseClassName, "-control"), mergedWrapperCol.className); // Should provides additional icon if `hasFeedback`

  var IconNode = validateStatus && iconMap[validateStatus];
  var icon = hasFeedback && IconNode ? /*#__PURE__*/React.createElement("span", {
    className: "".concat(baseClassName, "-children-icon")
  }, /*#__PURE__*/React.createElement(IconNode, null)) : null; // Pass to sub FormItem should not with col info

  var subFormContext = React.useMemo(function () {
    return _objectSpread2({}, formContext);
  }, [formContext]);
  delete subFormContext.labelCol;
  delete subFormContext.wrapperCol;
  var inputDom = /*#__PURE__*/React.createElement("div", {
    className: "".concat(baseClassName, "-control-input")
  }, /*#__PURE__*/React.createElement("div", {
    className: "".concat(baseClassName, "-control-input-content")
  }, children), icon);
  var formItemContext = React.useMemo(function () {
    return {
      prefixCls: prefixCls,
      status: status
    };
  }, [prefixCls, status]);
  var errorListDom = /*#__PURE__*/React.createElement(FormItemPrefixContext.Provider, {
    value: formItemContext
  }, /*#__PURE__*/React.createElement(ErrorList, {
    errors: errors,
    warnings: warnings,
    help: help,
    helpStatus: status,
    className: "".concat(baseClassName, "-explain-connected")
  })); // If extra = 0, && will goes wrong
  // 0&&error -> 0

  var extraDom = extra ? /*#__PURE__*/React.createElement("div", {
    className: "".concat(baseClassName, "-extra")
  }, extra) : null;
  var dom = formItemRender && formItemRender.mark === 'pro_table_render' && formItemRender.render ? formItemRender.render(props, {
    input: inputDom,
    errorList: errorListDom,
    extra: extraDom
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, inputDom, errorListDom, extraDom);
  return /*#__PURE__*/React.createElement(FormContext.Provider, {
    value: subFormContext
  }, /*#__PURE__*/React.createElement(Col, _extends({}, mergedWrapperCol, {
    className: className
  }), dom));
};

var devWarning = (function (valid, component, message) {
  devWarning$1(valid, "[antd: ".concat(component, "] ").concat(message));
});

var isValidElement = React.isValidElement;
function replaceElement(element, replacement, props) {
  if (!isValidElement(element)) return replacement;
  return /*#__PURE__*/React.cloneElement(element, typeof props === 'function' ? props(element.props || {}) : props);
}
function cloneElement(element, props) {
  return replaceElement(element, element, props);
}

function useFrameState(defaultValue) {
  var _React$useState = React.useState(defaultValue),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      value = _React$useState2[0],
      setValue = _React$useState2[1];

  var frameRef = useRef(null);
  var batchRef = useRef([]);
  var destroyRef = useRef(false);
  React.useEffect(function () {
    return function () {
      destroyRef.current = true;
      raf.cancel(frameRef.current);
    };
  }, []);

  function setFrameValue(updater) {
    if (destroyRef.current) {
      return;
    }

    if (frameRef.current === null) {
      batchRef.current = [];
      frameRef.current = raf(function () {
        frameRef.current = null;
        setValue(function (prevValue) {
          var current = prevValue;
          batchRef.current.forEach(function (func) {
            current = func(current);
          });
          return current;
        });
      });
    }

    batchRef.current.push(updater);
  }

  return [value, setFrameValue];
}

function useDebounce(value) {
  var _React$useState = React.useState(value),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      cacheValue = _React$useState2[0],
      setCacheValue = _React$useState2[1];

  React.useEffect(function () {
    var timeout = setTimeout(function () {
      setCacheValue(value);
    }, value.length ? 0 : 10);
    return function () {
      clearTimeout(timeout);
    };
  }, [value]);
  return cacheValue;
}

function useItemRef() {
  var _React$useContext = React.useContext(FormContext),
      itemRef = _React$useContext.itemRef;

  var cacheRef = React.useRef({});

  function getRef(name, children) {
    var childrenRef = children && _typeof(children) === 'object' && children.ref;
    var nameStr = name.join('_');

    if (cacheRef.current.name !== nameStr || cacheRef.current.originRef !== childrenRef) {
      cacheRef.current.name = nameStr;
      cacheRef.current.originRef = childrenRef;
      cacheRef.current.ref = composeRef(itemRef(name), childrenRef);
    }

    return cacheRef.current.ref;
  }

  return getRef;
}

var _excluded$1 = ["name", "fieldKey", "noStyle", "dependencies", "prefixCls", "style", "className", "shouldUpdate", "hasFeedback", "help", "rules", "validateStatus", "children", "required", "label", "messageVariables", "trigger", "validateTrigger", "hidden"];
var NAME_SPLIT = '__SPLIT__';
var MemoInput = /*#__PURE__*/React.memo(function (_ref) {
  var children = _ref.children;
  return children;
}, function (prev, next) {
  return prev.value === next.value && prev.update === next.update;
});

function hasValidName(name) {
  if (name === null) {
    devWarning(false, 'Form.Item', '`null` is passed as `name` property');
  }

  return !(name === undefined || name === null);
}

function genEmptyMeta() {
  return {
    errors: [],
    warnings: [],
    touched: false,
    validating: false,
    name: []
  };
}

function FormItem(props) {
  var name = props.name,
      fieldKey = props.fieldKey,
      noStyle = props.noStyle,
      dependencies = props.dependencies;
      props.prefixCls;
      var style = props.style,
      className = props.className,
      shouldUpdate = props.shouldUpdate,
      hasFeedback = props.hasFeedback,
      help = props.help,
      rules = props.rules,
      validateStatus = props.validateStatus,
      children = props.children,
      required = props.required,
      label = props.label,
      messageVariables = props.messageVariables,
      _props$trigger = props.trigger,
      trigger = _props$trigger === void 0 ? 'onChange' : _props$trigger,
      validateTrigger = props.validateTrigger,
      hidden = props.hidden,
      restProps = _objectWithoutProperties(props, _excluded$1);

  var _useContext = useContext(FormContext),
      formName = _useContext.name,
      requiredMark = _useContext.requiredMark;

  var isRenderProps = typeof children === 'function';
  var notifyParentMetaChange = useContext(NoStyleItemContext);

  var _useContext2 = useContext(FieldContext),
      contextValidateTrigger = _useContext2.validateTrigger;

  var mergedValidateTrigger = validateTrigger !== undefined ? validateTrigger : contextValidateTrigger;
  var hasName = hasValidName(name);
  var prefixCls = 'ant-form'; // ======================== Errors ========================
  // >>>>> Collect sub field errors

  var _useFrameState = useFrameState({}),
      _useFrameState2 = _slicedToArray(_useFrameState, 2),
      subFieldErrors = _useFrameState2[0],
      setSubFieldErrors = _useFrameState2[1]; // >>>>> Current field errors


  var _React$useState = React.useState(function () {
    return genEmptyMeta();
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      meta = _React$useState2[0],
      setMeta = _React$useState2[1];

  var onMetaChange = function onMetaChange(nextMeta) {
    // Destroy will reset all the meta
    setMeta(nextMeta.destroy ? genEmptyMeta() : nextMeta); // Bump to parent since noStyle

    if (noStyle && notifyParentMetaChange) {
      var namePath = nextMeta.name;

      if (fieldKey !== undefined) {
        namePath = Array.isArray(fieldKey) ? fieldKey : [fieldKey];
      }

      notifyParentMetaChange(nextMeta, namePath);
    }
  }; // >>>>> Collect noStyle Field error to the top FormItem


  var onSubItemMetaChange = function onSubItemMetaChange(subMeta, uniqueKeys) {
    // Only `noStyle` sub item will trigger
    setSubFieldErrors(function (prevSubFieldErrors) {
      var clone = _objectSpread2({}, prevSubFieldErrors); // name: ['user', 1] + key: [4] = ['user', 4]


      var mergedNamePath = [].concat(_toConsumableArray(subMeta.name.slice(0, -1)), _toConsumableArray(uniqueKeys));
      var mergedNameKey = mergedNamePath.join(NAME_SPLIT);

      if (subMeta.destroy) {
        // Remove
        delete clone[mergedNameKey];
      } else {
        // Update
        clone[mergedNameKey] = subMeta;
      }

      return clone;
    });
  }; // >>>>> Get merged errors


  var _React$useMemo = React.useMemo(function () {
    var errorList = _toConsumableArray(meta.errors);

    var warningList = _toConsumableArray(meta.warnings);

    Object.values(subFieldErrors).forEach(function (subFieldError) {
      errorList.push.apply(errorList, _toConsumableArray(subFieldError.errors || []));
      warningList.push.apply(warningList, _toConsumableArray(subFieldError.warnings || []));
    });
    return [errorList, warningList];
  }, [subFieldErrors, meta.errors, meta.warnings]),
      _React$useMemo2 = _slicedToArray(_React$useMemo, 2),
      mergedErrors = _React$useMemo2[0],
      mergedWarnings = _React$useMemo2[1];

  var debounceErrors = useDebounce(mergedErrors);
  var debounceWarnings = useDebounce(mergedWarnings); // ===================== Children Ref =====================

  var getItemRef = useItemRef(); // ======================== Render ========================

  function renderLayout(baseChildren, fieldId, isRequired) {
    var _itemClassName;

    if (noStyle && !hidden) {
      return baseChildren;
    } // ======================== Status ========================


    var mergedValidateStatus = '';

    if (validateStatus !== undefined) {
      mergedValidateStatus = validateStatus;
    } else if (meta !== null && meta !== void 0 && meta.validating) {
      mergedValidateStatus = 'validating';
    } else if (debounceErrors.length) {
      mergedValidateStatus = 'error';
    } else if (debounceWarnings.length) {
      mergedValidateStatus = 'warning';
    } else if (meta !== null && meta !== void 0 && meta.touched) {
      mergedValidateStatus = 'success';
    }

    var itemClassName = (_itemClassName = {}, _defineProperty(_itemClassName, "".concat(prefixCls, "-item"), true), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-with-help"), help || debounceErrors.length || debounceWarnings.length), _defineProperty(_itemClassName, "".concat(className), !!className), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-has-feedback"), mergedValidateStatus && hasFeedback), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-has-success"), mergedValidateStatus === 'success'), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-has-warning"), mergedValidateStatus === 'warning'), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-has-error"), mergedValidateStatus === 'error'), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-is-validating"), mergedValidateStatus === 'validating'), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-hidden"), hidden), _itemClassName); // ======================= Children =======================

    return /*#__PURE__*/React.createElement(Row, _extends({
      className: classNames(itemClassName),
      style: style,
      key: "row"
    }, omit(restProps, ['colon', 'extra', 'getValueFromEvent', 'getValueProps', 'htmlFor', 'id', // It is deprecated because `htmlFor` is its replacement.
    'initialValue', 'isListField', 'labelAlign', 'labelCol', 'normalize', 'preserve', 'tooltip', 'validateFirst', 'valuePropName', 'wrapperCol', '_internalItemRender'])), /*#__PURE__*/React.createElement(FormItemLabel, _extends({
      htmlFor: fieldId,
      required: isRequired,
      requiredMark: requiredMark
    }, props, {
      prefixCls: prefixCls
    })), /*#__PURE__*/React.createElement(FormItemInput, _extends({}, props, meta, {
      errors: debounceErrors,
      warnings: debounceWarnings,
      prefixCls: prefixCls,
      status: mergedValidateStatus,
      validateStatus: mergedValidateStatus,
      help: help
    }), /*#__PURE__*/React.createElement(NoStyleItemContext.Provider, {
      value: onSubItemMetaChange
    }, baseChildren)));
  }

  if (!hasName && !isRenderProps && !dependencies) {
    return renderLayout(children);
  }

  var variables = {};

  if (typeof label === 'string') {
    variables.label = label;
  } else if (name) {
    variables.label = String(name);
  }

  if (messageVariables) {
    variables = _objectSpread2(_objectSpread2({}, variables), messageVariables);
  } // >>>>> With Field


  return /*#__PURE__*/React.createElement(Field, _extends({}, props, {
    messageVariables: variables,
    trigger: trigger,
    validateTrigger: mergedValidateTrigger,
    onMetaChange: onMetaChange
  }), function (control, renderMeta, context) {
    var mergedName = toArray(name).length && renderMeta ? renderMeta.name : [];
    var fieldId = getFieldId(mergedName, formName);
    var isRequired = required !== undefined ? required : !!(rules && rules.some(function (rule) {
      if (rule && _typeof(rule) === 'object' && rule.required && !rule.warningOnly) {
        return true;
      }

      if (typeof rule === 'function') {
        var ruleEntity = rule(context);
        return ruleEntity && ruleEntity.required && !ruleEntity.warningOnly;
      }

      return false;
    })); // ======================= Children =======================

    var mergedControl = _objectSpread2({}, control);

    var childNode = null;
    devWarning(!(shouldUpdate && dependencies), 'Form.Item', "`shouldUpdate` and `dependencies` shouldn't be used together. See https://ant.design/components/form/#dependencies.");

    if (Array.isArray(children) && hasName) {
      devWarning(false, 'Form.Item', '`children` is array of render props cannot have `name`.');
      childNode = children;
    } else if (isRenderProps && (!(shouldUpdate || dependencies) || hasName)) {
      devWarning(!!(shouldUpdate || dependencies), 'Form.Item', '`children` of render props only work with `shouldUpdate` or `dependencies`.');
      devWarning(!hasName, 'Form.Item', "Do not use `name` with `children` of render props since it's not a field.");
    } else if (dependencies && !isRenderProps && !hasName) {
      devWarning(false, 'Form.Item', 'Must set `name` or use render props when `dependencies` is set.');
    } else if (isValidElement(children)) {
      devWarning(children.props.defaultValue === undefined, 'Form.Item', '`defaultValue` will not work on controlled Field. You should use `initialValues` of Form instead.');

      var childProps = _objectSpread2(_objectSpread2({}, children.props), mergedControl);

      if (!childProps.id) {
        childProps.id = fieldId;
      }

      if (supportRef(children)) {
        childProps.ref = getItemRef(mergedName, children);
      } // We should keep user origin event handler


      var triggers = new Set([].concat(_toConsumableArray(toArray(trigger)), _toConsumableArray(toArray(mergedValidateTrigger))));
      triggers.forEach(function (eventName) {
        childProps[eventName] = function () {
          var _mergedControl$eventN, _children$props$event, _children$props;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          (_mergedControl$eventN = mergedControl[eventName]) === null || _mergedControl$eventN === void 0 ? void 0 : _mergedControl$eventN.call.apply(_mergedControl$eventN, [mergedControl].concat(args));
          (_children$props$event = (_children$props = children.props)[eventName]) === null || _children$props$event === void 0 ? void 0 : _children$props$event.call.apply(_children$props$event, [_children$props].concat(args));
        };
      });
      childNode = /*#__PURE__*/React.createElement(MemoInput, {
        value: mergedControl[props.valuePropName || 'value'],
        update: children
      }, cloneElement(children, childProps));
    } else if (isRenderProps && (shouldUpdate || dependencies) && !hasName) {
      childNode = children(context);
    } else {
      devWarning(!mergedName.length, 'Form.Item', '`name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead.');
      childNode = children;
    }

    return renderLayout(childNode, fieldId, isRequired);
  });
}

var _excluded = ["prefixCls", "children"];

var FormList = function FormList(_ref) {
  _ref.prefixCls;
      var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded);

  devWarning(!!props.name, 'Form.List', 'Miss `name` prop.');
  var prefixCls = 'ant-form';
  var contextValue = React.useMemo(function () {
    return {
      prefixCls: prefixCls,
      status: 'error'
    };
  }, [prefixCls]);
  return /*#__PURE__*/React.createElement(List, props, function (fields, operation, meta) {
    return /*#__PURE__*/React.createElement(FormItemPrefixContext.Provider, {
      value: contextValue
    }, children(fields.map(function (field) {
      return _objectSpread2(_objectSpread2({}, field), {}, {
        fieldKey: field.key
      });
    }), operation, {
      errors: meta.errors,
      warnings: meta.warnings
    }));
  });
};

var Form = Form$1;
Form.Item = FormItem;
Form.List = FormList;
Form.ErrorList = ErrorList;
Form.useForm = useForm;
Form.Provider = FormProvider;

Form.create = function () {
  devWarning(false, 'Form', 'antd v4 removed `Form.create`. Please remove or use `@ant-design/compatible` instead.');
};

export { Form as default };
