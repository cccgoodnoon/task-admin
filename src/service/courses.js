
// -----------------------------------------------------------------------------
// Course Service
// -----------------------------------------------------------------------------

class CourseService {
    constructor(nio) {
        this._nio = nio;
    }

    find(criterion)
    {
        return _nio.find("admin/courses/", null, null)
    }

    get(id)
    {
        return _nio.get("admin/courses/" + id, null, null)
    }
}