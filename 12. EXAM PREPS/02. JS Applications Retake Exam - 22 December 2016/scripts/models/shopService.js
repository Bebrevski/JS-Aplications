let shopService = (() => {
    function addToCart(productId) {
        let userId = sessionStorage.getItem('userId');
        let cart;
        let product = {};

        remote.get('appdata', `products/${productId}`, 'kinvey')
            .then((res) => {
                product.name = res.name;
                product.description = res.description;
                product.price = res.price;

                remote.get('user', userId, 'kinvey')
                    .then((userInfo) => {
                        if (userInfo.cart === undefined) {
                            cart = {};
                        } else {
                            cart = userInfo.cart;
                        }

                        //has already purchased that product
                        if (cart.hasOwnProperty(productId)) {
                            cart[productId] = {
                                quantity: Number(cart[productId]['quantity']) + 1,
                                product: product
                            }
                        } else {
                            cart[productId] = {
                                quantity: 1,
                                product: product
                            }
                        }
                        cart[productId]['product'].price *= cart[productId]['quantity'];

                        //update user with new cart
                        userInfo.cart = cart;
                        remote.update('user', userId, 'kinvey', userInfo)
                            .then((res) => {
                                notifications.showInfo('Product has been purchased!');
                            })
                            .catch(auth.handleError);

                    })
                    .catch(auth.handleError);

            })
            .catch(auth.handleError);
    }

    function removeFromCart(productId, target) {
        let userId = sessionStorage.getItem('userId');
        remote.get('user', userId, 'kinvey')
            .then((userInfo) => {
                delete userInfo.cart[productId];
                remote.update('user', userId, 'kinvey', userInfo)
                    .then((res) => {
                        $(target).parent().parent().remove();
                        notifications.showInfo('Product removed from cart!');
                    })
                    .catch(auth.handleError)
            })
            .catch(auth.handleError)
    }

    return {
        addToCart,
        removeFromCart
    }
})();