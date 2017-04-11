/**
 * Created by Hayk on 21/03/2017.
 */

var GAMBLER_ICONS = ["die-one", "die-two", "die-three", "die-four", "die-five", "die-six"];

var getRandomGamblerStyle = function () {
    var id = ~~(Math.random() * GAMBLER_ICONS.length);
    return GAMBLER_ICONS[id];
};

var randomizeGamblerStyle = function () {
    var icon = getRandomGamblerStyle();
    var $icon = $('<i class="fi">').addClass("fi-" + icon);
    $('#gamble-button').html($icon);
};

var disableGamblerControls = function () {
    startGamblerSpinner();
    $('.gambler-spinner').prop("disabled", true);
    disableLogo();
};

var startGamblerSpinner = function () {
    $('.gambler-spinner').find('i').removeClass()
        .addClass('fa fa-fw fa-spinner fa-pulse');
};

var enableGamblerControls = function () {
    $('.gambler-spinner').prop("disabled", false);
    randomizeGamblerStyle();
    enableLogo();
};

var disableLogo = function() {
    $(".logo").off('click', getRandomWord);
};

var enableLogo = function() {
    switchLogoIcon($('<i class="fa fa-flickr">'));
    $(".logo").on('click', getRandomWord);
};

var getRandomWord = function(e) {
    var requestStr = "http://randomword.setgetgo.com/get.php";
    disableGamblerControls();
    $.ajax({
        url: requestStr,
        dataType: "jsonp"
    }).done(function (data) {
        enableGamblerControls();
        $('#tags').val(data.Word);
        $('#search-button').trigger('click');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        enableGamblerControls();
        alert(errorThrown); // TODO append alert
    });

};

var changeLogo = function (e) {
    switchLogoName(' Gamble It!');
};

var resetLogo = function (e) {
    switchLogoName(' Flickr It!');
};

var switchLogoName = function (name) {
    var $logo = $('.logo');
    var $icon = $logo.find('i');
    $logo.html($icon).append(name);
};

var switchLogoIcon = function ($icon) {
    var $logo = $('.logo');
    $logo.find("i").remove();
    var $name = $logo.html();
    $logo.html($icon).append($name);
};

/**
 * ► INITIALIZATION ◄
 */
var initGambler = function () {
    randomizeGamblerStyle();
    $('.logo').on('mouseenter', changeLogo)
        .on('mouseleave', resetLogo);
    $('.gambler').on('click', getRandomWord);
};

$(document).ready(initGambler);