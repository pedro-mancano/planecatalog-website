const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //chainWebpack: config => {
  //  config.plugins.delete('prefetch'); // for async routes
  //  config.plugins.delete('preload'); // for CSS
  //}
})
