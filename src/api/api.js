import service from './../utils/request'


let getAllTask = async () => {
    return await service.get('/api/admin/task/tasks')
}

let getOneTask = async (params) => {
    return await service.get('/api/admin/task/tasks/'+params)
}

let getByAuth = async (id) => {
    return await service.get('/api/admin/task/tasks/byauth/' + id)
}

let postNewTask = async (params) => {
    return await service.post('/api/admin/task/tasks/new', params)
}

let updateOneTask = async (id,params) => {
    return await service.put('/api/admin/task/tasks/v/'+ id, params)
}

let removeOneTask = async (user) => {
    var userid = user.id;
    return await service.delete('/api/admin/task/tasks/e/' + userid)
}

let getAllMember = async () => {
    return await service.get('/api/u/member')
}

let getOneMember = async (id) => {
    return await service.get('/api/u/member/'+ id)
}

let getAllCourse = async () => {
    return await service.get('/api/u/course')
}

let getOneCourse = async (id) => {
    return await service.get('/api/u/course/'+ id)
}

let getAllActivity = async () => {
    return await service.get('/api/u/activity')
}

let getOneActicity = async (id) => {
    return await service.get('/api/u/activity/'+ id)
}

let postNewActivity = async (params) => {
    return await service.post('/api/u/activity', params)
}

let updateOneActivity = async (id,params) => {
    return await service.post('/api/u/activity/state/'+ id, params)
}

let removeOneActivity = async (uuid) => {
    return await service.delete('/api/u/activity/' + uuid)
}

let getReport2 = async () => {
    return await service.get('/api/u/export/report2')
}

let getReport3 = async () => {
    return await service.get('/api/u/export/report3')
}

let getNode = async () => {
    return await service.get('/api/u/fdb/task')
}

let getOneNode = async (uuid) => {
    return await service.get('/api/u/fdb/task/1/'+ uuid)
}

let downloadNode = async (uuid) => {
    return await service.get('/api/u/fdb/task/'+ uuid)
}

let removeNode = async (uuid) => {
    return await service.delete('/api/u/fdb/task/'+ uuid)
}

let postFile = async (params) => {
    return await service.post('/api/u/fdb/task', params)
}

let getFileName = async (uuid) => {
    return await service.get('/api/u/fdb/task/getFilename/'+ uuid)
}

export {
    getAllTask,
    getOneTask,
    getByAuth,
    postNewTask,
    updateOneTask,
    removeOneTask,
    getAllMember,
    getOneMember,
    getAllCourse,
    getOneCourse,
    getAllActivity,    
    getOneActicity,
    postNewActivity,
    updateOneActivity,
    removeOneActivity,
    getReport2,
    getReport3,
    removeNode,
    getNode,
    getOneNode,
    downloadNode,
    postFile,
    getFileName
}