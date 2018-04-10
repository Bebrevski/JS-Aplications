handlers.loginAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;

    auth.login(username, password)
        .then((userInfo) => {
            auth.saveSession(userInfo);
            notifications.showInfo('Login successful!');
            ctx.redirect('#/index.html');
        });
};

handlers.registerAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeatPass = ctx.params.repeatPass;
    //TODO equal passes check

    auth.register(username, password, name)
        .then((userInfo) => {
            auth.saveSession(userInfo);
            notifications.showInfo('Registration successful!');
            ctx.redirect('#/index.html');
        });
};