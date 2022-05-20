import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [babel()]
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
