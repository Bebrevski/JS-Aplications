function attachAllEvents() {
    // Bind the navigation menu links
    $('#linkHome').click(showHomeView);
    $('#linkLogin').click(showLoginView);
    $('#linkRegister').click(showRegisterView);
    $('#linkListAds').click(listAds);
    $('#linkCreateAd').click(showCreateAdView);
    $('#linkLogout').click(logoutUser);

    // Bing the form with submit buttons
    $('#buttonLoginUser').on('click', loginUser);
    $('#buttonRegisterUser').on('click', registerUser);
    $('#buttonCreateAd').on('click', createAd);
    $('#buttonEditAd').on('click', editAd);

    // Bind the info / error boxes
    $('#infoBox, #errorBox').click(function () {
       $(this).fadeOut();
    });

    // Attach AJAX "loading" event listeners
    $(document).on({
        ajaxStart: function() { $('#loadingBox').show() },
        ajaxStop: function() { $('#loadingBox').hide() }
    });
}