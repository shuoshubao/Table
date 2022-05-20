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
        plugins: [babel()]
    }
];
