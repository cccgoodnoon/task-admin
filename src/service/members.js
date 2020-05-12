
// -----------------------------------------------------------------------------
// member service
// -----------------------------------------------------------------------------

class MemberService {
    constructor(nio) {
        this._nio = nio;
    }

    find(criterion)
    {
        return _nio.find("admin/members/", null, null)
    }

    get(id)
    {
        return _nio.get("admin/members/" + id, null, null)
    }
}
