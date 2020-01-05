const path = require('path')
module.exports={
  entry: './src/index.ts',
  output: {
    filename: 'server.postgres.js',
    path: path.join(__dirname, '/dist')
  },
  module:{
    rules:[
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [/node_modules/,/\.test.ts/],
      }
    ]
  },
   target: 'node',
   resolve: {
     extensions: ['.ts', '.tsx','.js', '.json'],
     alias: {
       'pg-native': path.join(__dirname, 'aliases/pg-native.js'),
       'pgpass$': path.join(__dirname, 'aliases/pgpass.js'),
     },
   },
   optimization: {
    minimize: false
  }
}
