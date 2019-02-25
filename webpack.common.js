const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        presentation: './src/presentation.jsx',
        platform: './src/platform.jsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new webpack.DefinePlugin({
            GEOSERVER_URL: JSON.stringify(process.env.GEOSERVER_URL || 'https://geoimagenetdev.crim.ca/geoserver'),
            GEOIMAGENET_API_URL: JSON.stringify(process.env.GEOIMAGENET_API_URL || 'https://geoimagenetdev.crim.ca/api/v1'),
            ANNOTATION_NAMESPACE_URI: JSON.stringify(process.env.ANNOTATION_NAMESPACE_URI || 'geoimagenet.public.crim.ca'),
            ANNOTATION_NAMESPACE: JSON.stringify(process.env.ANNOTATION_NAMESPACE || 'GeoImageNet'),
            ANNOTATION_LAYER: JSON.stringify(process.env.ANNOTATION_LAYER || 'annotation'),
        }),
        new CleanWebpackPlugin(['dist/*']),
        new HtmlWebpackPlugin({
            title: 'Presentation',
            chunks: ['presentation'],
        }),
        new HtmlWebpackPlugin({
            title: 'Platform',
            filename: 'platform.html',
            chunks: ['vendors~platform', 'platform'],
        }),
    ],
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
                    'file-loader',
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
