
// "use strict";

import CONFIG_API_BASE_URL from "@conf/config.js"
import nio from common

// -----------------------------------------------------------------------------
// AppService (application service)
// This is the top level master object. It helps:
// - Controls the construct/destroy (initialization and finalization) of other 
//   service layer objects. 
// - Provides method to get the instance of other service layer objects.
// - Controls the construct/destroy (initialization and finalization) of itself. 
//   which is equivalent to the initialization and finalization of the whole 
//   service layer.
// - Provides a global "avc" object to help the UI layer module to access the 
//   functions of the service layer.
//
// Q: How to use this service object?
// A: use the global object variable "avc" directly:
//
//      import avc from '@service/appservice.js'
//      activitylist = avc.activities().find(null, null)
// 
// -----------------------------------------------------------------------------

class AppService {
    constructor(name) {
        this._name = name;
        this._nio = common.nio;
        this._tasks = null;
        this._members = null;
        this._courses = null;
        this._activities = null
    }

    // If you need more iniitialization operations after create the object, you can
    // add the source code into the init() method.
    //
    init()
    {

    }

    nio()
    {
        return this._nio;
    }

    // get task service
    tasks()
    {
        if (this._tasks == null)
        {
            this._tasks = new TaskService(this._nio)
        }
        return _tasks
    }

    // get_member_service
    members()
    {
        if (this._members == null)
        {
            this._members = new MemberService(this._nio)
        }
        return _members
    }

    // get_course_service
    courses()
    {
        if (this._courses == null)
        {
            this._courses = new CourseService(this._nio)
        }
        return _courses
    }

    // get_course_service
    activities()
    {
        if (this._activities == null)
        {
            this._activities = new ActivityService(this._nio)
        }
        return _activities
    }

    dump() {
        console.log("appservice.AppService.dump");
        console.log("hello, I'm starting...");
    }
}

// -----------------------------------------------------------------------------
// global variable
// -----------------------------------------------------------------------------

var avc = new AppService("OpenEdu AppService");
avc.dump();

// let get_app_service = function()
// {
//     console.log("enter get_app_service");
//   return _avc
// }

// export default {get_app_service}
export default {avc}
