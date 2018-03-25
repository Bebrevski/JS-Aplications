function attachEvents() {
    let url = `https://message-f3ae9.firebaseio.com/messenger`;

    $('#submit').click(createMessage);
    $('#refresh').click(loadMessage);

    function createMessage() {
        let data = {
            author: $('#author').val(),
            content: $('#content').val(),
            timestamp: Date.now()
        };

        $.post(url + '.json', JSON.stringify(data)).then(loadMessage);
    }
    function loadMessage() {
        $.get(url + '.json').then(displayMessage)
    }

    function displayMessage(req) {
        $('#messages').empty();
        let orderedMessages = {};
        req = Object.keys(req).sort((a, b) => a.timestamp - b.timestamp).forEach(k => orderedMessages[k] = req[k]);

        for (let message of Object.keys(orderedMessages)) {
            $('#messages').append(`${orderedMessages[message].author}: ${orderedMessages[message].content}\n`);
        }
    }

    loadMessage();
}