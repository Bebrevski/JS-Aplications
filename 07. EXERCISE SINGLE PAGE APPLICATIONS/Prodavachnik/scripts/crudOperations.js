const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_BJdx1VZsG';
const APP_SECRET = '3ee0e1558e074e60b8a200ac3d41b5e1';
const AUTH_HEADERS = {'Authorization': 'Basic ' + btoa(APP_KEY + ':' + APP_SECRET)};


function loginUser() {
    let username = $('#formLogin input[name=username]').val();
    let password = $('#formLogin input[name=passwd]').val();

    $.ajax({
        method: "POST",
        headers: AUTH_HEADERS,
        url: BASE_URL + "user/" + APP_KEY + '/login',
        data: {username, password}
    }).then(function (res) {
        signInUser(res, 'Login successful.');
    }).catch(handleAjaxErrors);
}

function registerUser() {
    let username = $('#formRegister input[name=username]').val();
    let password = $('#formRegister input[name=passwd]').val();

    $.ajax({
        method: "POST",
        url: BASE_URL + 'user/' + APP_KEY + "/",
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        signInUser(res, "Registration successful.");
    }).catch(handleAjaxErrors);
}

function listAds() {
    $.ajax({
        method: "GET",
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads',
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        showView('viewAds');
        displayAds(res);
    }).catch(handleAjaxErrors);
}

function createAd() {
    let title = $('#formCreateAd input[name=title]').val();
    let description = $('#formCreateAd textarea[name=description]').val();
    let date = $('#formCreateAd input[name=datePublished]').val();
    let price = $('#formCreateAd input[name=price]').val();
    Number(price);
    let publisher = sessionStorage.getItem('username');
    $.ajax({
        method: "POST",
        url: BASE_URL + "appdata/" + APP_KEY + `/ads`,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {title, description, publisher, date, price}
    }).then(function (res) {
        listAds();
        showInfo('Advertisement created.')
    }).catch(handleAjaxErrors);
}

function deleteAd(ad) {
    $.ajax({
        method: "DELETE",
        url: BASE_URL + "appdata/" + APP_KEY + '/ads/' + ad._id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
    }).then(function (res) {
        listAds();
        showInfo('Advertisement deleted!');
    }).catch(handleAjaxErrors);
}

function loadAdForEdit(ad) {
    showView('viewEditAd');
    $('#formEditAd input[name=id]').val(ad._id);
    $('#formEditAd input[name=title]').val(ad.title);
    $('#formEditAd textarea[name=description]').val(ad.description);
    $('#formEditAd input[name=datePublished]').val(ad.date);
    $('#formEditAd input[name=price]').val(ad.price);

}

function editAd() {
    let id = $('#formEditAd input[name=id]').val();
    let title = $('#formEditAd input[name=title]').val();
    let description = $('#formEditAd textarea[name=description]').val();
    let publisher = sessionStorage.getItem('username');
    let date = $('#formEditAd input[name=datePublished]').val();
    let price = $('#formEditAd input[name=price]').val();

    $.ajax({
        method: "PUT",
        url: BASE_URL + 'appdata/' + APP_KEY + '/ads/' + id,
        headers: {'Authorization': 'Kinvey ' + sessionStorage.getItem('authToken')},
        data: {title, description,publisher, date, price}
    }).then(function (res) {
        listAds();
        showView('viewAds');
        showInfo('Advertisement edited!');
    }).catch(handleAjaxErrors);
}

function logoutUser() {
    sessionStorage.clear();
    showHomeView();
    showHideMenuLInks();
    showInfo('Logout successful.');
}

function signInUser(res, message) {
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);
    showHomeView();
    showHideMenuLInks();
    showInfo(message);
}

function displayAds(ads) {
    let firstTableRow = $(`
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Publisher</th>
                    <th>Date Published</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>`);

    let table = $('#ads > table');
    table.empty().append(firstTableRow);

    for (let obj of ads) {
        let tr = $('<tr>');
        tr.append($(`<td>${obj.title}</td>`))
            .append($(`<td>${obj.description}</td>`))
            .append($(`<td>${obj.publisher}</td>`))
            .append($(`<td>${obj.date}</td>`))
            .append($(`<td>${obj.price}</td>`));

        if (obj._acl.creator === sessionStorage.getItem('userId')) {
            $(tr).append(
                $('<td>')
                    .append($('<a href="#">[Edit]</a>').click(function () {
                        loadAdForEdit(obj);
                    }))
                    .append($('<a href="#">[Delete]</a>').click(function () {
                        deleteAd(obj);
                    })));
        }

        table.append(tr);
    }
}

function handleAjaxErrors(res) {
    let errorMsg = JSON.stringify(res);
    if (res.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (res.responseJSON && res.responseJSON.description)
        errorMsg = res.responseJSON.description;
    showError(errorMsg)
}