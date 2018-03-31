function loadCommits() {
    let username = $('#username').val();
    let repo = $('#repo').val();
    let ulContent = $('#commits');

    $.get(`https://api.github.com/repos/${username}/${repo}/commits`)
        .then(function (req) {
            ulContent.empty();
            for (let commitObj of req) {
                ulContent.append($(`<li>${commitObj.commit.author.name}: ${commitObj.commit.message}</li>`));
            }
        })
        .catch(function (error) {
            ulContent.empty();
            ulContent.append($(`<li>Error: ${error.status} (${error.statusText})</li>`))
        })
}