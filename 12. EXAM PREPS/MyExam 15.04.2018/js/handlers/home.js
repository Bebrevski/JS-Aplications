handlers.home = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.loadPartials({
            footer: './templates/common/footer.hbs'
        }).then(function () {
            this.partial('./templates/welcome.hbs')
        })
    } else {
        ctx.redirect('#/homepage')
    }
};

handlers.homePage = function (ctx) {
    ctx.username = auth.getUsername();

    crudService.getActiveReceipt(auth.getUserId(), true)
        .then((res) => {
            sessionStorage.setItem('receiptId', res._id);
            if (res.length === 0) {
                crudService.createReceipt(true, 0, 0)
                    .then((response) => {
                        sessionStorage.setItem('receiptId', response._id);

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            receipt: './templates/common/receipt.hbs'
                        }).then(function () {
                            this.partial('./templates/homePage.hbs');
                            ctx.redirect('#/homepage');
                        })
                    })
                    .catch(auth.handleError);
            } else {
                res = res[res.length - 1];
                let id = res._id;
                sessionStorage.setItem('receiptId', res._id);

                crudService.getEntriesById(id)
                    .then((entries) => {
                    let total = 0;
                        entries.forEach(e => total += Number(e.price)* Number(e.qty));
                        ctx.entries = entries;
                        ctx.total = total;

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            receipt: './templates/common/receipt.hbs'
                        }).then(function () {
                            this.partial('./templates/homePage.hbs')
                        })
                    })
                    .catch(auth.handleError);
            }
        })
        .catch(auth.handleError);
};

