// vue.config.js
module.exports = {
  // 配置别名
  configureWebpack: {
    resolve: {
      alias: {
        assets: '@/assets',
        components: '@/components',
        views: '@/views',
        plugins: '@/plugins',
      },
    },
  },
}
