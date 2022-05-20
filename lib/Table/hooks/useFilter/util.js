export function flattenKeys(filters) {
    let keys = [];
    (filters || []).forEach(({ value, children }) => {
        keys.push(value);
        if (children) {
            keys = [...keys, ...flattenKeys(children)];
        }
    });
    return keys;
}
