/*
 * @Description: 
 * @Version: 1.0
 * @Autor: chenmeiqi
 * @LastEditors: chenmeiqi
 * @Date: 2019-12-03 11:03:37
 * @LastEditTime: 2020-09-28 12:36:30
 */
module.exports = {
  publicPath: './',
  devServer: {
        proxy: {
            '/api': {
                target: 'http://130.120.3.232:91/dintegrationapi',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },
    }
}