'use strict';

var notepad = (function ($) {

    var mobileMenuButton = '.notepad-mobile-menu a',
        mobileMenuCloseButton = '.notepad-mobile-close-btn',
        mainMenu = '.notepad-menu',
        bgCheckClass = '.bg-check',
        postBgImages = '.bg-img img',
        postCoverImg = '.notepad-post-header .bg-img',

    mobileMenu = function () {
        if($(mainMenu).length) {
            $(mobileMenuButton).on('click', function(e){
                e.preventDefault();
                $(mainMenu).addClass('opened');
            });
            $(mobileMenuCloseButton).on('click', function(e){
                e.preventDefault();
                $(mainMenu).removeClass('opened');
            });
        }
    },

    headerTitlesBackgroundCheck = function () {
        if ($(bgCheckClass).length && $(postBgImages).length) {
            BackgroundCheck.init({
                targets: bgCheckClass,
                images: postBgImages
            });
        }
    },

    postHeaderCoverImg = function () {
        var coverImage = $('[alt=cover-image]');
        if (coverImage.length) {
            $(postCoverImg).append('<img src="' + coverImage.attr('src') + '">');
            coverImage.remove();
        }
    },

    // notepad javascripts initialization
    init = function () {
        postHeaderCoverImg();
        mobileMenu();
        headerTitlesBackgroundCheck();
        $('p:has(> img)').addClass('with-image');
    };

    return {
        init: init
    };

})(jQuery);

(function () {
    notepad.init();
})();