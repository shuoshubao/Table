import * as React from 'react';
import { Empty } from 'antd';
import { ConfigConsumer } from '.';

const renderEmpty = componentName => (
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

export default renderEmpty;
