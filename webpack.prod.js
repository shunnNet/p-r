const merge = require('webpack-merge');

const options = {
    sourceMap : false
}
const common = require('./webpack.common.js')(options);



module.exports = merge(common, {
    entry:{
        app: './src/index.js',
    },
    mode: 'production',
    devtool : "source-map"
});