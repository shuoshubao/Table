import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/Table/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        postcss({ extract: true }),
        babel({
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
    ]
};
