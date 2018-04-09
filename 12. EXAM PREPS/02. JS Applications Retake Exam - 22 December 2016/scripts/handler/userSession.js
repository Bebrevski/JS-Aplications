handlers.login = function (ctx) {
    ctx.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs',
        page: './templates/loginPage.hbs'
    }).then(function () {
        this.partial('./templates/main.hbs');
    });
};

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

handlers.register = function (ctx) {
    ctx.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs',
        page: './templates/registerPage.hbs'
    }).then(function () {
        this.partial('./templates/main.hbs');
    });
};

handlers.registerAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let name = ctx.params.name;

    auth.register(username, password, name)
        .then((userInfo) => {
            auth.saveSession(userInfo);
            notifications.showInfo('Registration successful!');
            ctx.redirect('#/index.html');
        });
};