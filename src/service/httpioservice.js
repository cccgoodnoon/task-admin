import axios from 'axios'

// // https://blog.csdn.net/lucky541788/article/details/91575227

// // 假如项目很大，可以考虑拆分 api 请求
// const http = Axios.create({
//     baseURL: 'url',
//     headers: { 'X-Custom-Header': 'foobar' },
//     withCredentials: true // 跨域
// })

// export default http


// -----------------------------------------------------------------------------
// 本模块封装了调用服务端restful api所需的http客户端，大致对应于axios的简单封装，包括
// 对于cookie、登录信息、token、跨域、错误的公共处理，以简化更上层代码的开发。
//
// modified by zhangwei on 2020.04.21
// - Add some empty methods to reflect the architecture requirement and the interface 
// design. Also add a default callback method.
// - This module replaced the former http.js
// -----------------------------------------------------------------------------

// CONFIG_API_BASE_URL
// The common base url for the backend restful api. Attention it has the backslash.
//
// CONFIG_HTMLAPPL_BASE_URL
// The base url for the current html application. Attention it has the backslash.
//
// const CONFIG_API_BASE_URL = "http://47.111.234.116:8080/api/"
//
// const CONFIG_HTMLAPPL_BASE_URL = "http://47.111.234.116:8080/api/anon/"

// -----------------------------------------------------------------------------
// HTTP I/O service. It encapsulate the low level HTTP actions to simplify the 
// developing of the service layer and the UI layer.
//
// Reference
// https://blog.csdn.net/lucky541788/article/details/91575227
//
// Javascript 中的神器——Promise
// https://www.jianshu.com/p/063f7e490e9a
//
// ES6 入门教程 (ebook)
// https://es6.ruanyifeng.com/
// https://github.com/ruanyf/es6tutorial/blob/ac50325b6ef029a47b624fb02321dccd2dbdd8a6/docs/promise.md
// This article has an example about 用Promise对象实现的 Ajax 操作的例子
//
// function loadImageAsync(url) {
//  return new Promise(function(resolve, reject) {
//    const image = new Image();
//
//    image.onload = function() {
//      resolve(image);
//    };
//
//    image.onerror = function() {
//      reject(new Error('Could not load image at ' + url));
//    };
//
//    image.src = url;
//  });
// }
// 
// 上面代码中，使用Promise包装了一个图片加载的异步操作。如果加载成功，就调用resolve方法，否则就调用reject方法。
// 下面是一个用Promise对象实现的 Ajax 操作的例子。
//
// const getJSON = function(url) {
//   const promise = new Promise(function(resolve, reject){
//     const handler = function() {
//       if (this.readyState !== 4) {
//         return;
//       }
//       if (this.status === 200) {
//         resolve(this.response);
//       } else {
//         reject(new Error(this.statusText));
//       }
//     };
//     const client = new XMLHttpRequest();
//     client.open("GET", url);
//     client.onreadystatechange = handler;
//     client.responseType = "json";
//     client.setRequestHeader("Accept", "application/json");
//     client.send();
//   });
//   return promise;
// };
//
// getJSON("/posts.json").then(function(json) {
//   console.log('Contents: ' + json);
// }, function(error) {
//   console.error('出错了', error);
// });
//
// 获得Promise对象后，用then方法来实现成功时做A失败时做B的逻辑
// 一般来说，调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，
// 而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
// new Promise((resolve, reject) => {
//     return resolve(1);
//     // 后面的语句不会执行
//     console.log(2);
//   })
//
// then方法是定义在原型对象Promise.prototype上的。它的作用是为 Promise 实例添加状态改变时的回调函数。
// 前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。
//
// -----------------------------------------------------------------------------

class HttpIoService{
    constructor(baseurl)
    {
        this.baseurl = baseurl;
    }

    // initialize this module with the configuration parameter.
    init(baseurl) 
    {
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
    }

    set_cros(enabled)
    {

    }

    set_security_token(token)
    {

    }

    // The default callback can be used when calling some methods.
    // The default behavior of it is to print whatever input. 
    // 
    default_callback(o)
    {
        console.print("/service/http/_default_callback: ")
        console.print(o)
    }

    // formerly known as oGet.
    // callback is called when error occured.
    // 
    _o_get(url, params){
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
    }

    _o_post(url, params, callback){
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

    _o_put(url, params, callback){
        return new Promise((resolve , reject) => {
            axios.put(url ,param)
                .then(res => {
                    resolve(res.data)
                }, err => {
                    reject(err)
                }).catch(err => {
                    reject(err)
                })
        })
    }

    _o_delete(url, params, callback){
        return new Promise((resolve,reject) => {
            axios.delete(url,params)
                .then(res => {
                    resolve(res.data)
                },err => {
                    reject(err)
                }).catch(err => {
                    reject(err)
                })
        })
    }

    
    // Q: what's the different between find() and get() method here?
    // A: find will return an object array which is easily adapt to the list view.
    //    get only returns a single object which is easily used in object editor and object viewer.
    //    So the backend API implementation should reponsible to this difference.
    //
    // Reference
    // Understanding JavaScript’s async await
    // https://ponyfoo.com/articles/understanding-javascript-async-await
    //
    // 在返回函数的变量之前，如何等待 promise完成？
    // https://cloud.tencent.com/developer/ask/113016
    //
    // await怎么使用，回调地域，promise。我的总结, 2019,
    // https://blog.csdn.net/qq_33769914/article/details/87936267
    //
    // js执行机制（promise,setTimeout执行顺序）
    // https://www.jianshu.com/p/b8234b3314c8
    //
    async find(relativeurl, params, callback)
    {
        remoteurl = this.baseurl + relativeurl 
        result = null;
        // TODO
        // Can we return the list after the promising without using async and await? 
        var p = await this._o_get(remoteurl, params)
            .then(function(json) {
                console.log('Contents: ' + json);
                result = json;
            }, function(error) {
                console.error('出错了', error);
                if (callback != null)
                    callback(error)
            });

        return result
    }

    get(relativeurl, params, callback)
    {
        remoteurl = this.baseurl + relativeurl 
        return this._o_get(remoteurl, params, callback)
    }
    
    post(relativeurl, params, callback)
    {
        remoteurl = this.baseurl + relativeurl 
        return this._o_post(remoteurl, params, callback)
    }

    update(relativeurl, params, callback)
    {
        remoteurl = this.baseurl + relativeurl 
        return this._o_post(remoteurl, params, callback)
    }

    updateobject(relativeurl, id, o, callback)
    {
        remoteurl = this.baseurl + relativeurl + id
        return this._o_post(remoteurl, o, callback)
    }
    
    delete(relativeurl, params, callback)
    {
        remoteurl = this.baseurl + relativeurl 
        return this._o_delete(remoteurl, params, callback)
    }

    deleteobject(relativeurl, id)
    {
        remoteurl = this.baseurl + relativeurl + id
        return this._o_delete(remoteurl, null, callback)
    }
    
    /*
    // 批量删除
    // ids is a object id list. It's array type
    deleteobjects( ids ){
        var ids = []
        $.each(this.selected, (i, user) => {
            ids.push(user.id);
        });
        ids = ids.join(",");
        return oRemove('http://127.0.0.1:5000/rest/anon/tasks/'+ids);
    },
    */

    // Usage:
    // getJSON("/posts.json").then(function(json) {
    //  console.log('Contents: ' + json);
    //  }, function(error) {
    //  console.error('出错了', error);
    // });
    //
    // https://github.com/ruanyf/es6tutorial/blob/ac50325b6ef029a47b624fb02321dccd2dbdd8a6/docs/promise.md
    //
    getJson(url)
    {
        const promise = new Promise(function(resolve, reject){
            const handler = function() {
                if (this.readyState !== 4) {
                return;
                }
                if (this.status === 200) {
                resolve(this.response);
                } else {
                reject(new Error(this.statusText));
                }
            };
            const client = new XMLHttpRequest();
            client.open("GET", url);
            client.onreadystatechange = handler;
            client.responseType = "json";
            client.setRequestHeader("Accept", "application/json");
            client.send();  
            });
  
        return promise;
    }
}