// do not cache below files
var noCacheFilesArr = ['page_module', 'layout', 'utility', 'breadcrumb', 'flyout_module', 'search_module', 'ajax', 'apiReference', 'layout_extended', 'action_module'];

requirejs.config({
    baseUrl: domainUrlApi + 'page_plugin/js/modules',
    // urlArgs: "bust=" + (new Date()).getTime(),
    urlArgs: function (id, url) {

        if (noCacheFilesArr.indexOf(id) !== -1) {
            return (url.indexOf('?') === -1 ? '?' : '&') + (new Date()).getTime();
        }
        return '';

    },
    waitSeconds: 30,
    paths: {
        dotdotdot: '../../component/Ellipses/jquery.dotdotdot',
        mousewheel: '../../component/CustomScroll/jquery.mousewheel.min',
        scrollbar: '../../component/CustomScroll/jquery.mCustomScrollbar.min',
        // bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min',
        jqueryflyout: '../../component/Flyout/jquery.flyout',
        ajax: 'ajax',
        page_module: 'page_module',
        autosize: "../autosize"
    },
    shim: {
        autosize: {
            deps: ["jquery"]
        }
    },
    execute_onload: function () {
        var str = window.location.href.toLowerCase();;
        if(str.indexOf("/mmppc")>-1 || str.indexOf("/ppc")>-1) {
            return true;
        }
        // if active menu is other than 'dashboard' then return true
        if(getActiveSectionId() != 'dashboard') {
          return true;
        }
        return false;
    }
});

define('jquery', function () {
    return $; // Just return the jQuery loaded with `script`.
});

require([
    'action_module',
    'layout_extended',
    'grid/pane-view',
    'grid/js-grid',
    'page_module',
    'layout',
    'utility',
    'breadcrumb',
    'flyout_module',
    'search_module',
    'jquery',
    'mousewheel',
    'scrollbar',
    'jqueryflyout',
    'autosize'
], function (ActionModule, layout_extended, middlePaneViewModule, jsGrid, PageModule, LayoutModule, UtilityModule, BreadcrumbModule, flyoutModule, searchModule, jquery, mousewheel, scrollbar, jqueryflyout, autosize) {

    window.ActionModule = ActionModule;
    middlePaneViewModule.init();
    jsGrid.start();
    LayoutModule._init();
    $.extend(window, LayoutModule);
    $.extend(window, layout_extended);

    window.UtilityModule = UtilityModule;
    window.BreadcrumbModule = BreadcrumbModule;
    window.flyoutModule = flyoutModule;
    window.searchModule = searchModule;
    window.PageModule = PageModule;
    window.middlePaneViewModule = middlePaneViewModule;
    window.jsGrid = jsGrid;
    window.autosize = autosize;
    window.LayoutExtendedModule = layout_extended;

    layout_extended._init();
    flyoutModule._init();
    BreadcrumbModule._init();
    searchModule._init();
    UtilityModule._init();
    if (requirejs.s.contexts._.config.execute_onload()) {
        LayoutModule.loadMenuListByAjax(); // get menus
        LayoutModule.getListHeaders(); // get list header using ajax and then call "responseListHeader()" function"
        LayoutModule.getListContent(); // get list content using ajax and then call "responseListContent()" function"

        if(typeof onLoad_Callback === 'function'){
            onLoad_Callback();
        }
    }

});

define(['dotdotdot'], function (dotdotdot) {
    //console.log('dotdotdot');
});
