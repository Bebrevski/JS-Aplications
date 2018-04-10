handlers.home = function (ctx) {
    let content = {
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        menu: './templates/menu/menu.hbs'
    };

    if (auth.isAuthed()) {
        this.username = sessionStorage.getItem('username');
        content.page = './templates/catalog/catalog.hbs'
    } else {
        content.page = './templates/welcome/welcome.hbs';
    }
    ctx.loadPartials(content).then(function () {
        this.partial('./templates/main.hbs');
    });
};