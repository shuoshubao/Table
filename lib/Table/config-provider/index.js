import * as React from 'react';
import IconContext from '@ant-design/icons/lib/components/Context';
import { FormProvider as RcFormProvider } from 'rc-field-form';
import { ValidateMessages } from 'rc-field-form/lib/interface';
import useMemo from 'rc-util/lib/hooks/useMemo';
import { RenderEmptyHandler } from './renderEmpty';
import LocaleProvider, { ANT_MARK } from '../locale-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { ConfigConsumer, ConfigContext, CSPConfig, DirectionType, ConfigConsumerProps, Theme } from './context';
import SizeContext, { SizeContextProvider, SizeType } from './SizeContext';
import message from '../message';
import notification from '../notification';
import { RequiredMark } from '../form/Form';
import { registerTheme } from './cssVariables';
import defaultLocale from '../locale/default';

export { RenderEmptyHandler, ConfigContext, ConfigConsumer, CSPConfig, DirectionType, ConfigConsumerProps };

export const configConsumerProps = [
    'getTargetContainer',
    'getPopupContainer',
    'rootPrefixCls',
    'getPrefixCls',
    'renderEmpty',
    'csp',
    'autoInsertSpaceInButton',
    'locale',
    'pageHeader'
];

// These props is used by `useContext` directly in sub component
const PASSED_PROPS = ['getTargetContainer', 'getPopupContainer', 'renderEmpty', 'pageHeader', 'input', 'form'];

export const defaultPrefixCls = 'ant';

export const defaultIconPrefixCls = 'anticon';

let globalPrefixCls;

let globalIconPrefixCls;

function getGlobalPrefixCls() {
    return globalPrefixCls || defaultPrefixCls;
}

function getGlobalIconPrefixCls() {
    return globalIconPrefixCls || defaultIconPrefixCls;
}

const setGlobalConfig = ({ prefixCls, iconPrefixCls, theme }) => {
    if (prefixCls !== undefined) {
        globalPrefixCls = prefixCls;
    }
    if (iconPrefixCls !== undefined) {
        globalIconPrefixCls = iconPrefixCls;
    }

    if (theme) {
        registerTheme(getGlobalPrefixCls(), theme);
    }
};

export const globalConfig = () => ({
    getPrefixCls: (suffixCls, customizePrefixCls) => {
        if (customizePrefixCls) return customizePrefixCls;
        return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
    },
    getIconPrefixCls: getGlobalIconPrefixCls,
    getRootPrefixCls: (rootPrefixCls, customizePrefixCls) => {
        // Customize rootPrefixCls is first priority
        if (rootPrefixCls) {
            return rootPrefixCls;
        }

        // If Global prefixCls provided, use this
        if (globalPrefixCls) {
            return globalPrefixCls;
        }

        // [Legacy] If customize prefixCls provided, we cut it to get the prefixCls
        if (customizePrefixCls && customizePrefixCls.includes('-')) {
            return customizePrefixCls.replace(/^(.*)-[^-]*$/, '$1');
        }

        // Fallback to default prefixCls
        return getGlobalPrefixCls();
    }
});

const ProviderChildren = props => {
    const {
        children,
        csp,
        autoInsertSpaceInButton,
        form,
        locale,
        componentSize,
        direction,
        space,
        virtual,
        dropdownMatchSelectWidth,
        legacyLocale,
        parentContext,
        iconPrefixCls
    } = props;

    const getPrefixCls = React.useCallback(
        (suffixCls, customizePrefixCls) => {
            const { prefixCls } = props;

            if (customizePrefixCls) return customizePrefixCls;

            const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('');

            return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
        },
        [parentContext.getPrefixCls, props.prefixCls]
    );

    const config = {
        ...parentContext,
        csp,
        autoInsertSpaceInButton,
        locale: locale || legacyLocale,
        direction,
        space,
        virtual,
        dropdownMatchSelectWidth,
        getPrefixCls
    };

    // Pass the props used by `useContext` directly with child component.
    // These props should merged into `config`.
    PASSED_PROPS.forEach(propName => {
        const propValue = props[propName];
        if (propValue) {
            config[propName] = propValue;
        }
    });

    // https://github.com/ant-design/ant-design/issues/27617
    const memoedConfig = useMemo(
        () => config,
        config,
        (prevConfig, currentConfig) => {
            const prevKeys = Object.keys(prevConfig);
            const currentKeys = Object.keys(currentConfig);
            return (
                prevKeys.length !== currentKeys.length || prevKeys.some(key => prevConfig[key] !== currentConfig[key])
            );
        }
    );

    const memoIconContextValue = React.useMemo(() => ({ prefixCls: iconPrefixCls, csp }), [iconPrefixCls]);

    let childNode = children;
    // Additional Form provider
    let validateMessages = {};

    if (locale) {
        validateMessages = locale.Form?.defaultValidateMessages || defaultLocale.Form?.defaultValidateMessages || {};
    }
    if (form && form.validateMessages) {
        validateMessages = { ...validateMessages, ...form.validateMessages };
    }

    if (Object.keys(validateMessages).length > 0) {
        childNode = <RcFormProvider validateMessages={validateMessages}>{children}</RcFormProvider>;
    }

    if (locale) {
        childNode = (
            <LocaleProvider locale={locale} _ANT_MARK__={ANT_MARK}>
                {childNode}
            </LocaleProvider>
        );
    }

    if (iconPrefixCls) {
        childNode = <IconContext.Provider value={memoIconContextValue}>{childNode}</IconContext.Provider>;
    }

    if (componentSize) {
        childNode = <SizeContextProvider size={componentSize}>{childNode}</SizeContextProvider>;
    }

    return <ConfigContext.Provider value={memoedConfig}>{childNode}</ConfigContext.Provider>;
};

const ConfigProvider = props => {
    React.useEffect(() => {
        if (props.direction) {
            message.config({
                rtl: props.direction === 'rtl'
            });
            notification.config({
                rtl: props.direction === 'rtl'
            });
        }
    }, [props.direction]);

    return (
        <LocaleReceiver>
            {(_, __, legacyLocale) => (
                <ConfigConsumer>
                    {context => <ProviderChildren parentContext={context} legacyLocale={legacyLocale} {...props} />}
                </ConfigConsumer>
            )}
        </LocaleReceiver>
    );
};

/** @private internal Usage. do not use in your production */
ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.SizeContext = SizeContext;
ConfigProvider.config = setGlobalConfig;

export default ConfigProvider;