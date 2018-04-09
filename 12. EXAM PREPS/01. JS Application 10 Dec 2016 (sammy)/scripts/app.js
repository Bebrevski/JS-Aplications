const handlers = {};
const util = {};

$(() => {
    util.getUser = function (ctx) {
        ctx.username = sessionStorage.getItem('username');
    };

    util.formatDate = function (dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
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

        //MESSAGES
        this.get('#/messages', handlers.messages);

        this.get('#/archive', handlers.archive);

        this.get('#/send', handlers.send);
        this.post('#/send', handlers.sendAction);

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