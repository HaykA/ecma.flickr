/**
 * Created by Hayk on 24/03/2017.
 */


var checkRequiredFields = function () {
    if ($(this).val().trim().length == 0) {
        $(this).addClass('required');
    }
};

var hideParent = function (e) {
    e.preventDefault();
    $(this).closest('[aria-label=closable]').hide();
};

var fadeParent = function (e) {
    e.preventDefault();
    $(this).closest('[aria-label=closable]').fadeOut('fast');
};

var slideParent = function (e) {
    e.preventDefault();
    $(this).closest('[aria-label=closable]').slideToggle('fast');
};

var showTooltip = function (e) {
    // $(this).css('position', 'relative');
    var offset = parseInt($(this).data('tooltip-offset'));
    if (isNaN(offset)) {
        offset = 18;
    }
    $('<div class="tooltip"></div>').text($(this).attr($(this).data('tooltip')))
        .appendTo($(this)).fadeIn('fast');
    var $tooltip = $('.tooltip');
    var top = (0 - $tooltip.height() - offset) + 'px';
    var position = {
        top: top,
        left: '50%'
    };
    $tooltip.css(position).css('transform', 'translateX(-50%)');
    $(this).removeAttr('title');
};

var hideTooltip = function (e) {
    $(this).removeAttr('style');
    var $tooltip = $('.tooltip');
    $(this).attr('title', $tooltip.text());
    $tooltip.fadeOut('fast');
    $tooltip.remove();
};

var switchTab = function (e) {
    e.preventDefault();
    var $thisLi = $(this).closest('li');
    if (!$thisLi.hasClass('active')) {
        var $root = $(this).closest('*[role=tablist]');
        var $activeLi = $root.find('li.active');
        var $activeTabpanel = $root.find('*[role=tab].active');
        $activeLi.removeClass('active');
        $thisLi.addClass('active');
        $activeTabpanel.fadeOut('fast', function () {
            $activeTabpanel.removeClass('active');
            var tabId = $thisLi.data('tab');
            var event = jQuery.Event("initializing");
            $(this).trigger(event);
            $(tabId).fadeIn('fast', function () {
                $(this).addClass('active');
                var event = jQuery.Event("initialized");
                $(this).trigger(event);
            });
        });
    }
};

var hoverImage = function (e) {
    var opacity = parseFloat($(this).closest('.gallery').data('fadeto'));
    if (isNaN(opacity)) {
        opacity = 0.33;
    }
    $(this).fadeTo('fast', opacity);
};

var resetHoverImage = function (e) {
    $(this).fadeTo('fast', 1);
};

var showModal = function (e) {
    e.preventDefault();
    var modalId = $(this).data('modal');
    var $modal = $(modalId);
    if ($modal.length == 1) {
        $modal.fadeIn('fast');
        $modal.find('.modal-content').fadeIn();
        $('body').addClass('hide-overflow');
        var event = jQuery.Event("modal.show");
        $modal.trigger(event);
    }
};

var dispatchModal = function (e) {
    $(this).on('click', '[aria-label=close-modal]', hideClosestModal)
        .on('click', hideModalByMouse);
    $(document).on('keydown', hideModalByKeyboard);

};

var releaseDispatchModal = function (e) {
    $(this).off('click', '[aria-label=close-modal]', hideClosestModal)
        .off('click', hideModalByMouse);
    $(document).off('keydown', hideModalByKeyboard);
};

var hideClosestModal = function (e) {
    e.preventDefault();
    hideModal($(this).closest('.modal'));
};

var hideModal = function ($modal) {
    $modal.fadeOut('fast');
    $('body').removeClass('hide-overflow');
    var event = jQuery.Event("modal.hide");
    $modal.trigger(event);
};

var hideModalByMouse = function (e) {
    if ($(e.target).is('.modal')) {
        e.stopPropagation();
        e.preventDefault();
        hideModal($(this));
    }
};

var hideModalByKeyboard = function (e) {
    if (e.keyCode == 27) {
        hideModal($('.modal'));
    }
};

var checkInputs = function () {
    checkCheckboxes();
    checkRadioButtons($('.radio'));
};

var checkCheckboxes = function () {
    $.each($('.checkbox'), function () {
        checkThisCheckbox($(this));
    })
};

var checkCheckbox = function (e) {
    checkThisCheckbox($(this));
};

var checkThisCheckbox = function ($checkbox) {
    var $label = $('label[for=' + $checkbox.attr('id') + ']');
    $label.find('i').remove();
    var label = $label.text();
    if ($checkbox.is(":checked")) {
        $label.html($('<i class="fa fa-fw fa-check-square">'));
    } else {
        $label.html($('<i class="fa fa-fw fa-square-o">'));
    }
    $label.append(label);
};

var checkRadioButtons = function ($group) {
    $.each($group, function () {
        checkThisRadioButton($(this));
    })
};

var checkRadioButton = function (e) {
    checkRadioButtons($('.radio[name=' + $(this).attr('name') + ']'));
};

var checkThisRadioButton = function ($radio) {
    var $label = $('label[for=' + $radio.attr('id') + ']');
    $label.find('i').remove();
    var label = $label.text();
    if ($radio.is(":checked")) {
        $label.html($('<i class="fa fa-fw fa-circle">'));
    } else {
        $label.html($('<i class="fa fa-fw fa-circle-o">'));
    }
    $label.append(label);
};



var initHayksCompactFramework = function () {
    $('.textbox[required]').on('blur', checkRequiredFields);
    $('.tablist-buttons').on('click', 'a', switchTab);
    checkInputs();

    $(document)
        .on('mouseenter', '[data-tooltip=title]', showTooltip)
        .on('mouseleave', '[data-tooltip=title]', hideTooltip)
        //
        .on('mouseenter', '.gallery img', hoverImage)
        .on('mouseleave', '.gallery img', resetHoverImage)
        //
        .on('click', '[aria-label=close]', hideParent)
        .on('click', '[aria-label=slideaway]', slideParent)
        .on('click', '[aria-label=fadeaway]', fadeParent)
        //
        .on('click', '[data-triggers=showmodalonclick]', showModal)
        //
        .on('modal.show', '.modal', dispatchModal)
        .on('modal.hide', '.modal', releaseDispatchModal);
    $('.checkbox').on('change', checkCheckbox);
    $('.radio').on('change', checkRadioButton);
};

$(document).ready(initHayksCompactFramework);