define(function(){

	var options = {
 	
 		show_list_view_selector: '.show-list-view',
 		show_grid_view_selector: '.show-grid-view',
 		list_wrapper_selector:   '.listViewPane',
 		grid_wrapper_selector:   '.gridViewPane',
 		left_menu_wrapper: 	     '#menu_wraper'
	}


	function listView(){
		$(options.list_wrapper_selector).removeClass('hide');
		$(options.grid_wrapper_selector).addClass('hide');
		$('#id_detail_tooltip a').removeClass('inactive');
		//$(options.left_menu_wrapper).removeClass('hide');
	}

	function gridView(){
		$(options.list_wrapper_selector).addClass('hide');
		$(options.grid_wrapper_selector).removeClass('hide');
		$('#id_detail_tooltip a').addClass('inactive');
		//$(options.left_menu_wrapper).addClass('hide');
		setTimeout(function(){
		$(".customScroll.gridViewTable").mCustomScrollbar("scrollTo",0);
		},100)
	}

	function init(){
		$("body").off("click",options.show_list_view_selector).on("click",options.show_list_view_selector,function() {
			listView();
			$(this).closest('#content_wraper').addClass('listViewWrapper').removeClass('gridViewWrapper');
		});

		$("body").off("click",options.show_grid_view_selector).on("click",options.show_grid_view_selector,function() {
			gridView();
			$(this).closest('#content_wraper').addClass('gridViewWrapper').removeClass('listViewWrapper');
			gridHT();
			angular.bootstrap(document.getElementById("gridContainer"), ['gridStructure']);
			$("#editGridDataModalUpload :file").filestyle({icon: false});
		


		});

		$('body').off('click','#showHideGridHeads .dropdown-toggle').on('click','#showHideGridHeads .dropdown-toggle',function() {
			
			setTimeout(function(){
				manageDrpHT();
			},100)
				
			
				
				
			   
		});


			
	}

	return {
		listView: listView,
		gridView: gridView,
		init: init
	};
});

// $(document).ready(function() {
// 	middlePaneViewModule.init();
// })

function manageDrpHT(){
    if($('#showHideGridHeads .button-group').hasClass('open')){
    	var getlistEntry = $('ul.drp-menu li').length;
		var getDrpHT     = $('ul.drp-menu').outerHeight();
		if(getlistEntry > 10){
			$('#showHideGridHeads .dropdown-menu').css('height','300');
		}
		else{
			$('#showHideGridHeads .dropdown-menu').css('height',getDrpHT+10);
		}
    }
}

