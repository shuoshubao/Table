import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
// import { terser } from 'rollup-plugin-terser';

export default [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [postcss({ extract: true, minimize: true }), babel()]
    },
    {
        input: 'lib/Render.js',
        output: {
            file: 'dist/Render.esm.js',
            format: 'esm'
        },
        plugins: [postcss({ extract: true, minimize: true }), babel()]
    },
    {
        input: 'lib/Table/index.js',
        output: {
            file: 'dist/Table.esm.js',
            format: 'esm'
        },
        plugins: [babel()]
    },
    {
        input: 'lib/Table/index.js',
        output: {
            file: 'dist/Table.js',
            format: 'cjs'
        },
        plugins: [babel()]
    }
];
