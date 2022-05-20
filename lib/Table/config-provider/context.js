import * as React from 'react';
import defaultRenderEmpty, { RenderEmptyHandler } from './renderEmpty';
import { Locale } from '../locale-provider';
import { SizeType } from './SizeContext';

const defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) {
        return customizePrefixCls;
    }

    return suffixCls ? `ant-${suffixCls}` : 'ant';
};

export const ConfigContext =
    React.createContext <
    ConfigConsumerProps >
    {
        // We provide a default function for Context without provider
        getPrefixCls: defaultGetPrefixCls,

        renderEmpty: defaultRenderEmpty
    };

export const ConfigConsumer = ConfigContext.Consumer;

/** @deprecated Use hooks instead. This is a legacy function */
export function withConfigConsumer(config) {
    return function withConfigConsumerFunc(Component) {
        // Wrap with ConfigConsumer. Since we need compatible with react 15, be care when using ref methods
        const SFC = props => (
            <ConfigConsumer>
                {configProps => {
                    const { prefixCls: basicPrefixCls } = config;
                    const { getPrefixCls } = configProps;
                    const { prefixCls: customizePrefixCls } = props;
                    const prefixCls = getPrefixCls(basicPrefixCls, customizePrefixCls);
                    return <Component {...configProps} {...props} prefixCls={prefixCls} />;
                }}
            </ConfigConsumer>
        );

        const cons = Component.constructor;
        const name = (cons && cons.displayName) || Component.name || 'Component';

        SFC.displayName = `withConfigConsumer(${name})`;

        return SFC;
    };
}