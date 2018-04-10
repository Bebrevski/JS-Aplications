const handlers = {};
const util = {};

$(() => {
    util.getUser = function (ctx) {
        ctx.username = sessionStorage.getItem('username');
    };

    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        //HOME PAGE
        this.get('#/index.html', handlers.home);

        //LOGIN
        this.post('#/login', handlers.loginAction);

        //REGISTER
        this.post('#/register', handlers.registerAction);

        //SEENIT

        //LOGOUT
        this.get('#/logout', function (ctx) {
            auth.logout().then(() => {
                sessionStorage.clear();
                notifications.showInfo('Logout successful!');
                ctx.redirect('#/index.html');
            })
        });

    });

    app.run();
});