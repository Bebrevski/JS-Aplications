const url = 'https://phonebook-22e89.firebaseio.com/phonebook';
const person = $('#person');
const phone = $('#phone');

$('#btnLoad').on('click', loadData);
$('#btnCreate').on('click', postData);

function loadData() {
    $('#phonebook').empty();
    $.ajax({
        method: 'GET',
        url: url + '.json'
    }).then(handleSuccess)
        .catch(handleError);

    function handleSuccess(res) {
        for (let key in res) {
            generateLi(res[key].name, res[key].phone, key);
        }
    }
}

function postData() {
    let name = person.val();
    let personPhone = phone.val();

    let data = JSON.stringify({name: name, phone: personPhone});

    $.ajax({
        method: "POST",
        url: url + '.json',
        data: data,
        success: appendElement,
        error: handleError
    });

    person.val('');
    phone.val('');

    function appendElement(res) {
        generateLi(name, personPhone, res.name);
    }
}

function generateLi(name, personPhone, key) {
    let li = $(`<li>${name}: ${personPhone}</li>`)
        .append($('<a href="#"> [Delete]</a>')
            .on('click', function () {
                $.ajax({
                    method: "DELETE",
                    url: `${url}/${key}.json`
                }).then(() => $(li).remove()).catch(handleError);
            }));

    $('#phonebook').append(li);
}

function handleError(err) {
    console.log(err);
}