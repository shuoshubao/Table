import devWarning from 'rc-util/lib/warning';

export default (valid, component, message) => {
    devWarning(valid, `[antd: ${component}] ${message}`);
};
