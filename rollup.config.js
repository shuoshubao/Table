import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'lib/index.jsx',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'default'
    },
    external: id => {
        if (['@ant-design/icons', '@ant-design/colors', '@ctrl/tinycolor', 'rc-util'].some(v => id.startsWith(v))) {
            return false;
        }
        return !['.', '/'].some(v => id.startsWith(v));
    },
    plugins: [
        postcss({ extract: true }),
        babel({
            babelrc: false,
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
        }),
        nodeResolve(),
        commonjs()
    ]
};
