import Cookies from 'js-cookie'
import axios from 'axios'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 延时设置
axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.params = {}
// POST传参序列化
// request拦截器 原在request.js
axios.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //     config.data = qs.stringify(config.data)
  // }
  const URL = config.url.split(config.baseURL)
  return config
}, (error) => {
  return Promise.reject(error)
})  
// 返回状态判断
axios.interceptors.response.use((res) => {
  // console.log(res)
  return res
}, (error) => {
  return Promise.reject(error)
})

// 封装获取数据
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
// 封装发送数据
export const oPost = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装更新数据
export const oUpdate = (url, param) => {
  return new Promise((resolve, reject) => {
    axios.put(url, param)
      .then(res => {
        resolve(res.data)
      }, err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

// 封装删除数据
export const oRemove = (url, params) => {
  return new Promise((resolve,reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res.data)
      },err => {
        reject(err)
      }).catch(err => {
        reject(err)
      })
  })
}

export default {
  _get() {
    // return oGet('http://127.0.0.1:5000/rest/anon/tasks');
    return oGet('http://127.0.0.1:5000/api/admin/tasks')
  },
  _gets(params) {
    return oGet('http://127.0.0.1:5000/api/admin/tasks/' + params)
  },  
  _post(params) {
    return oPost('http://127.0.0.1:5000/api/admin/task/new',params)
  },  
  _update(id, param) {
    return oUpdate('http://127.0.0.1:5000/api/admin/tasks/v/' + id, param)
  },
  // 删除单个用户
  _remove(user){
    var userid = user.id;
    return oRemove('http://127.0.0.1:5000/api/admin/tasks/e/' + userid)     
  },
  // 批量删除
  _removes(param){
    return oRemove('http://127.0.0.1:5000/rest/anon/tasks/' + param)
  }
}
