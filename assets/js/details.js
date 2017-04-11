/**
 * Created by Hayk on 23/03/2017.
 */
var GMAP_KEY = "AIzaSyAU6H9Opm2BhR5Sbov0UqapnJ6sT7E-NCI";
var OWNER_SEARCH_URL = "https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=" + KEY
    + "&user_id={owner}&format=json&nojsoncallback=1";
var LOCATION_SEARCH_URL = "https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=" + KEY
    + "&photo_id={image-id}&format=json&nojsoncallback=1";

var LOCATION = {
    lat: Infinity,
    lng: Infinity,
    initialized: false
};

/**
 * ► BEFORE AJAX ◄
 */
var showDetails = function (e) {
    e.preventDefault();
    var $figure = $(this).find('figure');
    $figure.find('img').removeAttr('style');
    var $a = $('<a>').attr({
        href: $figure.find('img').attr('src'),
        target: "_blank"
    }).html($figure.clone());
    $('#photo').html($a);
    findAllDetails($figure.find('img'));
};

var findAllDetails = function ($img) {
    var imageId = $img.attr('id');
    var owner = $img.data('owner');
    getUserFromFlickr(owner);
    getLocationFromFlickr(imageId);
};

/**
 * ► IMAGE DETAILS... ◄
 */


var resetTablist = function () {
    var $tablist = $('#details').find('li[data-tab]');
    $tablist.removeAttr('class');
    $tablist.parent().find('li[data-tab="#photo"]').addClass('active');
};

var resetLocationAttributes = function () {
    LOCATION.lat = Infinity;
    LOCATION.lng = Infinity;
    LOCATION.initialized = false;
};

var resetTabPanel = function () {
    var $details = $('#details');
    $details.find('[role=tab]').removeAttr('class');
    $('#photo').addClass('active').empty();
    $('#google-map').empty();
    $details.find('[style]').removeAttr('style');
    $('.author-name').html('&nbsp;');
    $('.username .span').empty();
    $details.find('[data-tab="#location"]').hide();
    $details.find('[data-tab="#photo"]').addClass('active');
};

/**
 * ► USER DETAILS ◄
 */
var getUserFromFlickr = function (owner) {
    var url = OWNER_SEARCH_URL.replace('{owner}', owner);
    $.ajax({
        url: url,
        dataType: "json"
    }).done(function (data) {
        fillUserDetails(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown); // TODO append alert
    });
};

var fillUserDetails = function (data) {
    var realname;
    var username = data.person.username._content;
    if (data.person.realname == undefined || data.person.realname._content.length == 0) {
        realname = username;
    } else {
        realname = data.person.realname._content;
    }
    $('.author-name').html(realname);
    $('.username a').attr('href', data.person.profileurl._content)
        .find('span').html(username);
};


/**
 * ► LOCATION ◄
 */
var getLocationFromFlickr = function (imageId) {
    var url = LOCATION_SEARCH_URL.replace('{image-id}', imageId);
    $.ajax({
        url: url,
        dataType: "json"
    }).done(function (data) {
        fillLocationDetails(data);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        alert(errorThrown); // TODO append alert
    });
};

var fillLocationDetails = function (data) {
    if (data.stat === "ok") {
        LOCATION.lat = parseInt(data.photo.location.latitude);
        LOCATION.lng = parseInt(data.photo.location.longitude);
        $('#details').find('[data-tab="#location"]').show();
    } else {
        resetLocationAttributes();
    }
};

var loadGoogleMap = function (e) {
    if ($('#location').is(':visible') && !LOCATION.initialized) {
        showGoogleMap();
    }
};

var showGoogleMap = function (e) {
    if (LOCATION.lat != Infinity && LOCATION.lng != Infinity) {
        var uluru = {
            lat: LOCATION.lat,
            lng: LOCATION.lng
        };
        var mapOptions = {
            zoom: 7,
            center: uluru,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

        google.maps.event.trigger(map, "resize");
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
        LOCATION.initialized = true;
    }
};

var resetMap = function (e) {
    if (LOCATION.initialized) {
        LOCATION.initialized = false;
    }
};

var resetLocation = function () {
    resetTablist();
    resetTabPanel();
    resetLocationAttributes();
};


/**
 * ► INITIALIZATION ◄
 */
var initDetails = function () {
    $('#details').on('modal.hide', resetLocation);
    $('#location').on('initialized', loadGoogleMap);
    $('.gallery').on('click', 'a', showDetails);
    $(window).on('resize', resetMap);
};

$(document).ready(initDetails);