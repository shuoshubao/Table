import { kebabCase } from 'lodash';
import { classNames, isSomeFalsy, formatTime } from '@nbfe/tools';

export const componentName = 'DynaTable';

export const prefixClassName = kebabCase(componentName);

export const getClassNames = (...args) => {
    return classNames(args)
        .split(' ')
        .map(v => {
            return [prefixClassName, v].join('-');
        })
        .join(' ');
};
