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

