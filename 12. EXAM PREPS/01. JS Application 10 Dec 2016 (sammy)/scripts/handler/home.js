handlers.home = function (ctx) {
    let content = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    };

    if (auth.isAuthed()) {
        this.username = sessionStorage.getItem('username');
        content.page = './templates/home/userHome.hbs';
    } else {
        content.page = './templates/viewHome.hbs';
    }
    ctx.loadPartials(content).then(function () {
        this.partial('./templates/common/main.hbs');
    });
};