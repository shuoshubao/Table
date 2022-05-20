import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/Table/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        postcss({
            extensions: ['.css'],
            use: [
                [
                    'less',
                    {
                        javascriptEnabled: true
                    }
                ]
            ],
            inject: true,
            extract: false
        }),
        babel({
            babelrc: false,
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
    ]
};
