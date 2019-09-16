module.exports = {
  lintOnSave: false,
    css:{
        loaderOptions:{
            sass:{
                data:`@import "@/assets/scss/_mixin.scss";`
            }
        }
    },
    devServer: {
        port:911,
        proxy: {
            '/api': {
                // target: 'http://47.96.237.153:8080/',
                // target: 'http://192.168.1.17:8080/',
                target: 'http://192.168.1.230:8080/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
