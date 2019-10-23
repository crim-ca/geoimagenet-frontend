const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [
        './src/home.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new webpack.DefinePlugin({
            GEOSERVER_URL: JSON.stringify(process.env.GEOSERVER_URL || 'https://geoimagenetdev.crim.ca/geoserver'),
            GEOIMAGENET_API_URL: JSON.stringify(process.env.GEOIMAGENET_API_URL || 'https://geoimagenetdev.crim.ca/api/v1'),
            GRAPHQL_ENDPOINT: JSON.stringify(process.env.GRAPHQL_ENDPOINT || 'https://geoimagenetdev.crim.ca/graphql'),
            MAGPIE_ENDPOINT: JSON.stringify(process.env.MAGPIE_ENDPOINT || 'https://geoimagenetdev.crim.ca/magpie'),
            ML_ENDPOINT: JSON.stringify(process.env.ML_ENDPOINT || 'https://geoimagenetdev.crim.ca/ml'),
            CONTACT_EMAIL: JSON.stringify(process.env.CONTACT_EMAIL || 'geoimagenet-info@crim.ca'),
            ANNOTATION_NAMESPACE_URI: JSON.stringify(process.env.ANNOTATION_NAMESPACE_URI || 'geoimagenet.public.crim.ca'),
            ANNOTATION_NAMESPACE: JSON.stringify(process.env.ANNOTATION_NAMESPACE || 'GeoImageNet'),
            ANNOTATION_LAYER: JSON.stringify(process.env.ANNOTATION_LAYER || 'annotation'),
            FRONTEND_JS_SENTRY_DSN: JSON.stringify(process.env.FRONTEND_JS_SENTRY_DSN),
            THELPER_MODEL_UPLOAD_INSTRUCTIONS: JSON.stringify(process.env.THELPER_MODEL_UPLOAD_INSTRUCTIONS || 'https://thelper.readthedocs.io/en/latest/user-guide.html#export-model'),
        }),
        new CleanWebpackPlugin(['dist/*']),
        new HtmlWebpackPlugin({
            title: 'GeoImageNet'
        }),
    ],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader?name=img/[hash].[ext]',
                ],
            },
            {
                test: /\.(hack\.jpg)$/,
                use: [
                    'file-loader?name=img/[name].[ext]',
                ],
            },
            {
                test: /\.ico$/,
                use: [
                    'file-loader?name=[name].[ext]',
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
};
