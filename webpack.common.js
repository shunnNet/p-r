const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

//const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

function common (options){
    
    return {
        entry: {
        },
        plugins: [
            // make other loader effect .vue file (e.g : /\.css$/)  
            new VueLoaderPlugin()
    
            // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
            //new CleanWebpackPlugin(),
            /*new HtmlWebpackPlugin({
              title: 'Production',
            }),*/
        ],
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'public'),
        },
        module: {
            rules: [
                {
                    test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
                    use: {
                      loader: 'url-loader',
                      options: {
                        limit: 1000, //bytes
                        name: '[hash:7].[ext]',
                        esModule: false, // fix img src be [Object Module]
                        //outputPath: 'assets'
                      }
                    }
                },
                {
                    test: /\.s*css$/,
                    use: [
                        'vue-style-loader', // Create <style> nodes By JS () vue-loader default dependencies)
                        { // translate CSS into CommonJS
                            loader: 'css-loader',
                            options: {
                                sourceMap: options.sourceMap ? true : false,
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: options.sourceMap ? true : false,
                                ident: 'postcss',
                                plugins: [
                                    require('autoprefixer')({}),
                                ]
                            }
                        },
    
                        {
                            loader: 'sass-loader', // compile scss/sass by node sass
                            options: {
                                // 你也可以从一个文件读取，例如 `variables.scss`
                                // 如果 sass-loader 版本 < 8，这里使用 `data` 字段
                                prependData: '$color: red;',
                                sourceMap: options.sourceMap ? true : false,
                            }
                        }
    
                    ],
                },
                {
                    test: /\.js?$/,
                    loader: 'babel-loader',
    
                    exclude: file => ( // 排除 node_modules 中非 .vue 檔
                        /node_modules/.test(file) &&
                        !/\.vue\.js/.test(file)
                    ), // NOTE : 不知道這東西的道理,
                    options: {
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "usage",
                                    "corejs": "2"
                                }
                            ]
                        ],
                        "plugins": [
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": "3"
                                }
                            ]
                        ]
                    }
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        cssSourceMap: true
                    }
                },
            ]
        }
    
    
    };
}

module.exports = common