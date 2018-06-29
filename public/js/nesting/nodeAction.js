	/*!
	 * nodeAction 1.0
	 *
	 * Copyright 2014, Kumar Krati Gupta
	 *
	 */					 
		var snip = '';
		var isKeyPress = false;
		var kThis;

		jQuery(document).off('keydown');
		jQuery(document).on('keydown', function(e){
	        if (e.which == 13) {
	        	e.preventDefault();
	        	addSiblingNode();
	        	addIcons();
	        	textareaWidth();
	           
	        } else if (e.which == 38) { 
                upNode();
            } else if(e.which == 40) { 
                downNode();
            } else if(e.which == 08) { 
               e.preventDefault();
               
               
               if($(".class-bulider-section" ).find( ".node-content.node-selected .node-textarea").val() == ""){
                   if(!$(".class-bulider-section" ).find( ".node-content.node-selected").parent().is("#firstNode")){
                   $(".class-bulider-section" ).find( ".node-content.node-selected .node-right a.deleteNode:first").trigger("click");
                   }
		       } else {
		       	   if($(".class-bulider-section" ).find( ".node-content.node-selected .node-textarea").val() != undefined){
		       	   	var position = $(".class-bulider-section" ).find( ".node-content.node-selected .node-textarea").prop("selectionStart");
			       	  if(position != 0){ 
			       	    var s = $(".class-bulider-section" ).find( ".node-content.node-selected .node-textarea").val();
			       	    var value = s.substring(0,s.length-1);
		       	        $(".class-bulider-section" ).find( ".node-content.node-selected .node-textarea").val(value);  
		              }
		           }
		       }
            }
		}); 
	
	 
	jQuery(window).off('keydown');
		jQuery(window).on('keydown', function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if (code == 9 && !e.shiftKey) {
			e.preventDefault();
			indentNode();
			}
		if(e.shiftKey && code == 9) { 
			e.preventDefault();
			outdentNode();
		}
	});

		var deletedNodes = [];

		jQuery('body').off('click','.addNode');
		jQuery('body').on('click','.addNode', function(e){
			// var mainHig = $('#main').height();
			// var nanoHig = $('#main .overthrow #node-wrapper').height();

			// if(nanoHig > mainHig){
			
			// $('.class-bulider-section').removeClass('paper-line-center').addClass('white-bg');
			// $('.class-bulider-section').find('li').addClass('paper-line-center');
			
			// }
			// else{
				
			// 	$('.class-bulider-section').addClass('paper-line-center').removeClass('white-bg');
			// 	$('.class-bulider-section').find('li').removeClass('paper-line-center');
			// }
			$(body).find('#global-save').removeAttr('disabled');
			$('.add-new-node-fast-click').remove();
			var data_type = $(this).closest("li").data("type");
			var snip = $("body").find("#snippets ."+data_type).html();
			if($(this).closest('li').first().find('ol').length<=0){
				$(this).closest('li').append('<ol></ol>')
			}
			$(this).closest('li').find('ol').first().append(snip);
            textareaIncreaseHeight();


          
			// jQuery('body input[type=text]').on('input', function() {
			// 	$(this).attr('inputChange','1');				
			// });
			
			$(this).closest('li').removeClass('mjs-nestedSortable-leaf');
			$(this).closest('li').removeClass('mjs-nestedSortable-collapsed').addClass('mjs-nestedSortable-expanded');
			$('#main').css('height',$('#center-screen').height()-60);
			$(".nano").nanoScroller({ preventPageScrolling: true });
			setPaperBckgrnd();
			kThis = $(this).closest('li');
			var $this = $(this).closest('.entrnode');   
			if($this.hasClass('download-cashed')){ 
				$('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				//$(kThis).find('ol').first().find('input[type=text]').focus();
				$(kThis).find('ol').first().find(".node-textarea").focus();
				$(kThis).find('ol').first().find('.node-content').last().addClass('node-selected');
				isKeyPress=true;
				addFastClickButton();

			}
			else {  
				var data_view = "node";
				if(typeof $this.data('id')!='undefined')
				{
					var data_id = String( $this.data('id') );
					node_id = $.trim(data_id);
					if( data_id.indexOf('-') != -1  ){
						data_id= $.trim(data_id).split('-');       
						node_id = data_id[1];  
					}
				} else {
				var node_id = '';
				}
				//$this.find('#detail-loader').show();  
				$this.addClass('download-cashed');
				$.ajax({
				type : 'POST',
				url  : baseurl+'/node/nodeDetailAjax',
				data : 
				{
				'node_id':node_id, 'sectionName':'LeftSection' ,'nodeType':'Node'
				},
				success: function(result) {

				var $result = $(result).prependTo($this.find('ol').first());
				var pixels = 100;
				var screenWidth = $(document).width();
				//var percentage = 100*(screenWidth-430)/screenWidth;
				//$("#center-screen").css('width', percentage+'%');
				var windowWidth = $(window).outerWidth()
			    var actionWrap = $('.user-action-wrap').outerWidth()
			    var sidebarwrap = $('.sidebar_wrap').outerWidth()
			    var centerwidth = windowWidth - (actionWrap+sidebarwrap);
			    $("#center-screen").css('width',centerwidth+"px");
				$('#main').css('height',$('#center-screen').height()-60);
				$(".nano").nanoScroller({ preventPageScrolling: true });
				$('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				$(kThis).find('ol').first().find('input[type=text]').focus();
				$(kThis).find('ol').first().find('.node-content').first().addClass('node-selected');
				kThis="";
				addFastClickButton();
	            addIcons();
	            
					}
				});
			}
			addIcons();
			textareaWidth();
			nodeNumbering();
			e.stopPropagation();
		});

	jQuery('body').off('click','.add-sibling-node');
	jQuery('body').on('click','.add-sibling-node', function(e){
		$(this).closest('ol').parent().find('.addNode').first().click();
	});
	jQuery('body').off('click','.add-child-node');
	jQuery('body').on('click','.add-child-node',function(e){		
		$(this).closest('li').find('.addNode').first().click();
	});
    
	function setSquenceOfNode(parentNodeId,currentNodeId,previousNodeId,nextNodeId)
	{
	  if(parentNodeId == undefined)
		parentNodeId = 0;
	  if(currentNodeId == undefined)
		currentNodeId = 0;

	  if(previousNodeId == undefined)
		previousNodeId = 0;

	  if(nextNodeId == undefined)
		nextNodeId = 0;

	  $.post(baseurl+'/node/updateSquence',{'parentNodeId':parentNodeId,'currentNodeId':currentNodeId,'previousNodeId':previousNodeId,'nextNodeId':nextNodeId} ,responceSetSquenceOfNode,'JSON');
	}

	function responceSetSquenceOfNode(d,s) 
	{
	  mainTreeList(d.currentNodeId);
	}

	function mainTreeList(node_id)
	{
	  var nodeId = node_id || 0;
	  var selected_node_id = '';
	  var ids = $(body).find("#left-screen #perspectiveDiv .node-selected .node-head").attr("id");
	  if(ids != undefined) {
		var click_array 				= ids.split('~');
	    var selected_node_id			= click_array[1];
	 }	
	  
	  
	  $(".node-attribute-sidebar").show();
	  jQuery.ajax({
		  type:'POST',
		  url:baseurl+'/node/viewNodeMap',
		  data:{'node_id':node_id,'selected_node_id':selected_node_id},
		  success:function(resp){
			  $("#perspectiveDiv").html(resp);
			  $('#perspectiveDiv .fullWidthNodeParent').each(function(i,v){
				$(v).find('.fullWidthNode').css('width',$(v).width()-35);
	          });
		  }
	  });
	}

	function setPaperBckgrnd()
	{   
	   //code commented due to the reason of changing nano scrollbaar to nice scrollbaar
	   
	   // if($('.nano-pane').css('display')=="none")
	   // {
		  //$('.class-bulider-section').addClass('paper-line-center');


		  	$('.sortable li').removeClass('paper-line-center');
		  	$('.class-bulider-section').css('border-bottom','none');
		  	// start code for set background for li
		  	
		  	$('.center-div.class-bulider-section.node_builder .dual-panel, .center-div.class-bulider-section.role_builder .dual-panel,.center-div.class-bulider-section.class_builder .dual-panel,.center-div.class-bulider-section.class_builder #right_pane_div_id .dual-panel #rightPaneScrollbar,#entr_center_content').scroll(function(){
        		//$(this).removeClass('paper-line-center');
		        $(this).find('li').addClass('paper-line-center-li');
		    });
		    // end code
		// }
		// else
		// {
		//   $('.class-bulider-section').removeClass('paper-line-center');
		//   $('.sortable li').addClass('paper-line-center');
		//   $('.class-bulider-section').css('border-bottom','1px solid #ccc');
		// }
	}

	jQuery('body').off('click','.deleteNode');
	jQuery('body').on('click','.deleteNode', function(e){
		$(body).find('#global-delete').removeAttr('disabled');
		var nodeLength = $(this).closest('ol').first().parent().find('ol').first();
		upNode();
		$(this).closest('li').remove();
		//deletedNodes[] = $(this).closest('li').data("id");
		var dataid = $(this).closest('li').attr("data-id");
		tmp = dataid.split('-');
		data_id = tmp[1]; 
		deletedNodes.push(data_id);
		$.each(deletedNodes, function( key, value ) {
		});

		if($(nodeLength).children().length<=0)
		{
			$(nodeLength).closest('li').addClass('mjs-nestedSortable-leaf');
			$(nodeLength).closest('li').addClass('mjs-nestedSortable-collapsed').removeClass('mjs-nestedSortable-expanded');
		}
		$('#main').css('height',$('#center-screen').height()-60);
		$(".nano").nanoScroller({ preventPageScrolling: true });
		setPaperBckgrnd();
		addFastClickButton();
		addIcons();
		textareaWidth();
	    e.stopPropagation();
	});

	jQuery('body').off('click','#global-save');
	
	jQuery('body').on('click','#global-save',function(e){
		saveValidation();
		
		if(emptyCheck)
		{
			$('.emptyNodeError').slideDown('fast').delay(2000).slideUp('fast');
			emptyCheck	=	false;
		}
		else
		{
			hiered 		= $('ol.sortable').nestedSortable('toHierarchy', {startDepthCount: 0});
			var arr 	= [];
			arr.push(hiered);

			$.post(baseurl+'/node/createNodeMap',{'data':JSON.stringify(arr)},responceCreate,'JSON');
			$(body).find('#global-save').attr('disabled','true');
			$(body).find('#global-cancel').attr('disabled','true');
		}
	})


	jQuery('body').on('click','#global-delete',function(e){
		if(deletedNodes.length > 0) {
		   $.post(baseurl+'/node/deleteNodeMap',{'data':JSON.stringify(deletedNodes)},responceDelete,'JSON');
		}	
		$(body).find('#global-delete').attr('disabled',"true");
		deletedNodes = [];
	})	

	
	function responceCreate(d,s)
	{
		mainTreeList(d.currentNodeId);
		$.each(d.changeData, function(index, element) {
				$('.'+index).closest('li').attr('data-id','node-'+element);
				$('.'+index).closest('.node-left').find('.node-circle').attr('data-id','node-'+element);
		});
	}

	
	function responceDelete(d,s)
	{
		mainTreeList(d.currentNodeId);
	}
		
		
	var emptyCheck	=	false;
	function saveValidation()
	{
		//$('#main ol.sortable').find('.node-input input[type=text].node-title-text')).each(function(i,v){
		// $('#main .nano').find(".node-title-text").each(function(i,v){	
		 $('#main .nano').find("input[class='node-title-text']").each(function(i,v){

			if($.trim($(v).val()).length==0){
				emptyCheck=true;
			}
		})
	}


	function indentNode(){
		var node = $('.class-bulider-section').find('.node-selected').closest('li');
		var nodeOl = $(node).prevAll('li').first().find('ol').first();
		if($(node).parent().children().length>1){
		$(node).prevAll('li').first().removeClass('mjs-nestedSortable-leaf');
		$(node).prevAll('li').first().removeClass('mjs-nestedSortable-collapsed').addClass('mjs-nestedSortable-expanded tabShift');
		$(node).appendTo(nodeOl);
		(node).find('.node-content').first().click();
		addFastClickButton();	
		}
		addIcons();
	    textareaWidth();
	}

	function outdentNode(){
		var node = $('.class-bulider-section').find('.node-selected').closest('li');
		var nodeOl = $(node).closest('ol').parent();

		if($(nodeOl).attr('id')=="firstNode"){

		}
		else{
			$(node).insertAfter(nodeOl);	
			
			if($(node).prev().length==0){
			
			}
			else if($(node).prev().find('ol').first().children().length>0){
				$(node).prevAll('li').first().removeClass('mjs-nestedSortable-leaf');
				$(node).prevAll('li').first().removeClass('mjs-nestedSortable-collapsed').addClass('mjs-nestedSortable-expanded tabShift');
			}
			else{
				$(node).prevAll('li').first().addClass('mjs-nestedSortable-leaf');
				$(node).prevAll('li').first().addClass('mjs-nestedSortable-collapsed').removeClass('mjs-nestedSortable-expanded tabShift');	
			}	
		}
		(node).find('.node-content').first().click();	
		addFastClickButton();
		addIcons();
	    textareaWidth();
	}

function addFastClickButton(){
	
	$('.add-new-node-fast-click').remove();
	$('.center-div ol.sortable').find('li').last().after().append('<div class="add-new-node-fast-click node-condensed add-sub-child-wrap"><div class="node-add-row"><a class="add-sibling-node"><i class="fa fa-plus"></i></a><a class="add-child-node"><i class="fa fa-plus"></i></a></div></div>');
}

function addSiblingNode(){
	$this = $('.class-bulider-section').find('.node-selected');
	if($this.parent().is("#firstNode")){
      $("#firstNode").find('.addNode').first().click();
	} else{
	var data_type = $this.closest("li").data("type");
	var snip = $("body").find("#snippets ."+data_type).html();
	$this.closest('li').after(snip);
	$('.class-bulider-section').find('.node-selected').removeClass('node-selected');
	$this.closest('li').next().find('.node-content').addClass('node-selected');
	$this.closest('li').next().find('.node-textarea').focus();
	addFastClickButton();
	$('#main').css('height',$('#center-screen').height()-60);
	$(".nano").nanoScroller({ preventPageScrolling: true });
	setPaperBckgrnd();
	textareaIncreaseHeight();
    }
}

function textareaIncreaseHeight(){
//add code for autorize textarea height
            //autosize(document.querySelectorAll('.node-textarea'));




			//This span is used to measure the size of the textarea
			//it should have the same font and text with the textarea and should be hidden

			// var span = $('<span class="textareaspan">').css('display','inline-block')
			//                     .css('word-break','break-all')
			//                     .appendTo('body').css('visibility','hidden');
			// function initSpan(textarea){
			// span.text(textarea.text())
			//     .width(textarea.width())
			//     .css('font',textarea.css('font'));
			// }
			// $('.node-textarea').on({
			//   input: function(){
			//      var text = $(this).val();      
			//      span.text(text);     
			//      $(this).height(text ? span.height()+.5 : '22.5');
			//      if($(this).closest('.node-selected').siblings().hasClass('add-new-node-fast-click')){
			//      	$(".add-new-node-fast-click").css("margin-top",span.height()-20);
			//      }
			//   },
			//   focus: function(){           
			//      initSpan($(this));
			//   },
			//   keypress: function(e){
			//      //cancel the Enter keystroke, otherwise a new line will be created
			//      //This ensures the correct behavior when user types Enter 
			//      //into an input field
			//      if(e.which == 13) e.preventDefault();
			//   }
			// });


	jQuery.each(jQuery('.node-textarea'), function() {
	    var offset = this.offsetHeight - this.clientHeight;
	    var textA = this;
	    var resizeTextarea = function(el) {
	        jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
	         if(jQuery(el).closest('.node-selected').siblings().hasClass('add-new-node-fast-click')){
			     	$(".add-new-node-fast-click").css("margin-top",el.scrollHeight + offset-20);
			 }
	    };
	    jQuery(this).on('keypress', function() { resizeTextarea(this);}).removeAttr('data-autoresize');
    });

}
function upNode(){
	var node = $('.class-bulider-section').find('.node-selected').closest('li');
	
	if($(node).attr('id')=="firstNode"){

		}
    else {
		if($(node).prev().length>0){
			
			if($(node).prev('li').find('.node-content').length>1){
				var nodeli = $(node).prev('li');
			    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				nodeli.find('.node-content').last().addClass('node-selected');
				nodeli.find('.node-textarea').last().focus();

			} else {
				var nodeli = $(node).prev('li');
			    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				nodeli.find('.node-content').first().addClass('node-selected');
				nodeli.find('.node-textarea').first().focus();
            }

		} else {
		    var nodeOl = $(node).closest('ol').parent();
		    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
			nodeOl.find('.node-content').first().addClass('node-selected');
			nodeOl.find('.node-textarea').first().focus();
	    }
	}
}
function downNode(){
		var node = $('.class-bulider-section').find('.node-selected').closest('li');
		if($(node).next('li').find('.node-content').length>0){
			if($(node).find('ol').find('.node-content').length>1){
				var nodeli = $(node).find('ol');
			    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				nodeli.find('.node-content').first().addClass('node-selected');
				nodeli.find('.node-textarea').first().focus();

			} else {
				if($(node).find('ol').length>1){
					var nodeli = $(node).find('ol')
				    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
					nodeli.find('.node-content').first().addClass('node-selected');
					nodeli.find('.node-textarea').first().focus();
				} else {
					var nodeli = $(node).next('li')
				    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
					nodeli.find('.node-content').first().addClass('node-selected');
					nodeli.find('.node-textarea').first().focus();
				}
		        
           }

		} else {	
			if($(node).find('ol').length<2){
			    var totalNode = $('.numbering .node-content').length;
			    var flag = false;
				$('.numbering .node-content').each(function(i,v){ 
				if(flag == false){
					 if($(this).hasClass("node-selected")) {
					 flag = true;
						 if(i+1 == totalNode){
						 	$(this).addClass("node-selected"); 
				 	        $(this).find('.node-textarea').focus();
						 }
					 }
				}
				 else { 
                    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
				 	$(this).addClass("node-selected"); 
				 	$(this).find('.node-textarea').focus();
				 	flag = false;}
				});


			} else {
			    $('.class-bulider-section').find('.node-selected').removeClass('node-selected');
			 	$(node).find('ol').find('.node-content').first().addClass('node-selected');
		        $(node).find('ol').find('.node-textarea').first().focus();
	       }
	    }
}


function nodeNumbering (){
	$('.numbering .node-content').each(function(index, el) {
	    $(this).parent('li').find('.number_print').remove();
	    $(this).prepend("<span class='number_print'>"+(index + 1)+"</span>");
	    var firstNodewidth = $('#firstNode').width();
	    var currentNodewidth = $(this).parent().width();
	    var diff = firstNodewidth - currentNodewidth;
	    $(this).parent('li').find('.number_print').css("margin-left",-diff-30);
	});
 
}