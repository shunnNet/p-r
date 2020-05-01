const merge = require('webpack-merge');
const webpack = require('webpack')

const options = {
    sourceMap : true
}
const common = require('./webpack.common.js')(options);



module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  /*devServer: {
    contentBase: './dist',
  },*/
  entry:{
    app: ['./src/index.js','webpack-hot-middleware/client'],
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
  ],
  output : {
    publicPath: '/', // Make sure express server serve on http://localhost:3000
  }
});