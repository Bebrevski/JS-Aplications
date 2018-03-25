function getInfo() {
    const id = $('#stopId');

    let stopID = id.val();
    let url = `https://judgetests.firebaseio.com/businfo/${stopID}.json`;
    $.ajax({
        method: 'GET',
        url: url,
        success: handleRequest,
        error: handleError
    });

    id.val('');

    function handleRequest(req) {
        $('#buses').empty();
        $('#stopName').text(`${req.name}`);
        let ul = $('#buses');
        let li;
        for (let bus in req.buses) {
            li = $('<li>').text(`Bus ${bus} arrives in ${req.buses[bus]} minutes`);
            ul.append(li);
        }
    }

    function handleError(res) {
        $('#buses').empty();
        $('#stopName').text(`Error`);
    }
}