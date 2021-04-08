import { cloneDeep } from 'lodash';

export const exchange = (arr, from, to) => {
    const result = cloneDeep(arr);
    result[from] = arr[to];
    result[to] = arr[from];
    return result;
};
