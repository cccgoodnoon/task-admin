import service from './../utils/request'


let get = async () => {
    return await service.get('/api/admin/task/tasks')
}

let gets = async (params) => {
    return await service.get('/api/admin/task/tasks/'+params)
}

let getByAuth = async (id) => {
    return await service.get('/api/admin/task/tasks/byauth/' + id)
}

let post = async (params) => {
    return await service.post('/api/admin/task/tasks/new', params)
}

let update = async (id,params) => {
    return await service.put('/api/admin/task/tasks/v/'+ id, params)
}

let remove = async (user) => {
    var userid = user.id;
    return await service.delete('/api/admin/task/tasks/e/' + userid)
}

let getM = async () => {
    return await service.get('/api/u/member')
}

let getOM = async (id) => {
    return await service.get('/api/u/member/'+ id)
}

let getC = async () => {
    return await service.get('/api/u/course')
}

let getOC = async (id) => {
    return await service.get('/api/u/course/'+ id)
}

let geta = async () => {
    return await service.get('/api/u/activity')
}

let getA = async (id) => {
    return await service.get('/api/u/activity/'+ id)
}

let posta = async (params) => {
    return await service.post('/api/u/activity', params)
}

let updatea = async (id,params) => {
    return await service.post('/api/u/activity/state/'+ id, params)
}

let removea = async (uuid) => {
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
    get,
    gets,
    getByAuth,
    post,
    update,
    remove,
    getM,
    getOM,
    getC,
    getOC,
    getA,
    posta,
    updatea,
    removea,
    geta,
    getReport2,
    getReport3,
    removeNode,
    getNode,
    getOneNode,
    downloadNode,
    postFile,
    getFileName
}