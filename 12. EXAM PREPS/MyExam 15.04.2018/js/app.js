const handlers = {};
const util = {};

$(() => {

    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        //WELCOME
        this.get('index.html', handlers.home);
        this.get('#/home', handlers.home);

        //HOME PAGE
        this.get('#/homepage', handlers.homePage);

        //LOGIN
        this.post('#/login', handlers.loginAction);

        //REGISTER
        this.post('#/register', handlers.registerAction);

        //POST ENTRY

        this.post('#/post', handlers.postEntry);

        //DELETE ENTRY
        this.get('#/delete/:entryId', handlers.deleteAction);

        //VIEW RECEIPTS
        this.get('#/overview', handlers.overviewPage);

        //CHECK OUT
        this.post('#/checkout', handlers.checkOutAction);

        //DETAIL VIEW
        this.get('#/details/:receiptId', handlers.detailPage);

        //LOGOUT
        this.get('#/logout', function (ctx) {
            auth.logout()
                .then(() => {
                sessionStorage.clear();
                ctx.redirect('#/home')
                })
                .catch(notifications.handleError);
        });

        //HELPING FUNCTION FOR FORMATTING DATE
        util.calcTime = function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);
            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        };
    });

    app.run();
});