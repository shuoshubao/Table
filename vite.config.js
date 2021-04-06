// https://vitejs.dev/config/
export default ({ mode }) => {
    const isDevelopment = mode === 'development';
    return {
        base: isDevelopment ? '/' : 'https://shuoshubao.github.io/Table',
    };
};
