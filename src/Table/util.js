import { flatten } from 'lodash';

// 全真
export const isEveryTruthy = (...args) => {
    return flatten(args).every(Boolean);
};

// 全假
export const isEveryFalsy = (...args) => {
    return flatten(args).every(v => !Boolean(v));
};

// 部分真
export const isSomeTruthy = (...args) => {
    return flatten(args).some(Boolean);
};

// 部分假
export const isSomeFalsy = (...args) => {
    return flatten(args).some(v => !Boolean(v));
};
