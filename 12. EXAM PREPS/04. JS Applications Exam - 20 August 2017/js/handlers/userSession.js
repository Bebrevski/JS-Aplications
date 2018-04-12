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
                notifications.showInfo('Login successful.');
                ctx.redirect('#/catalog');
            })
            .catch(auth.handleError);
    }
};

handlers.register = function (ctx) {
    ctx.loadPartials({
        header: './templates/header.hbs',
        footer: './templates/footer.hbs',
        //page: './templates/registerPage.hbs'
    }).then(function () {
       // this.partial('./templates/main.hbs');
    });
};

handlers.registerAction = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeatPass = ctx.params.repeatPass;
    //let name = ctx.params.name;

    if (password !== repeatPass){
      notifications.showError('Passwords do not match!');
      return;
    }
    if (!/^[A-Za-z]{3,}$/.test(username)){
      notifications.showError('Username should be at least 3 characters long!');
      return;
    }
    if (!/[A-Za-z\d]{6,}/.test(password)){
        notifications.showError('Password should be at least 6 characters long and to contain digits!');
        return;
    }

    auth.register(username, password) //name
        .then((userInfo) => {
            auth.saveSession(userInfo);
            notifications.showInfo('Registration successful!');
            ctx.redirect('#/catalog');
        })
        .catch(auth.handleError);
};