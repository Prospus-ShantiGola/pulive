define(function () {
    var properties = {
        flyoutWrapper: '#j_my_search',
        searchBox: '.flyout_searchbox',
        flyoutBody: '.flyoutBodyJs',
        flyoutActionWrapper: '.flyoutActionJs',
        searchButton: '.flyuot_search',
        selectButton: '.flyuot_select',
        closeButton: '.j_my_search_close',
        listUl: '#actor_ul',
        activeLi: '#actor_ul li.active',
        place: '#placeId',
        cache: {}
    }
    function makeFlyoutVisible() {
        $(properties.flyoutWrapper).show();
    }
    function hideFlyout() {
        $(properties.flyoutWrapper).hide();
    }
    function resetFlyout() {
        properties.cache = {};
        resetSearchBox();
        resetUlList();
    }
    function manageFlyoutHtmlContent(action){
        var ele     = $(properties.flyoutBody + ' ' + properties.searchBox);
        var ele1    = $(properties.flyoutActionWrapper + ' ' + properties.searchButton);
        var ele2    = $(properties.flyoutActionWrapper + ' ' + properties.selectButton);
        if(action == 'hide'){
            (ele).closest('.jq_flyout_topbar').addClass('hide');
            ele.addClass('hide');
            ele1.addClass('hide');
            ele2.addClass('hide');
        }
        if(action == 'show'){
            (ele).closest('.jq_flyout_topbar').removeClass('hide');
            ele.removeClass('hide');
            ele1.removeClass('hide');
            ele2.removeClass('hide');
        }

    }
    function resetSearchBox() {

        $(properties.flyoutBody + ' ' + properties.searchBox).val('');
    }
    function resetUlList() {
        $(properties.listUl).html('');
    }
    function getSearchText() {
        return $.trim($(properties.flyoutBody + ' ' + properties.searchBox).val());
    }
    function setClickLocation(placeId,search_role_id) {
        properties.cache.placeId = placeId;
        properties.cache.search_role_id = search_role_id;
    }
    var search_string_xhr = null;
    function searchString() {
        var searchText = getSearchText();

        toggleActionButton('add');
        if (!searchText) {
            return false;
        }
        properties.cache.searchString = searchText;
        search_string_xhr = $.ajax({
            url: base_plugin_url + 'code.php',
            data: {'action': 'searchActor', 'search_string': searchText, 'domain_name': userDomainName,'search_role_id':properties.cache.search_role_id},
            beforeSend: function() {
                if(search_string_xhr !== null) {
                    search_string_xhr.abort();
                    search_string_xhr = null;
                }
            },
            success: responseSearchActor,
            dataType: 'json'
        });
        // $.post(base_plugin_url + 'code.php', {'action': 'searchActor', 'search_string': searchText, 'domain_name': userDomainName}, responseSearchActor, 'json');
    }
    function liClick(obj) {
        $(properties.activeLi).removeClass('active');
        obj.addClass('active');
        toggleActionButton('remove');
        console.log(obj.text());
    }
    function toggleActionButton(action) {
        var ele = $(properties.flyoutActionWrapper + ' ' + properties.selectButton);
        ele.removeClass('inactive');
        if (action == 'add') {
            ele.addClass('inactive');
        }

    }
    function addHighlight(obj) {
        if (properties.cache.searchString && obj.find('.no-record-list').length == 0) {
            obj.highlight(properties.cache.searchString);
        }
    }
    function selectListItem() {
        var activeLi = $(properties.activeLi);
        var userName = $.trim(activeLi.find('.list-user-name').text());
        var userId = activeLi.data('userid');
        var placeId = properties.cache.placeId;
        if( $('#'+placeId).is('input')) {
            $('#'+ placeId).val(userName);
        } else {
            $('#'+ placeId).text(userName).addClass("newUserRole");
        }
        var propId = placeId.split('_').pop();
        $('#mapping_actor_ids_' + propId).val(userId);
        $('.user-action-wrap .save-role').removeClass('inactive');
        $(properties.closeButton).trigger('click');
        //console.log(userName);
    }
    function _init() {

        var element = $(properties.flyoutWrapper + ' ' + properties.searchButton);
        $(properties.flyoutWrapper + ' ' + properties.searchBox).off('keyup.search_box').on('keyup.search_box', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                element.trigger('click');
            }
        })

//        $(properties.flyoutWrapper + ' ' + properties.searchBox).keyup(function (event) {
//            var keycode = (event.keyCode ? event.keyCode : event.which);
//            if (keycode === 13) {
//                element.trigger('click');
//            }
//        });
        element.off('click.flyout').on('click.flyout', function () {
            searchString();
        });

        $(properties.listUl).on('click', 'li', function () {
            if ($(this).hasClass("noEntry")) {
                return false;
            }
            liClick($(this));
        });
    }

    function removeOldFlyout_bkp() {

        $("#jq_flyout_background").remove();
        $('#j_my_search_wrapper').attr('id', 'j_my_search_wrapper_bkp').removeClass('jq_flyout_wrapper');
        $('#j_my_search').attr('id', 'j_my_search_bkp').html('');
    }


    function removeOldFlyout() {
        var flyoutSelectors = [
            ['#j_my_search_wrapper', '#j_my_search'],
            ['#j_my_esign_wrapper', '#j_my_esign'],
            ['#j_my_privacydocument_wrapper', '#j_my_privacydocument'],
            ['#j_my_instruction_wrapper', '#j_my_instruction'],
            ['#j_my_createDeal_wrapper', '#j_my_createDeal'],
            ['#j_my_left_flyout_wrapper', '#j_my_left_flyout'],
            ['#j_my_left_flyout_print_wrapper', '#j_my_left_flyout_print'],
            ['#pass_the_deal_wrapper', '#pass_the_deal'],
            ['#j_my_dealLookup_wrapper', '#j_my_dealLookup'],
            ['#j_my_search_exsiting_deal_wrapper', '#j_my_search_exsiting_deal'],
        ];
        if(!flyoutSelectors.length) {
            return true;
        }
        $("#jq_flyout_background, #main-menu-overlay").remove();
        for(var i = 0; i < flyoutSelectors.length; i++) {
            //console.log(flyoutSelectors[i][0]);
            $(flyoutSelectors[i][0]).attr('id', 'j_my_search_wrapper_bkp').removeClass('jq_flyout_wrapper');
            $(flyoutSelectors[i][1]).attr('id', 'j_my_search_bkp').html('');
        }

    }

    return {
        properties: properties,
        searchString: searchString,
        liClick: liClick,
        selectListItem: selectListItem,
        makeFlyoutVisible: makeFlyoutVisible,
        toggleActionButton: toggleActionButton,
        resetFlyout: resetFlyout,
        setClickLocation: setClickLocation,
        addHighlight: addHighlight,
        hideFlyout: hideFlyout,
        _init: _init,
        removeOldFlyout: removeOldFlyout,
        manageFlyoutHtmlContent: manageFlyoutHtmlContent
    }
});
