const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'fluids.2d.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'var',
    library: 'Fluids2d'
  },
  module: {
    rules: [   
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
            }
        },
        {
          test: /\.scss$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
    ]
  }
}