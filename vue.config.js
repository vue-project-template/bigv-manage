
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/manage/' : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://10.221.100.175:3000',  
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '安徽电信机房智能监控管理平台'
      return args
    })
    config.module
        .rule('swf')
        .test(/\.swf$/)
        .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 10000
        });
  },
}