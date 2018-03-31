function attachEvents() {

    //Event listeners
    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(viewPostClick);

    //Settings
    const url = `https://baas.kinvey.com/appdata/kid_ryec5Itcf/`;
    const username = 'pesho';
    const password = 'p';
    const BASE_64 = btoa(`${username}:${password}`);
    const AUTH = {'Authorization': 'Basic ' + BASE_64};
    let posts = {};

    //DOM elements
    const list = $('#posts');

    function loadPosts() {
        $.ajax({
            method: 'GET',
            url: url + 'Posts',
            headers: AUTH,
            success: fillSelect,
            error: displayError
        });

        function fillSelect(data) {
            list.empty();
            for (let post of data) {
                $('<option>')
                    .text(post.title)
                    .val(post._id) //Important !!! Appending id to the comment
                    .appendTo(list);
                posts[post._id] = post.body;
            }
        }
    }

    function viewPostClick() {
        let postId = $('#posts').val();

        let selected = $('#posts').find('option:selected').text();
        console.log(selected);
        $('#post-title').text(selected);
        $('#post-body').text(posts[postId]);

        $.ajax({
            url: url + `Comments/?query={"postId":"${postId}"}`,
            headers: AUTH
        })
            .then(function (res) {
                $('#post-comments').empty();
                for (let com of res) {
                    $('#post-comments')
                        .append($(`<li>${com.text}</li>`))
                }
            })
            .catch(displayError);
    }

    function displayError(err) {
        let errorDiv = $("<div>").text("Error: " + err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errorDiv);

        setTimeout(function () {
            $(errorDiv).fadeOut(function () {
                $(errorDiv).remove();
            });
        }, 3000);
    }
}