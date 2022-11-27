const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //chainWebpack: config => {
  //  config.plugins.delete('prefetch'); // for async routes
  //  config.plugins.delete('preload'); // for CSS
  //}
  pwa: {
    name: 'My App',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      swDest: 'service-worker.js',
    },
  },
  devServer: {
    hot: false,
    liveReload: false
  }
})
