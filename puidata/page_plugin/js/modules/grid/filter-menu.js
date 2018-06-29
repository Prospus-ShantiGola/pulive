$(document).ready(function(){

    var body_ele = $('body');
    body_ele.off('click', '.filter-menu .open-filter-menu').on('click', '.filter-menu .open-filter-menu', function (event) {
        if ($(this).siblings('ul').hasClass('show'))
        {
            $(this).removeClass('active').siblings('ul').removeClass('show');
        }
        else
        {
            $('.open-filter-menu').siblings('ul').removeClass('show');
            $('.open-filter-menu').removeClass('active');
            $('.open-filter-menu').parent('th').siblings('th').children('ul').removeClass('show');
            $('.open-filter-menu').parent('th').siblings('th').children('span').removeClass('active');
            $(this).addClass('active').siblings('ul').addClass('show');
        }
        event.stopPropagation();
    });

    body_ele.off('click', '.filter-menu ul.multi-menu > li').on('click', '.filter-menu ul.multi-menu > li', function (event) {
        if (!($(this).hasClass('parent-item'))) {
            $('ul.multi-menu ul.show-sub-child').remove();
            $(this).siblings('.search-item-wrap').hide();
            $(this).siblings('li').removeClass('active');
            $(this).siblings('li').find('li').removeClass('active');
            $(this).addClass('active');
            event.stopPropagation();
        }
    });

    body_ele.off('click', '.filter-menu ul.multi-menu li li').on('click', '.filter-menu ul.multi-menu li li', function (event) {
        var self = $(this)
        var getData = $(this).html();
        $(this).siblings('li').removeClass('active');
        $(this).closest('li.parent-item').siblings('li').removeClass('active');
        $(this).addClass('active');
        $(this).closest('li.parent-item').addClass('active');
        $(this).closest('li.parent-item').siblings('ul.show-sub-child').remove();
        $(this).closest('li.parent-item').after('<ul class="show-sub-child"><li>' + getData + '</li></ul>').addClass('active');
        $(this).closest('li.parent-item').siblings('.search-item-wrap').show(0, function () {
            self.closest('ul.dropdown-menu.multi-menu.show').find('input').focus();
        });


        event.stopPropagation();
    });

    body_ele.off('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap').on('click', '.filter-menu .show-sub-child, .filter-menu .search-item-wrap', function (event) {
        event.stopPropagation();
    });

    $('body, .entr-filter').on('click', function () {
        if ($('.filter-menu ul.multi-menu').hasClass('show')) {
            $('.filter-menu ul.multi-menu ').removeClass('show');
            $('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
        }
    });

    body_ele.off('click', '.filter-menu input[data-save]').on('keypress', '.filter-menu input[data-save]', function (e) {
        //alert(1);
        var getValue = $(this).data('save');
        if (e.which == 13) {
            $('.' + getValue).closest('.filter-menu ul.multi-menu ').removeClass('show');
            $('.' + getValue).closest('.filter-menu ul.multi-menu ').siblings('span').removeClass('active');
        }
    });

});