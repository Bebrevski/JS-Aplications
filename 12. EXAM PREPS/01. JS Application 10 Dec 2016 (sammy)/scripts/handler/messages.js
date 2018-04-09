handlers.messages = function (ctx) {
    util.getUser(ctx);
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        message: './templates/messages/message.hbs',
        page: './templates/messages/messages.hbs'
    }).then(function () {
        ctx.partials = this.partials;
        ctx.partial('./templates/common/main.hbs')
            .then(() => {
                messagesService.loadMyMessages(ctx.username)
                    .then((messages) => {
                        messages.forEach(m => m.timestamp = util.formatDate(m._kmd.lmt));
                        ctx.messages = messages;
                        ctx.render('./templates/messages/messages.hbs')
                            .then(function () {
                                $('#viewMyMessages > h1').remove();
                                this.replace('#myMessages');
                            });
                    }).catch(auth.handleError);
            });
    });
};

handlers.archive = function (ctx) {
    util.getUser(ctx);
    let username = sessionStorage.getItem('username');
    messagesService.loadArchiveMessages(username)
        .then((messages) => {
            messages.forEach(m => m.timestamp = util.formatDate(m._kmd.lmt));
            ctx.messages = messages;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                page: './templates/archive/archive.hbs'
            }).then(function () {
                this.partial('./templates/common/main.hbs')
                    .then(() => {
                        $('button').click((e) => {
                            let id = $(e.target).attr('data-id');
                            messagesService.deleteMessage(id)
                                .then(() => {
                                    notifications.showInfo('Message deleted!');
                                    $(e.target).parent().parent().remove();
                                })
                                .catch(auth.handleError);
                        });
                    });
            });
        }).catch(auth.handleError);
};

handlers.send = function (ctx) {
    util.getUser(ctx);
    messagesService.loadAllUsers()
        .then(userList => {
            ctx.userList = userList;
            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                page: './templates/send/send.hbs'
            }).then(function () {
                ctx.partials = this.partials;
                this.partial('./templates/common/main.hbs');
            });
        }).catch(auth.handleError);
};

handlers.sendAction = function (ctx) {
    let senderName = sessionStorage.getItem('name');
    let senderUsername = sessionStorage.getItem('username');
    let recipient = ctx.params.recipient;
    let text = ctx.params.text;
    messagesService.sendMessage(senderUsername, senderName, recipient, text).then((res) => {
        notifications.showInfo('Message sent!');
        ctx.redirect('#/archive');
    }).catch(auth.handleError);
};