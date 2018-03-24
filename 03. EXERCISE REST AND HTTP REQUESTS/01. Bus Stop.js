function getInfo() {
    let stopID = $('#stopId').val();
    let url = `https://judgetests.firebaseio.com/businfo/${stopID}.json`;
    $.ajax({
        method: 'GET',
        url: url,
        success: handle
    })
}