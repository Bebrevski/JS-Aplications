handlers.login = function (ctx) {
    ctx.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs',
        //page: './templates/loginPage.hbs'
    }).then(function () {
        //this.partial('./templates/main.hbs');
    });
};

handlers.loginAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;

    if (username === '' || password === '') {
        notifications.showError('All fields should be non-empty!');
    } else {
        auth.login(username, password)
            .then((userData) => {
                auth.saveSession(userData);
                notifications.showInfo('Login successful!');
                ctx.redirect('#/homepage');
            })
            .catch(auth.handleError);
    }
};

handlers.register = function (ctx) {
    ctx.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    }).then(function () {
       this.partial('./templates/homePage.hbs');
    });
};

handlers.registerAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeatPass = ctx.params.repeatPass;

    if (password !== repeatPass){
      notifications.showError('Passwords do not match!');
      return;
    }
    if (password === '' || repeatPass === ''){
        notifications.showError('Password fields can not be empty!');
        return;
    }
    if (username.length < 5){
        notifications.showError('Username must be at least 5 characters long!');
        return;
    }

    auth.register(username, password)
        .then((userInfo) => {
            auth.saveSession(userInfo);
            notifications.showInfo('User registration successful!');
            ctx.redirect('#/homepage');
        })
        .catch(auth.handleError);
};