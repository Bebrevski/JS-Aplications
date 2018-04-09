handlers.showShop = function (ctx) {
    util.getUser(ctx);
    remote.get('appdata', 'products', 'kinvey')
        .then((products) => {
            products.forEach(p => p.price = p.price.toFixed(2));
            ctx.products = products;

            ctx.loadPartials({
                header: './templates/header.hbs',
                footer: './templates/footer.hbs',
                page: './templates/shopPage.hbs'
            }).then(function () {
                ctx.partials = this.partials;
                ctx.partial('./templates/main.hbs')
                    .then(() => {
                        $('button').click((e) => {
                            let productId = $(e.target).attr('data-id');
                            shopService.addToCart(productId);
                        });

                        notifications.showInfo('Products loaded!');
                    });
            });
        }).catch(auth.handleError);
};

handlers.showCart = function (ctx) {
    util.getUser(ctx);

    let userId = sessionStorage.getItem('userId');
    remote.get('user', userId, 'kinvey')
        .then((userInfo) => {
            let products = [];
            for (let product in userInfo.cart) {
                products.push({
                    quantity: userInfo.cart[product].quantity,
                    name: userInfo.cart[product].product.name,
                    description: userInfo.cart[product].product.description,
                    price: Number(userInfo.cart[product].product.price).toFixed(2),
                    _id: product
                })
            }

            ctx.products = products;

            ctx.loadPartials({
                header: './templates/header.hbs',
                footer: './templates/footer.hbs',
                page: './templates/cartPage.hbs'
            }).then(function () {
                ctx.partials = this.partials;
                ctx.partial('./templates/main.hbs')
                    .then(() => {
                        $('button').click((e) => {
                            let productId = $(e.target).attr('data-id');
                            shopService.removeFromCart(productId, e.target);
                        });
                    });
            });
        })
        .catch(auth.handleError);
};