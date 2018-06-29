var current_user_id;
var current_role_id;
var is_first = true;
var index_req;
function loginFromPUPlugin( extra_params ) {

	current_user_id 	=	$(".connect_user_id").val();
	current_role_id		=	$(".connect_role_id").val();
	if(current_role_id != '603696') {
      $("#section_id_role,#section_id_operation").addClass('hide');
  } else {
      $("#section_id_role,#section_id_operation").removeClass('hide');
  }
	if(parseInt(current_user_id) > 0) {
		index_req = 1;
		var default_section_index = 'requirement';
		var parsed_all_settings = all_settings;
		if(typeof extra_params != 'undefined') {
			if(typeof extra_params.section_index != 'undefined') {
				default_section_index = extra_params.section_index;
			}
		}
		var params = {
			data: parsed_all_settings[default_section_index]['settings']
		};
		if(!is_first) {
			params.action = 'other';
		}
		if(typeof extra_params != 'undefined') {
			$.extend(params.data, extra_params);
		}
		var callback_params = {data: params, callback: loadView};
		showFullLoader('full_page_loader', callback_params);
		$("#leftMenuBar").removeClass("leftMenuBarHide").addClass("leftMenuBarShow");
	} else if(current_user_id == '') {
		index_req = 2;
		if(typeof flyoutModule != 'undefined') {
			var flyoutElement = $(flyoutModule.properties.flyoutWrapper);
			flyoutModule.removeOldFlyout();
		}
		$("#dealForm").html("");
		$("#leftMenuBar").removeClass("leftMenuBarShow").addClass("leftMenuBarHide");
		createRootMenus();
	}
		$("#menu_wraper").removeClass('hide');
		$('.slideToLeftNav').trigger('click');
		

		setTimeout(function(){
				if(index_req == 1)
				{
					index_req = 3;
					$('.dropdown.users-role').html('<a data-toggle="dropdown" href="javascript:void(0);" class="select-user-role"><span class="changed-user-role" data-roleid="">MarineMax . Guest</span><span id="dd_img_pu_plugin" style="display:none;" class="caret-img"><img src="http://pu.testing.prospus.com/puidata/img/down_arrow.png" class="img-responsive"></span></a><ul id="user-roles-ul" class="dropdown-menu select-user-role" role="menu" aria-labelledby="dLabel"></ul>');
                    var login_role_id = '';
                    $("#section_id_requirement").trigger('click');
                    setTimeout(function(){
                    	$("#addMenuListDiv").removeClass('hide');

                    },3000);
                    
					
					
				}
		},5000);
}
function createRootMenus() {
	
	var menuContainer = $("#leftMenuBar");
	menuContainer.html('');
	// create menu dynamically from settings.json file
	var menuTmpl = $('#left-menu-template');
	for(var section in all_settings) {
		if(section!="deal"){
		var clonedTmpl = menuTmpl.find('a').clone();

		clonedTmpl.attr('id', 'section_id_'+section).addClass(all_settings[section]['class']);
		clonedTmpl.find('.menu-icon').addClass((all_settings[section]['class'].length) ? section+' leftPane-icon' : 'leftPane-icon');
		clonedTmpl.find('.section-id').attr('data-section-id', section).text(all_settings[section]['label']);
		menuContainer.append(clonedTmpl);
	}
	}

	$("#leftMenuBar a").off('click').on("click", function() {
		addClickHandler($(this));
	});
}
function addClickHandler(clicked_element) {
	var menuContainer = $("#leftMenuBar");
	var getid = clicked_element.attr('id');
	if(getid == 'section_id_dashboard') {
		$("#menu_wraper").removeClass('hide');
		$('.slideToLeftNav').trigger('click');
	}
	var dataSectionId = clicked_element.find('span').data('sectionId');
	if(dataSectionId != 'deal') {
		leftNavigationModule.cache.show_sidebar_flyout = false;
	}
	var parsed_all_settings = all_settings;
	var params = {
		action: 'other',
		data: parsed_all_settings[dataSectionId]['settings']
	};
	var callback_params = {data: params, callback: loadView};
	showFullLoader('full_page_loader', callback_params);
	menuContainer.find("a").removeClass("active");
	clicked_element.addClass("active");
}

$(document).ready(function() {

	var menuContainer = $("#leftMenuBar");
	createRootMenus();

	// section ends here

	$("#leftMenuBar a").off('click').on("click", function() {
		addClickHandler($(this));
	});
});

var load_view_xhr = null;
function loadView(data) {

	if(typeof flyoutModule != 'undefined') {
		var flyoutElement = $(flyoutModule.properties.flyoutWrapper);
		flyoutModule.removeOldFlyout();
	}
	$.keep_showing_full_page_loader = true; // means page is being reloaded by ajax call so do not let 'full loader' hide automatically.
	data.userId = current_user_id;
	data.roleId = current_role_id;

	load_view_xhr = $.ajax({
		url: api_path,
		type: 'post',
		data: data,
		beforeSend: function() {
			if(load_view_xhr !== null) {
				load_view_xhr.abort();
				load_view_xhr = null;
			}
		},
		success: function(response) {
			$('#drop-overlay-js').remove();
			var dealForm = $("#dealForm");
			dealForm.html(response);

			is_first = false;

			if(typeof _init == 'function') {
				_init();
				flyoutModule._init();
				BreadcrumbModule._init();
				searchModule._init();
				leftNavigationModule.init();
				searchModule.resetSearchInput();
				middlePaneViewModule.init();
				jsGrid.start();
			}
		}
	});
}

function loadMenuListByAjax() {}
function responseListHeader() {}
function responseListContent() {}
function getListHeaders() {}
function getListContent() {}

function isFullPageLoaderShowing() {
	return $("#full_page_loader:visible").length;
}

function showFullLoader(id, params) {

	if(isFullPageLoaderShowing()) { // As per new requirement, do not show any other loader if full page loader is showing.

		if(typeof params == 'object') {
				params.callback(params.data);
		}
		return true;
	}
	var element = $('#' + id);
	if(!element.length && typeof params == 'object') {
		params.callback(params.data);
	}
	if(element.is(':visible')) { // if loader is visible then do not show it again.
		return true;
	}
	element.fadeIn( 500, function() {
		if(typeof params == 'object') {
				params.callback(params.data);
		}
	});
}


function hideFullLoader(id) {
	// console.trace();
	if(id == 'full_page_loader' && $.keep_showing_full_page_loader === true) {
			console.log('do not hide "#full_page_loader"');
	} else {
			var element = $('#' + id);
			if(element.is(':visible')) { // fadeout the loader only when it is visible
					element.fadeOut( 500 );
			}
	}
}
