handlers.home = function (ctx) {
    let content = {
        header: './templates/header.hbs',
        footer: './templates/footer.hbs'
    };

    if (auth.isAuthed()) {
        this.username = sessionStorage.getItem('username');
        content.page = './templates/userPage.hbs';
    } else {
        content.page = './templates/homePage.hbs';
    }
    ctx.loadPartials(content).then(function () {
        this.partial('./templates/main.hbs');
    });
};