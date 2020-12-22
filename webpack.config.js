const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    // Define entry point
    entry: ["./src/budget.js"],

    // Define output point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    // This is for babel
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}