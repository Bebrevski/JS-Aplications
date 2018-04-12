const handlers = {};
const util = {};

$(() => {

    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        //WELCOME || CATALOG
        this.get('index.html', handlers.home);
        this.get('#/home', handlers.home);

        //LOGIN
        this.post('#/login', handlers.loginAction);

        //REGISTER
        this.post('#/register', handlers.registerAction);

        //CATALOG PAGE
        this.get('#/catalog', handlers.catalog);

        //CREATE POST
        this.get('#/create/post', handlers.createPost);
        this.post('#/create/post', handlers.createPostAction);

        //EDIT POST
        this.get('#/edit/post/:postId', handlers.editPost);
        this.post('#/edit/post', handlers.editPostAction);

        //DELETE POST
        this.get('#/delete/post/:postId', handlers.deletePost);

        //VIEW MY POSTS
        this.get('#/posts', handlers.myPosts);

        //POST DETAILS
        this.get('#/details/:postId', handlers.postDetails);

        //CREATE COMMENT
        this.post('#/create/comment', handlers.createComment);

        //DELETE COMMENT
        this.get('#/comment/delete/:commentId/post/:postId', handlers.deleteCommentAction);

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