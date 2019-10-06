const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const isEnvProduction = process.env.NODE_ENV === 'production'

module.exports = {
  devServer: {
    overlay: false
  },
  publicPath: '',
  chainWebpack (config) {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js').set('@', resolve('src'))
  },
}
