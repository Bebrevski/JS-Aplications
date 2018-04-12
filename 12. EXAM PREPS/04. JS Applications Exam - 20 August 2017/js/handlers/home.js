handlers.home = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            loginForm: './templates/forms/loginForm.hbs',
            registerForm: './templates/forms/registerForm.hbs',
        }).then(function () {
            this.partial('./templates/welcome-anonymous.hbs')
        })
    } else {
        ctx.redirect('#/catalog')
    }
};

handlers.catalog = function (ctx) {
    //Проверка, ако юзъра не е аутентикиран, да не може да достъпва пътищата
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }

    posts.getAllPosts()
        .then((posts) => {
            posts.forEach((p, i) => {
                p.rank = i + 1;
                p.date = util.calcTime(p._kmd.ect);
                p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuthed = auth.isAuthed(); //!!!
            ctx.username = sessionStorage.getItem('username');
            ctx.posts = posts;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                post: './templates/posts/post.hbs',
                postList: './templates/posts/postList.hbs'
            }).then(function () {
                this.partial('./templates/posts/catalogPage.hbs');
            });

        })
        .catch(auth.handleError);
};

handlers.createPost = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }
    ctx.isAuthed = auth.isAuthed();
    ctx.username = sessionStorage.getItem('username');

    //При GET първо се зареждат паршълите

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        navigation: './templates/common/navigation.hbs'
    }).then(function () {
        this.partial('./templates/posts/createPost.hbs');
    })
};

handlers.createPostAction = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }

    let author = sessionStorage.getItem('username');
    let url = ctx.params.url;
    let imageUrl = ctx.params.imageUrl;
    let title = ctx.params.title;
    let description = ctx.params.description;

    if (title === '') {
        notify.showError('Title is required!');
    } else if (url === '') {
        notify.showError('Url is required!');
    } else if (!url.startsWith('http')) {
        notify.showError('Url must be a valid link!');
    } else {
        posts.createPost(author, title, description, url, imageUrl)
            .then(() => {
                notifications.showInfo('Post created.');
                ctx.redirect('#/catalog');
            })
            .catch(auth.handleError);
    }
};

handlers.editPost = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }

    let postId = ctx.params.postId;

    posts.getPostById(postId)
        .then((post) => {
            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');
            ctx.post = post;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs'
            }).then(function () {
                this.partial('./templates/posts/editPostPage.hbs');
            })
        })
        .catch(auth.handleError);
};

handlers.editPostAction = function (ctx) {
    let postId = ctx.params.postId;

    let author = ctx.params.username;
    let url = ctx.params.url;
    let imageUrl = ctx.params.imageUrl;
    let title = ctx.params.title;
    let description = ctx.params.description;

    if (title === '') {
        notifications.showError('Title is required!');
        return;
    }
    if (url === '') {
        notifications.showError('URL is required!');
        return;
    }
    if (!url.startsWith('http')) {
        notifications.showError('URL must be a valid link!');
        return;
    }

    posts.editPost(postId, author, title, description, url, imageUrl)
        .then(() => {
            notifications.showInfo(`Post ${title} updated!`);
            ctx.redirect('#/catalog');
        })
        .catch(auth.handleError);
};

handlers.deletePost = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }

    let postId = ctx.params.postId;

    posts.deletePost(postId)
        .then(() => {
            notifications.showInfo('Post deleted!');
            ctx.redirect('#/catalog');
        })
        .catch(auth.handleError);
};

handlers.myPosts = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/home');
        return;
    }

    let username = sessionStorage.getItem('username');

    posts.getMyPosts(username)
        .then((posts) => {
            posts.forEach((p, i) => {
                p.rank = i + 1;
                p.date = util.calcTime(p._kmd.ect);
                p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');
            ctx.posts = posts;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                post: './templates/posts/post.hbs',
                postList: './templates/posts/postList.hbs'
            }).then(function () {
                this.partial('./templates/posts/myPostPage.hbs');
            });
        })
        .catch(auth.handleError)
};

handlers.postDetails = function (ctx) {
    let postId = ctx.params.postId;

    const postPromise = posts.getPostById(postId);
    const allCommentsPromise = comments.getPostComments(postId);

    Promise.all([postPromise, allCommentsPromise])
        .then(([post, comments]) => {
            post.date = util.calcTime(post._kmd.ect);
            post.isAuthor = post._acl.creator === sessionStorage.getItem('userId');
            comments.forEach((c) => {
                c.date = util.calcTime(c._kmd.ect);
                c.commentAuthor = c._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuthed = auth.isAuthed();
            ctx.username = sessionStorage.getItem('username');
            ctx.post = post;
            ctx.comments = comments;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                postDetails: './templates/details/postDetails.hbs',
                comment: './templates/details/comment.hbs'
            }).then(function () {
                this.partial('./templates/details/postDetailsPage.hbs');
            });
        })
        .catch(auth.handleError);
};

handlers.createComment = function (ctx) {
    let author = sessionStorage.getItem('username');
    let content = ctx.params.content;
    let postId = ctx.params.postId;

    if (content === '') {
        auth.showError('Cannot add empty comment!');
        return;
    }

    comments.createComment(postId, content, author)
        .then(() => {
            notifications.showInfo('Comment created!');
            ctx.redirect(`#/details/${postId}`);
        })
        .catch(notifications.showError);
};

handlers.deleteCommentAction = function (ctx) {
    let commentId = ctx.params.commentId;
    let postId = ctx.params.postId;

    comments.deleteComment(commentId)
        .then(() => {
            notifications.showInfo('Comment deleted.');
            ctx.redirect(`#/details/${postId}`);
        })
        .catch(auth.handleError);
};