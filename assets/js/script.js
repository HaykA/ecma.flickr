/**
 * Created by Hayk on 20/03/2017.
 */

/**
 * ► GLOBAL VARIABLES ◄
 */
var CURRENT = {
    tags: undefined,
    page: 1,
    lastPage: 0,
    url: undefined
};
var PER_PAGE = 20;
var KEY = "bfd715ff765af2345d9ef4fb8ed20777";
var IMAGE_SEARCH_URL = "https://api.flickr.com/services/rest?method=flickr.photos.search&api_key=" + KEY
    + "&per_page=" + PER_PAGE + "&format=json&nojsoncallback=1&tags=";

var IMAGE_URL = "https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}.jpg";
var THEME = ["flickr-blue", "flickr-pink"];


/**
 * ► GENERAL (EVENTS AND FUNCTIONS) ◄
 */
var preventSubmit = function (e) {
    e.preventDefault();
};

/**
 * ► PERFUME ◄
 */
var getRandomTheme = function () {
    var bit = ~~(Math.random() * 2);
    return THEME[bit];
};

var randomizeTheme = function (e) {
    $('body').removeClass('flickr-pink').removeClass('flickr-blue').addClass(getRandomTheme());
};

var toggleTheme = function (e) {
    var $hcf = $('#hcf');
    if ($hcf != undefined) {
        var $body = $('body');
        var themeUrl = 'assets/frameworks/hcf/haykscompactframework-theme-dark_3.0.1-a.css';
        var $dark = $('#dark');
        if ($body.hasClass('dark')) {
            if ($dark != undefined && $dark.attr('href') == themeUrl) {
                $dark.remove();
                $body.removeClass('dark').addClass('bright');
            }
        } else if ($body.hasClass('bright')) {
            if ($dark == undefined || $dark.attr('href') != themeUrl) {
                $dark = $('<link>').attr({
                    id: "dark",
                    rel: "stylesheet",
                    type: "text/css",
                    href: themeUrl
                });
                $hcf.after($dark);
                $body.removeClass('bright').addClass('dark');
            }

        }
    }
};

/**
 * ► BEFORE AJAX ◄
 */

// ▬ Search bar
var requestPhotos = function (e) {
    $(this).blur();
    var tags = $('#tags');
    tags.val(tags.val().trim());
    CURRENT.tags = tags.val();
    if (CURRENT.tags != undefined && CURRENT.tags.length > 0) {
        CURRENT.url = IMAGE_SEARCH_URL + CURRENT.tags;
        getImagesFromFlickr(CURRENT.url);
    } else {
        tags[0].focus();
    }
};

// ▬ Pagination
var checkPageValue = function (e) {
    $('.page').val($(this).val());
    var page = $(this).val();
    var $go = $('.switch-page-button');
    var enabled = page != undefined && !isNaN(page)
        && (page >= 1 && page <= CURRENT.lastPage)
        && page != CURRENT.page;
    $go.prop("disabled", !enabled);
};

var goToSelectedPage = function (e) {
    goToPage(e, $('.page').val());
};

var goToPreviousPage = function (e) {
    goToPage(e, CURRENT.page - 1);
};

var goToNextPage = function (e) {
    goToPage(e, CURRENT.page + 1);
};

var goToFirstPage = function (e) {
    goToPage(e, 1);
};

var goToLastPage = function (e) {
    goToPage(e, CURRENT.lastPage);
};

var goToPage = function (e, page) {
    e.preventDefault();
    var url = CURRENT.url + "&page=" + page;
    $('#tags').val(CURRENT.tags);
    getImagesFromFlickr(url);
};

// ▬ AJAX Cover
var showAjaxCover = function () {
    var $icon = $('<i class="fa fa-fw fa-5x fa-spinner fa-pulse">');
    var $spinner = $('<div class="spinner">').append($icon);
    $('.ajax-cover').empty().append($spinner).show();
};

var hideAjaxCover = function (e) {
    $('.ajax-cover').empty().hide();
};

var resetBeforeSearchingOnFlickr = function () {
    $('.result').empty();
    $('.pagination').empty();
};

/**
 * ► AJAX REQUESTS ◄
 */
var getImagesFromFlickr = function (url) {
    if ($('#photos-with-location:checked').length > 0) {
        url += "&has_geo=1";
    }
    showAjaxCover();
    randomizeTheme();
    resetBeforeSearchingOnFlickr();
    $.ajax({
        url: url,
        dataType: "json"
    }).done(function (data) {
        hideAjaxCover();
        updateCurrent(data);
        showResult(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        hideAjaxCover();
        alert(errorThrown); // TODO append alert
    });
};

/**
 * ► AFTER AJAX ◄
 */
var updateCurrent = function(data) {
    CURRENT.page = data.photos.page;
    CURRENT.lastPage = data.photos.pages;
};

var showResult = function (data) {
    if (CURRENT.lastPage > 0) {
        fillImages(data);
        addPagination(data);
    } else {
        var title = $('<p>').html($('<i class="fa fa-fw fa-thumbs-down">')).append(" No Results");
        appendAlert('Unfortunately, nothing found! Sorry.', title);
    }
};

var appendAlert = function (message, title) {
    var $closeButton = $('<button type="button" class="button button-s button-s-fw" aria-label="slideaway">')
        .html($('<i class="fa fa-close"></i>'));
    var $alert = $('<div class="alert" aria-label="closable">').append($closeButton);
    if (title != undefined) {
        var $title = $('<p class="strong">').html(title);
        $alert.append($title);
    }
    var $message = $('<p>').html(message);
    $alert.append($message);
    $('#results').html($alert);
};

var fillImages = function (data) {
    var $gallery = $('#results').empty();
    data.photos.photo.forEach(function (photo) {
        appendImageToResultList($gallery, photo);
    });
};

var appendImageToResultList = function ($gallery, photo) {
    var imageUrl = IMAGE_URL.replace("{farm-id}", photo.farm)
        .replace("{server-id}", photo.server)
        .replace("{id}", photo.id)
        .replace("{o-secret}", photo.secret);
    var title = photo.title;
    if (title == undefined || (title = title.trim()).length == 0) {
        title = "Untitled";
    }
    var $caption = $('<figcaption>').text(title);

    var $thumbnail = $('<img>').attr({
        id: photo.id,
        alt: title,
        src: imageUrl,
        title: title,
        "data-owner": photo.owner
    });
    var $figure = $('<figure>').append($thumbnail).append($caption);
    var $a = $('<a href="#" data-modal="#details" data-triggers="showmodalonclick">')
        .append($figure);
    $gallery.append($a);
};

var addPagination = function (data) {
    var $pagination = $('.pagination').empty();
    var buttonCss = "button button-s ghost";
    var fwButtonCss = buttonCss + " button-s-fw";
    addPageToPagination($pagination, 1, buttonCss + " first", CURRENT.page == 1);
    addControlToPagination($pagination, $('<i class="fa fa-chevron-left">'), fwButtonCss + " previous", CURRENT.page == 1);
    addPageInputToPagination($pagination, fwButtonCss + " switch-page-button");
    addControlToPagination($pagination, $('<i class="fa fa-chevron-right">'), fwButtonCss + " next", CURRENT.page == CURRENT.lastPage);
    // addPageToPagination($ul, CURRENT.lastPage, "last", CURRENT.page == CURRENT.lastPage);
};

var addPageToPagination = function($pagination, page, cssClass, disabled) {
    var $button = $('<button>').attr({
        type: "button",
        class: cssClass
    }).prop("disabled", disabled).html(page);
    $pagination.append($button);
};

var addControlToPagination = function ($pagination, $icon, cssClass, disabled) {
    var $button = $('<button>').attr({
        type: "button",
        class: cssClass
    }).prop("disabled", disabled).html($icon);
    $pagination.append($button);
};

var addPageInputToPagination = function($pagination, cssClass) {
    var $page = $('<input>').attr({
        type: "number",
        class: "textbox box-s page",
        name: "page",
        min: 1,
        max: CURRENT.lastPage,
        value: CURRENT.page
    });
    var $icon = $('<i class="fa fa-refresh">');
    var $go = $('<button>').attr({
        type: "button",
        class: cssClass
    }).prop("disabled", true)
        .append($icon);
    $pagination.append($page).append($go);
};

/**
 * ► LOCATION ◄
 */
var filterResults = function (e) {
    if (!$(this).is(':checked') || CURRENT.lastPage > 0) {
        $('#search-button').trigger("click");
    }
};

/**
 * ► INITIALIZATION ◄
 */
var init = function () {
    randomizeTheme();
    $('#search-button').on('click', requestPhotos);
    $('#flickr-search').on('submit', preventSubmit);
    $('.pagination').on('click', '.switch-page-button', goToSelectedPage)
        .on('change', '.page', checkPageValue)
        .on('keyup', '.page', checkPageValue)
        .on('click', '.previous', goToPreviousPage)
        .on('click', '.next', goToNextPage)
        .on('click', '.first', goToFirstPage)
        /* .on('click', '.last', goToLastPage) */;
    $('.logo').on('mouseenter', randomizeTheme);
    $('#photos-with-location').on('change', filterResults);
    $('.toggletheme').on('click', toggleTheme);
};

$(document).ready(init);