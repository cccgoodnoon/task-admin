
// -----------------------------------------------------------------------------
// Activity Service
// Currently, this service keeps the relationship between the member and the course.
//
// Q: How to use this service?
// A: 
//      import avc from '@service/appservice.js'
//      activitylist = avc.activities().find(null, null)
//
// modified by zhangwei on 2020.04.25
// -----------------------------------------------------------------------------

class ActivityService {
    constructor(nio) {
        this._nio = nio;
    }

    // TODO
    // return
    //  the data from the backend. If failed, then the callback function 
    //  will be called. And you display the error message inside the callback
    //
    //      callback(err) 
    //  It's the UI layers responsibility to implement a callback method.
    //
    find(criterion, callback)
    {
        return this._nio.find("/admin/activity/", criterion, callback)
    }
    
    find_by_member_course_time(memberid, courseid, time)
    {
        params = [{"memberid": memberid},{"courseid": courseid}, {"begintime": time}]
        return this._nio.find("/admin/activity/", params, callback)
    }

    get(id)
    {
        // return this._nio.get("/admin/activity/", {"id": id}, callback)
        url = "/admin/activity/" + id
        return this._nio.get(url, null, callback)
    }

    add(memberid, courseid, begintime, endtime)
    {
        params = [{"memberid": memberid},{"courseid": courseid}, {"begintime": time}, {"endtime": time}]
        return this._nio.get("/admin/activity/", params, callback)
    }

    remove(id)
    {
        url = "/admin/activity/" + id
        return this._nio.delete(url, null, callback)
    }

    remove_by_member_course_time(memberid, courseid, time)
    {
        // do with  loop
    }

    // o is the input activity object
    update(id, o)
    {
        // params = [{"id": id}, {"memberid": o.memberid},{"courseid": o.courseid}, {"begintime": o.begintime}, {"endtime": time}]
        return this._nio.updateobject("/admin/activity/", id, o, callback)
    }

    // You should call this like:
    //      import avc from '@service/appservice.js'
    //      courselist = avc.activities().get_course_list(avc.courses());
    //
    // In most cases, you should be able to access the "avc" variable, so simpley 
    // call avc.courses().find(null) to get a course list.
    //
    get_course_list(course)
    {
        return course.find(null)
    }

    get_member_list(members)
    {
        return members.find(null)
    }
}


// -----------------------
// The following are copied from Baihaoran's activity.js
// should be merged into the above class

import axios from 'axios'
import qs from 'qs'

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
//封装发送数据
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

//封装更新数据
export const oUpdate = (url ,param) => {
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

//封装删除数据
export const oRemove = (url , params) => {
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

export default { 

    _get () {
        return oGet('http://127.0.0.1:5000/rest/anon/tasks');
    },
    
    _post (params) {
        return oPost('http://127.0.0.1:5000/rest/anon/tasks',params);
    },
    
    _update (id, param) {
        return oUpdate('http://127.0.0.1:5000/rest/anon/tasks/'+ id, param);
    },

    //删除单个用户
    _remove(user){
        var userid = user.id;
        return oRemove('http://127.0.0.1:5000/rest/anon/tasks/'+ userid);
        
    },

    //批量删除
    _removes(){
        var ids = [];
        $.each(this.selected, (i, user) => {
            ids.push(user.id);
        });
        ids = ids.join(",");
        return oRemove('http://127.0.0.1:5000/rest/anon/tasks/'+ids);
    },
}

