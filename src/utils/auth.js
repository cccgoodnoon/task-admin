import Cookies from 'js-cookie'
import axios from 'axios'
// import qs from 'qs'


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
        // reject(err)
        return Promise.reject(err);
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
  //47.111.234.116:8080
  // 127.0.0.1:5000
  //http://47.111.234.116:8080
  _get() {
    return oGet('http://47.111.234.116:8080/api/admin/task/tasks')
  },

  _gets(params) {
    return oGet('http://47.111.234.116:8080/api/admin/task/tasks/' + params)
  },

  _post(params) {
    return oPost('http://47.111.234.116:8080/api/admin/task/tasks/new',params)
  },

  _update(id, param) {
    return oUpdate('http://47.111.234.116:8080/api/admin/task/tasks/v/' + id, param)
  },

  _remove(user){
    var userid = user.id;
    return oRemove('http://47.111.234.116:8080/api/admin/task/tasks/e/' + userid)
  },

// ------------------------------------------

  _getM () {
    return oGet('http://47.111.234.116:8080/api/u/member');
  },
  _getOM (id) {
    return oGet('http://47.111.234.116:8080/api/u/member/'+ id);
  },
  _getC () {
    return oGet('http://47.111.234.116:8080/api/u/course');
  },

  _getOC (id) {
    return oGet('http://47.111.234.116:8080/api/u/course/'+ id);
  },
  _getA (id) {
    return oGet('http://47.111.234.116:8080/api/u/activity/'+ id);
  },

  _posta(params) {
    return oPost('http://47.111.234.116:8080/api/u/activity',params);
  },

  _updatea (id, param) {
    return oUpdate('http://47.111.234.116:8080/api/u/activity/state/'+ id, param);

  },

  _removea(uuid){
    return oRemove('http://47.111.234.116:8080/api/u/activity/'+ uuid);
  },


  // -----------------------------------------------------------
  _geta () {
    return oGet('http://47.111.234.116:8080/api/u/activity');
  },
  _getReport2 () {
      return oGet('http://47.111.234.116:8080/api/u/export/report2');
  },
  _getReport3 () {
      return oGet('http://47.111.234.116:8080//api/u/export/report3');
  },
  // -----------------------------------------------------------
  _removeNode(uuid){
    return oRemove('http://47.111.234.116:8080/api/u/fdb/task/'+uuid);
  },
  _getNode () {
    return oGet('http://47.111.234.116:8080/api/u/fdb/task');
  },
  _getOneNode (uuid) {
    return oGet('http://47.111.234.116:8080/api/u/fdb/task/1/'+uuid);
  },
  _downloadNode (uuid) {
    return oGet('http://47.111.234.116:8080/api/u/fdb/task/'+uuid);
  },
  _postFile (params) {
    return oPost('http:/47.111.234.116:8080/api/u/fdb/task',params);
  },
  _getFileName(uuid){
    return oGet('http://47.111.234.116:8080/api/u/fdb/task/getFilename/'+uuid);
  }
}
