handlers.postEntry = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/homepage');
        return;
    }
    ctx.isAuthed = auth.isAuthed();
    ctx.username = auth.getUsername();

    let product = ctx.params.type;
    let quantity = ctx.params.qty;
    let pricePerUnit = ctx.params.price;
    let total = Number(quantity * pricePerUnit);
    let receiptId = sessionStorage.getItem('receiptId');

    crudService.addEntry(product, quantity, pricePerUnit, total, receiptId)
        .then((res) => {
            notifications.showInfo('Entry added!');
            ctx.redirect('#/homepage');
        })
        .catch(auth.handleError);
};

handlers.deleteAction = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/homepage');
        return;
    }
    let entryId = ctx.params.entryId;

    crudService.deleteEntry(entryId)
        .then(() => {
            notifications.showInfo('Entry deleted!');
            ctx.redirect('#/homepage');
        })
        .catch(auth.handleError)
};

handlers.overviewPage = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/homepage');
        return;
    }

    ctx.username = auth.getUsername();
    let id = auth.getUserId();

    crudService.getMyReceipts(id, false)
        .then((res) => {
            let megaTotal = 0;
            res.forEach((r) => {
                let date = (r._kmd.ect).toString().substr(0, 10) + ' ' + (r._kmd.ect).toString().substr(11, 5);

                r.date = date;
                megaTotal += r.total;
            });
            ctx.receipts = res;
            ctx.total = megaTotal;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                closeReceipt: './templates/common/closeReceipt.hbs'
            }).then(function () {
                this.partial('./templates/viewReceipts.hbs');
            });
        })
        .catch(auth.handleError);

};

handlers.checkOutAction = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/homepage');
        return;
    }

    ctx.username = auth.getUsername();

    let receiptId = sessionStorage.getItem('receiptId');
    let active = false;
    let productsCount = 0;
    let total = 0;

    crudService.getEntriesById(receiptId)
        .then((entries) => {
            productsCount = entries.length;
            entries.forEach((e) => {
                total += Number(e.price) * Number(e.qty);
            });

            crudService.commitReceipt(receiptId, active, productsCount, total)
                .then((res) => {
                    notifications.showInfo('Receipt closed!');
                    ctx.redirect('#/homepage');
                })
                .catch(auth.handleError);
        })
        .catch(auth.handleError);

};

handlers.detailPage = function (ctx) {
    if (!auth.isAuthed()) {
        ctx.redirect('#/homepage');
        return;
    }

    ctx.username = auth.getUsername();
    let receiptId = ctx.params.receiptId;

    crudService.receiptDetails(receiptId)
        .then((res) => {
            crudService.getEntriesById(receiptId)
                .then((entries) => {
                    entries.forEach((e) => {
                        e.subtotal = (Number(e.price) * Number(e.qty)).toFixed(2);
                    });

                    ctx.receipts = entries;

                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        detail: './templates/common/detail.hbs'
                    }).then(function () {
                        this.partial('./templates/detailView.hbs');
                    });
                });
        })
        .catch(auth.handleError);
};