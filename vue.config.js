module.exports = {
  lintOnSave: true,
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 37.5, // 换算的基数
            selectorBlackList: ['mint-'], // 忽略转换正则匹配项
            propList: ['*']
          })
        ]
      }
    }
  }
}
