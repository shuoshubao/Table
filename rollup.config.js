import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
// import { terser } from 'rollup-plugin-terser';

const babelConfig = {
    babelrc: false,
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties']
};

export default [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [postcss({ extract: true, minimize: true }), babel(babelConfig)]
    },
    {
        input: 'lib/Render.js',
        output: {
            file: 'dist/Render.esm.js',
            format: 'esm'
        },
        plugins: [postcss({ extract: true, minimize: true }), babel(babelConfig)]
    }
];
