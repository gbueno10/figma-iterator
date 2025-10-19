const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',
  devtool: false, // Desabilita source maps completamente
  
  entry: {
    code: './src/code.ts',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // Ignora verificação de tipos
            compilerOptions: {
              sourceMap: false, // Sem source maps
              declaration: false, // Sem arquivos .d.ts
              declarationMap: false,
            },
          },
        },
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui.html',
      filename: 'ui.html',
      chunks: [],
      inject: false,
      minify: false, // Desabilita minificação do HTML
    }),
  ],

  cache: {
    type: 'filesystem',
    compression: false, // Desabilita compressão do cache
  },

  stats: 'errors-only', // Mostra apenas erros
  
  performance: {
    hints: false,
  },

  optimization: {
    minimize: false, // Desabilita minificação para build rápido
  },
})
