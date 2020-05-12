import axios from 'axios'
// import qs from 'qs'
import {HttpIoService} from httpioservice
import CONFIG_API_BASE_URL from "@conf/config.js"

/*
//延时设置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.params = {}
// POST传参序列化
axios.interceptors.request.use((config) => {
    // if (config.method === 'post') {
    //     config.data = qs.stringify(config.data)
    // }
    let URL = config.url.split(config.baseURL)
    return config
}, (error) => {
    return Promise.reject(error)
})
  
// 返回状态判断
axios.interceptors.response.use((res) => {
    //console.log(res)
    return res
}, (error) => {
    return Promise.reject(error)
})
*/

nio = new HttpIoService(CONFIG_API_BASE_URL)
export default nio

/*
export const oGet = (url, params) => {
    return nio.get(url, param, null)
}
*/

/*
// TODO: the following should not be used in the future because we have the class.
// comment them pls

//封装获取数据
export const oGet = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, params)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
};

export default { 
    _get () {
        return oGet('http://47.111.234.116:8080/api/admin/tasks');
    },
    _gets(params) {
        return oGet('http://47.111.234.116:8080/api/admin/tasks/' + params)
    }, 
}
*/
