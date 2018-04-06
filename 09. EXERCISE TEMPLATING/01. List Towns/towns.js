function attachEvents() {
    $('#btnLoadTowns').click(renderTowns);

    function renderTowns() {
        let townsArray = $('#towns').val()
            .split(',')
            .map(e => ({
                name: e.trim()
            }))
            .filter(e => e.name !== '');

        loadFiles(townsArray)
    }

    async function loadFiles(towns) {
        let source = await $.get('template.hbs');
        let compiled = Handlebars.compile(source);

        let template = compiled({towns});

        $("#root").empty().append(template);
    }
}