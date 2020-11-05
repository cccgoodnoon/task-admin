// author zhangwei on 2020.04.25
//
// All configuration variables should be defined in this module. so that we can
// easily update them to adapt to new deployment.

// WebPack对release, developing模式的不同配置问题似乎已经提供了解决方案
// 应重点使用之 VUE_APP_BASE_API
// 参考project根目录下的.env.develpment和.env.production


// To configure the remote server.
var CONFIG_API_BASE_URL = "http://127.0.0.1:5000/api/"

//47.111.234.116:8080
//127.0.0.1:5000

export default {CONFIG_API_BASE_URL}
