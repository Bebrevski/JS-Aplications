let auth = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function getUserId() {
        return sessionStorage.getItem('userId');
    }

    function getUsername() {
        return sessionStorage.getItem('username');
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        //let name = userInfo.name;
        //sessionStorage.setItem('name', name);
    }

    // user/login
    function login(username, password) {
        let userData = {
            username,
            password
        };

        return remote.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password) { //name
        let userData = {
            username,
            password,
        };

        return remote.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return remote.post('user', '_logout', 'kinvey', logoutData);
    }


    return {
        login,
        register,
        logout,
        isAuthed,
        saveSession,
        getUserId,
        getUsername,
        clearSession
    }
})();