import any from common

var _tasklist = [
            {
                id: 1,
                name: 'James',
                handle: '@jokerjames',
                img: 'https://semantic-ui.com/images/avatar2/large/matthew.png',
                tweet: "If you don't succeed, dust yourself off and try again.",
                likes: 10,
            },
            { 
                id: 2,
                name: 'Fatima',
                handle: '@fantasticfatima',
                img: 'https://semantic-ui.com/images/avatar2/large/molly.png',
                tweet: 'Better late than never but never late is better.',
                likes: 12,
            },
            {
                id: 3,
                name: 'Xin',
                handle: '@xeroxin',
                img: 'https://semantic-ui.com/images/avatar2/large/elyse.png',
                tweet: 'Beauty in the struggle, ugliness in the success.',
                likes: 18,
            }
            ]


// -----------------------------------------------------------------------------
// application service
// -----------------------------------------------------------------------------

class TaskService {
    constructor(nio) {
        this._nio = nio;
    }

    find(criterion)
    {
        // change the source code to use your best find
        return find1()

    }

    find1()
    {
        this.nio.get("admin/tasks", null)
    }

    find2(params)
    {
        this.nio.get("admin/tasks", params)
    }

    find3(criterion)
    {
        console.log("AppService.get_task_list")
        return _tasklist;
    }

    // https://blog.csdn.net/Bryant953/article/details/79411688
    async_find2(callback)
    {
        // let url = "http://localhost/rest/task/tasks"
        // this.axios.get(url).then(callback)
        return _nio.get("task/tasks", null)
    }

    get(id)
    {
        return _nio.get("task/tasks", {"id": id})
    }
}
