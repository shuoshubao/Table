import * as React from 'react';
import { Empty } from 'antd';
import { isAntdV3 } from '../../config';

const defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
    if (customizePrefixCls) return customizePrefixCls;

    // v3 使用 v4 的样式
    if (isAntdV3 && suffixCls === 'table') {
        return 'ant-v3-table';
    }

    return suffixCls ? `ant-${suffixCls}` : 'ant';
};

const defaultRenderEmpty = componentName => (
    <ConfigConsumer>
        {({ getPrefixCls }) => {
            const prefix = getPrefixCls('empty');

            switch (componentName) {
                case 'Table':
                case 'List':
                    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
                case 'Select':
                case 'TreeSelect':
                case 'Cascader':
                case 'Transfer':
                case 'Mentions':
                    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={`${prefix}-small`} />;
                default:
                    return <Empty />;
            }
        }}
    </ConfigConsumer>
);

export const ConfigContext = React.createContext({
    // We provide a default function for Context without provider
    getPrefixCls: defaultGetPrefixCls,

    renderEmpty: defaultRenderEmpty
});

export const ConfigConsumer = ConfigContext.Consumer;

// =========================== withConfigConsumer ===========================
// We need define many types here. So let's put in the block region

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
