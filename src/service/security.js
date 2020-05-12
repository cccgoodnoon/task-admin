
// -----------------------------------------------------------------------------
// security service
// -----------------------------------------------------------------------------

class SecurityService {
    constructor(nio) {
        this._nio = nio;
        this._userid = 0; 
        this._security_level = 0;
        this._roles = "";
        this._access_control_list = ""
        this._username = "anon";
        this._security_token = "";
        this._userstate = 0;
    }

    login(user, password)
    {
        // TODO
        map = {"user": user}
        _nio.post("anon/login", map)
        _username = user
    }

    logout()
    {
        nio.post("anon/logout", null)
    }

    // load the JWT token from html5's session store and call login automatically. 
    // This method should be called if you don't choose cookie to save your JWT
    // token and want to control all the process manually. 
    //
    // Cookie is used in the past but it has also some drawbacks in the authtication
    // process. It depends. 
    //
    autologin()
    {
        // TODO
    }

    save_token(token)
    {

    }

    load_token()
    {

    }

    refresh_token()
    {
        
    }

    exist(user)
    {

    }

    get(id)
    {

    }


    hasrole()
    {

    }

    // For permission judgement. Attention the permission mechanism is different
    // from the access control in our application. 
    //
    haspermission()
    {

    }

    // For access control judgement. Access control controls which part of the data
    // can be accessed by the current user.
    //
    has_access_by_securitylevel(tagetlevel)
    {

    }    
}

