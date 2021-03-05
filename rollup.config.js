import babel from '@rollup/plugin-babel';

export default {
    input: 'src/Table/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
    },
    plugins: [
        babel({
            babelrc: false,
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
    ]
};
