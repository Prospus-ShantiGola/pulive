import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {isUserLoggedIn,highlightActionMenuAccordingly, highlightSearch} from '../functions/common_functions';
import {appendCourseList, updateChatList, changeChatView, showSubscribedApp, startNewProductionCourse, updateCourseList,groupForm,updateSearchString} from '../../actions/actions';

import Menu from './menu';
class Navigation extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

    }
    showCreateNewCourseForm(chat_view_type,production_id) {
        let menudashboard = $("#menudashboard");
        let self = this;
        // menudashboard.find(".tr.current").removeClass('current');
        if (menudashboard.find('.add-new-course-tmpl').length && chat_view_type!="add_new_template") {
            return true;
        }
        $("#react-button-cancel-add-new-dialogue").remove();
        $('.multiple-child').removeClass('multiple-child');
        let currentChatDialogue = {
            change_chat_view: 1,
            currentChatDialogueDetail: {
                chat_view_type: chat_view_type
            }
        };

        if(chat_view_type!="add_new_template"){
            this.props.dispatch(updateChatList({chatItems: {}, chatType: 'Chat'}));
        }
        else{
            this.props.dispatch(startNewProductionCourse({productionID:production_id}));
            $(".LeftFlyoutClose").trigger('click');
        }

        setTimeout(function(){
            self.props.dispatch(changeChatView(currentChatDialogue));
        });


        if (menudashboard.find('.add-new-course-tmpl').length && chat_view_type=="add_new_template") {
            return true;
        }

        let addNewCourseTmpl = '<table class="table table-style table-responsive table-row course-list-table ActiveRow ref-inline">';
        addNewCourseTmpl += '<tbody>';
        addNewCourseTmpl += '<tr class="current add-new-course-tmpl">';
        addNewCourseTmpl += '<td class="ref-td"></td>';
        addNewCourseTmpl += '<td class="ref-td text-italic">Untitled</td>';
        /*  addNewCourseTmpl += '<td class="ref-td"></td>';
          addNewCourseTmpl += '<td class="ref-td"></td>';*/
        addNewCourseTmpl += '<td class="ref-td"></td>';
        addNewCourseTmpl += '</tr></tbody></table>';

        let addNewTmplWrapper = $('<div />').addClass('list-row');
        addNewTmplWrapper.on('click', function (evt) {
            evt.stopPropagation();
            return false;
        });
        $('.no-record').hide();
        addNewTmplWrapper.append(addNewCourseTmpl);

        let currentCourse = menudashboard.find('tr.current');
        currentCourse.removeClass('current');
        currentCourse.closest('.list-row').find('.course-list-detail:first').addClass('hide');
        currentCourse.closest('table.openup').removeClass('openup');
        let target = menudashboard.find('.list-row:first');
        if (target.length) {
            target.prepend(addNewTmplWrapper);
        } else {
            let newWrapper = $('<div />').addClass('courseListJs list-row course-list-panel-additional').append(addNewTmplWrapper);
            newWrapper.insertBefore(menudashboard.find('.no-record:first'));
        }
    }
    showCreateNewGroupForm(){
        this.props.dispatch(groupForm('add_group_form'));
    }
    render() {
        let {menu_list, page_name} = this.props;
        let pageId, active_url_path = this.props.location.pathname;
        if(active_url_path.replace('/pu/', '') == '' || active_url_path.replace('/dev/', '') == '' || active_url_path.replace('/qa/', '') == '' || active_url_path.replace('/sta/', '') == '') {
            active_url_path = '/store';
        }
        if(typeof menu_list == 'string') {
            menu_list = $.parseJSON(menu_list);
        }
        let allowClickMenus = ['Inbox', 'Calendar', 'Resources'];
        return (
            <div className="flex-item left-action-bar " id="navigationPane">

                        <ul>
                            {
                                Object.keys(menu_list).map(function(index) {
                                    let menu = menu_list[index];
                                    if(typeof window.setUserID == 'undefined') {
                                        menu.src = '';
                                        if(allowClickMenus.indexOf(menu.menu_title) > -1) {
                                            menu.allow_click = 1;
                                        }
                                    }
                                    return <Menu menu={menu} key={index} active_url_path={active_url_path}/>
                                })
                            }
                        </ul>

                {this.getShortcutMenuTmpl(menu_list)}
            </div>
        )
    }
    getShortcutMenuTmpl(menu_list) {
        let {page_name, page_id} = this.props;
        if(page_id) {
            page_id = ' ' + $.trim(page_id);
            let activeMenuChildren = menu_list[page_id].child, self = this;
            return (
                <div className="main-menu-wrap">
                    {this.makeFlyoutMenus(activeMenuChildren)}
                    {this.makeShortcutMenus(activeMenuChildren)}
                    {this.makeFlyoutForCourseTemplate()}
                </div>
            )
        }
    }

    displaySubscribedApps(){
        var self = this;
        let app_list = this.props.app_list;
        if(app_list){
            if(typeof app_list=="string"){
                app_list = JSON.parse(app_list);
            }
            var subscribed = false;
            for(var x in app_list){
                if(app_list[x].is_subscribed){
                    if(app_list[x].is_subscribed==1){
                        subscribed = true;
                        break;
                    }
                }
            }

            if(!subscribed){
                return (
                        <li id="defaultSubscribedMessage">No Subscribed Courses</li>
                    )
            }
            else{
                return Object.keys(app_list).map(function(key, index) {
                    let app_name = app_list[key].title1;
                    let icon = app_list[key].icon;
                    let prod_id = app_list[key].production_id;
                    let is_subscribed = app_list[key].is_subscribed;
                    if(is_subscribed){
                        if(is_subscribed==1){
                            return(
                                <li key={index} onClick={event => self.showCreateNewCourseForm.call(self,"add_new_template",prod_id)}>
                                    <div className="left">
                                        <div className="node-content">
                                            <span className="app-icon"><img src={icon}/></span>
                                            <span className="app-name">
                                                <span>{app_name}</span>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                             )
                        }
                    }
                });
            }
        }
    }

    makeFlyoutForCourseTemplate() {
        var self = this;
        return (
            <div>
                <div className="right-popup leftFlyout" id="courseTemplateFlyout">
                    <div className="course-flyout-wrap">
                        <div className="courseflyout">
                            <div className="control-bar">
                                <div className="row">
                                    <div className="col-md-12 left-head">
                                        <div className="block-head block-rightHead">
                                            <span className="main-title-wrap">
                                                <span className="main-title">Courses</span>
                                            </span>
                                            <div className="control-btn-wrap right searchFlyout">
                                                <form>
                                                    <input className="form-control" placeholder="Search" type="text"/>
                                                    <a href="#" className="searchFlyoutOpen"><i className="icon-sm search"></i></a>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="nano course-inner-wrap">
                                <div className="nano-content">
                                    <div className="production-list-pane">
                                        <h3>Subscribed</h3>
                                        <ol className="table-list-style all-users" id="courseTemplateFlyoutList">
                                            {
                                                self.displaySubscribedApps()
                                            }
                                        </ol>
                                    </div>
                                    <div className="production-list-pane top-bdr">
                                        <h3>Suggested courses</h3>
                                        <ol className="table-list-style all-users">
                                            <li>
                                                <div className="left">
                                                    <div className="node-content">
                                                        <span className="app-icon"><img src="public/img/leave-application.png"/></span>
                                                        <span className="app-name">
                                                            <span>Leave Application</span>
                                                            <span className="sm-text">$25.00 / Month</span>
                                                        </span>
                                                        <span className="btn-box"><button className="btn btn-bdr-blue" type="button">Buy</button></span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="left">
                                                    <div className="node-content">
                                                        <span className="app-icon"><img src="public/img/Employee-Management.png"/></span>
                                                        <span className="app-name">
                                                            <span>Employee Mangement</span>
                                                            <span className="sm-text">$.99 / Usage</span>
                                                        </span>
                                                        <span className="btn-box"><button className="btn btn-bdr-blue" type="button">Buy</button></span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="left">
                                                    <div className="node-content">
                                                        <span className="app-icon"><img src="public/img/Employee-Exit.png"/></span>
                                                        <span className="app-name">
                                                            <span>Employee Exit</span>
                                                            <span className="sm-text">$199.00 / Year</span>
                                                        </span>
                                                        <span className="btn-box"><button className="btn btn-bdr-blue" type="button">Buy</button></span>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="left">
                                                    <div className="node-content">
                                                        <span className="app-icon"><img src="public/img/Build-a-course.png"/></span>
                                                        <span className="app-name">
                                                            <span><b>Build a Course</b></span>
                                                        </span>

                                                    </div>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="user-action-wrap">
                            <a className="LeftFlyoutClose" id="courseTemplateFlyout"><i className="icon-sm close"></i><span>Close</span></a>
                            <a id="helpNoderAnchor" href="javascript:void(0)" data-toggle="modal" data-target="#" data-direction="right" className="fixed-btm-icon strat_click1 helpnodeFlyout" data-strat-id="not_ajax" data-original-title="Help"><i className="icon-sm help" data-original-title="" title=""></i><span>Help</span></a>
                        </div>
                    </div>
                </div>
                <div className="menu-flyout-overlay"></div>
            </div>
        )
    }
    makeShortcutMenus(activeMenuChildren) {
        let commonShortcutMenus = [
            {icon_class: 'icon-sm list', menu_title: 'Open Flyut', parent_class: 'menu-flyout-open', common_menu: 1},
            {icon_class: 'icon-sm search', menu_title: 'Search', parent_class: 'menu-flyout-open', common_menu: 1}
        ];
        let shortcut_icons = {
            inbox_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1],
                {icon_class: 'icon-sm dialogue-add', menu_title: 'New course', callback: function() {
                    this.showCreateNewCourseForm('add_new_course');
                }, parent_class: 'separator'},

                {icon_class: 'icon-sm email-add', menu_title: 'New Email', parent_class: 'inactive'},

                {icon_class: 'icon-sm course-add', menu_title: '', id: 'course-template-btn', callback: function() {
                    $("#courseTemplateFlyout").addClass('in');
                    $(".nano").nanoScroller();
                }},
                {icon_class: 'icon-sm course-view', menu_title: 'By course', parent_class: 'separator'},
                {icon_class: 'icon-sm dialogue-view', menu_title: 'By dialogue'},
                {icon_class: 'icon-sm actor-view', menu_title: 'By actor'},

            ],
            store_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1],
                {icon_class: 'icon-sm icon_marketplace', menu_title: 'Our Solutions', parent_class: 'separator active'},
                {icon_class: 'icon-sm course-view', menu_title: 'My Solutions', state_class: 'inactive inactive_allow_click'}
            ],
            group_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1],
                {icon_class: 'icon-sm plus', menu_title: 'Add Group', id: 'group-template-btn', callback:function(){
                    this.showCreateNewGroupForm();
                }}
            ],
            dashboard_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1]
            ],
            product_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1]
            ],
            data_shortcut_icons: [
                commonShortcutMenus[0],
                commonShortcutMenus[1]
            ],
        }

        if(this.props.user_type == 'guest') { // for guest user, show register popup when any link is clicked
            Object.keys(shortcut_icons).map(function(key) {
                Object.keys(shortcut_icons[key]).map(function(inner_key) {
                    let inner_menu = shortcut_icons[key][inner_key];
                    inner_menu.callback = function() {
                        window.location.hash = '#register';
                    }
                });
            });
        }
        let self = this;
        let shortcutIcons = shortcut_icons[this.props.page_name + '_shortcut_icons'];
        if(!shortcutIcons) {
            shortcutIcons = {};
        }
        return (
            <div className="shortcut-icon">
                <ul>
                    {
                        Object.keys(shortcutIcons).map(function(index) {
                            let li_class = shortcutIcons[index].parent_class;
                            li_class = (isUserLoggedIn()) ? li_class : li_class + ' ' + shortcutIcons[index].state_class;
                            let dataFlyout = '';
                            if(shortcutIcons[index].common_menu && self.props.user_type != 'guest') {
                                dataFlyout = 'nav';
                            }
                            return (
                                <li key={index} className={li_class} data-flyout={dataFlyout}>
                                    {
                                        self.getAnchorWithClick(shortcutIcons[index])
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
    getAnchorWithClick(menu) {
        let self = this, iClassName = menu.icon_class;
        if(menu.common_menu) {
            if(menu.callback) {
                return <a data-menu-name={menu.menu_title} href="javascript:void(0)" onClick={e => { menu.callback.call(self)}}><i data-menu-name={menu.menu_title} className={iClassName}></i></a>
            }
            return <a data-menu-name={menu.menu_title} href="javascript:void(0)" ><i data-menu-name={menu.menu_title} className={iClassName}></i></a>
        }
        if(menu.callback) {
            return (
                <a data-menu-name={menu.menu_title} href="javascript:void(0)" id={menu.id} onClick={e => { menu.callback.call(self)}}>
                    <i data-menu-name={menu.menu_title} className={iClassName}></i>
                </a>
            )
        }
        return (
            <a data-menu-name={menu.menu_title} href="javascript:void(0)" id={menu.id} onClick={event => {self.loadPage.call(self, menu.menu_title, event)}}>
                <i data-menu-name={menu.menu_title} className={iClassName}></i>
            </a>
        )
    }
    makeFlyoutMenus(activeMenuChildren) {

        let self = this;
        let searchBoxDisabled = 'input-group-btn';
        if(self.props.page_name != 'inbox'){
            searchBoxDisabled += ' disabled';
        }
        return (
        <div>
            <div className="menu-flyout" id="nav">
                <ul className="left-action-detail-pane custom-scroll">
                    <li>
                        <div className="input-group dashboardSearchJs">
                            <input type="text" className="form-control input-box-field form-box-green-style" placeholder="Search for..." ref="dashboardSearch" onKeyDown={self.searchOnKeydown.bind(self)}/>
                            <span className={searchBoxDisabled}>
                                <button className="btn btn-light-green" type="button" onClick={self.searchLeftBarAction.bind(self)}><i ref="searchIcon" className="icon-sm search"></i></button>
                            </span>
                        </div>
                    </li>
                    <li>
                        <div className="panel-group" id="nav-accordion" role="tablist" aria-multiselectable="true">
                            <div className="panel panel-default">
                                {
                                    (!activeMenuChildren) ? null: Object.keys(activeMenuChildren).map(function(index) {
                                        if(activeMenuChildren[index].is_display == 1) {
                                            let menu = activeMenuChildren[index];
                                            let child = menu.child;
                                            if(!child) {
                                                return null;
                                            }
                                            let groupId = 'heading'+index;
                                            let groupHref = 'Actions'+$.trim(index);
                                            let dataParent = '#accordion'+$.trim(index);
                                            let h4_classes = 'icon-sm ' + menu.icon_class;
                                            return (
                                                <div key={menu.menu_id}>
                                                    <div className="panel-heading" role="tab" id={groupId}>
                                                        <h4 className="panel-title">
                                                            <a role="button" data-toggle="collapse" data-parent={dataParent} href={'#'+groupHref} aria-expanded="true" aria-controls={groupHref}>
                                                                <i className={h4_classes}></i><span>{menu.menu_title}</span>
                                                            </a>
                                                        </h4>
                                                    </div>
                                                    <div id={groupHref} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingActions">
                                                        <div className="panel-body">
                                                            <ul>
                                                                {
                                                                    Object.keys(child).map(function(inner_index) {
                                                                        let disabledClass = (child[inner_index].is_disable) ? 'inactive': '';
                                                                        return (
                                                                            <li key={child[inner_index].menu_id} className={disabledClass}>
                                                                                <a data-menu-name={child[inner_index].menu_title} href="javascript:void(0)" onClick={
                                                                                    event => {self.loadPage.call(self, child[inner_index].menu_title, event)}
                                                                                }>{child[inner_index].menu_title}</a>
                                                                            </li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </li>
                </ul>
                <div className="menu-actionbar">
                    <ul>
                        <li className="menu-flyout-close" data-flyout='nav'><a href="javascript:void(0);"><i className="icon-sm close_icon"></i><span>Close</span></a></li>
                    </ul>
                </div>

            </div>
            <div className="menu-flyout-overlay"></div>
        </div>
        )
    }
    loadPage(inner_menu_title, event) {
        if(this.props.user_type == 'guest') {
            window.location.hash = '#register';
            return true;
        }
        this.makeShortcutIconActive(event.target);
        let clickedMenu = inner_menu_title.replace(/\s+/g, '').toLowerCase();
        let {view_type, page_name} = this.props, self = this;

        if($(".menu-flyout").hasClass("in")){
            $(".menu-flyout-close").trigger('click');
        }
        if($("#courseTemplateFlyout").hasClass("in")){
            $(".LeftFlyoutClose").trigger('click');
        }

        if(view_type != clickedMenu) {

            page_name = page_name.toLowerCase();
            if(page_name == 'inbox') {
                let currentChatDialogue = {change_chat_view: 0, currentChatDialogueDetail: {}};
                self.props.dispatch(changeChatView(currentChatDialogue));

                if(clickedMenu == 'newcourse') {
                    self.showCreateNewCourseForm('add_new_course');
                    return true;
                }
                NProgress.start({position: 'full'});

                $.ajax({
                    url: domainUrl + 'inbox',
                    type: 'post',
                    data: {mode: 0, setUserID: window.setUserID, type: 'json', view_type: clickedMenu},
                    success: function(response) {
                        response = JSON.parse(response);
                        let courseList = response.data.course_list;
                        self.props.dispatch(appendCourseList({course_list: courseList, view_type: clickedMenu}));
                        NProgress.done();
                        applyScroller();
                    }
                });
                return true;
            }
            if(page_name == 'store') {
                let params = {show_subscribed_app: 0};
                if(clickedMenu == 'mysolutions') {
                    params = {show_subscribed_app: 1};
                }
                if(!isUserLoggedIn()) {
                    params = {show_subscribed_app: 0};
                }
                self.props.dispatch(showSubscribedApp(params));
            }


            if(page_name == 'group') {
                if(clickedMenu == 'addgroup') {
                    self.showCreateNewGroupForm();
                    return true;
                }
                return true;
            }
        }
    }
    makeShortcutIconActive(target) {
        if(isUserLoggedIn()) {
            highlightActionMenuAccordingly($(target).data('menu-name'));
            /*let clicked_element = $(target);
            clicked_element.closest('.shortcut-icon').find('.active').removeClass('active');
            clicked_element.closest('li').addClass('active');*/
        }
    }
    searchOnKeydown(event) {
        var $keycode = (event.keyCode ? event.keyCode : event.which);
        if ($keycode == 13 && !event.shiftKey) {
            this.searchLeftBarAction(0);
            return false;
        }
    }
    searchLeftBarAction(pressEnter = 1) {
        let searchIcon = $(this.refs.searchIcon);
        let searchString = this.refs.dashboardSearch.value;
        if (searchString == '' || this.props.page_name != 'inbox') {
            return true;
        }

        let data = {
            'setUserID': window.setUserID,
            'view_type': this.props.view_type,
            'dashboard': searchString,
            'type': 'json'
        }
        let URL = 'menudashboard/index'
        if(searchIcon.hasClass('close_icon') && pressEnter){
            searchIcon.removeClass('close_icon').addClass('search');
            delete data.dashboard;
            searchString = '';
            this.refs.dashboardSearch.value = '';
            URL = 'menudashboard/inbox'
        }else if(searchIcon.hasClass('search')){
            searchIcon.removeClass('search').addClass('close_icon');
        }
        this.makeAjaxCall(data, searchString, URL);
    }

    makeAjaxCall(data, searchString, URL) {
        let self = this;
        NProgress.start({position: 'full'});
        $.ajax({
            url: domainUrl + 'menudashboard/index',
            data: data,
            type: 'POST',
            success: function (response) {
                if (typeof response == 'string') {
                    response = JSON.parse(response);
                }
                self.props.dispatch(updateCourseList({response: {}}));
                self.props.dispatch(updateCourseList({response: response.data.course_list}));
                if(searchString != ''){
                    highlightSearch($('.course-list-panel .list-row .table'),searchString);
                }
                self.props.dispatch(updateSearchString(searchString));
                $(".nano").nanoScroller();
                if($(".menu-flyout").hasClass("in")){
                    $(".menu-flyout-close").trigger('click');
                }
                if($("#courseTemplateFlyout").hasClass("in")){
                    $(".LeftFlyoutClose").trigger('click');
                }
                NProgress.done();
            }
        });
    }

}

const mapStateToProps = (state) => {
    return {
        menu_list: state.menu_list,
        page_name: state.page_name,
        view_type: state.view_type,
        page_id: state.page_id,
        app_list: state.app_list,
        user_type: state.user_type,
    }
}

const ConnectedNavigation = withRouter(connect(mapStateToProps)(Navigation));
export default ConnectedNavigation;
