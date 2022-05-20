import * as React from 'react';
import { classNames } from '@nbfe/tools';

function renderExpandIcon(locale) {
    return function expandIcon({ prefixCls, onExpand, record, expanded, expandable }) {
        const iconPrefix = `${prefixCls}-row-expand-icon`;

        return (
            <button
                type="button"
                onClick={e => {
                    onExpand(record, e);
                    e.stopPropagation();
                }}
                className={classNames(iconPrefix, {
                    [`${iconPrefix}-spaced`]: !expandable,
                    [`${iconPrefix}-expanded`]: expandable && expanded,
                    [`${iconPrefix}-collapsed`]: expandable && !expanded
                })}
                aria-label={expanded ? locale.collapse : locale.expand}
            />
        );
    };
}

export default renderExpandIcon;
