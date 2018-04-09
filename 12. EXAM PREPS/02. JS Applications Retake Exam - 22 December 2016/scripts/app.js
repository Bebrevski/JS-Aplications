const handlers = {};
const util = {};

$(() => {
    util.getUser = function (ctx) {
        ctx.username = sessionStorage.getItem('username');
    };

    const app = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        //HOME PAGE
        this.get('#/index.html', handlers.home);

        //LOGIN
        this.get('#/login', handlers.login);
        this.post('#/login', handlers.loginAction);

        //REGISTER
        this.get('#/register', handlers.register);
        this.post('#/register', handlers.registerAction);

        //SHOP
        this.get('#/shop', handlers.showShop);

        //CART
        this.get('#/cart', handlers.showCart);

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