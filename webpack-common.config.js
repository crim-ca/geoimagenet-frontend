const Path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: Path.resolve(__dirname, './js/bootstrap.js')
    },
    output: {
        path: Path.join(__dirname, './static'),
        filename: 'js/bootstrap.js'
    },
    plugins: [
        new CleanWebpackPlugin(['build'], { root: Path.resolve(__dirname) }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '~': Path.resolve(__dirname, '../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                use: ['babel-loader']
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }
            },
        ]
    }
};
