var selectedbtn 	= "powerBtn";
var selectedbtn1 	= "powerBtn1";
var currentmode 	= "Display";

function getClassStructure(class_id)
{
	$(".list-row").removeClass('current');
	$("#list-row_"+class_id).addClass('current');
    $(".classes_top_cl").trigger("click");
	if($("#firstTime").val() == 'N')
    {
	   NProgress.start();
    }
    $.post(domainUrl+'classes/classStructure',{'class_id':class_id,'mode':'Display'},responseClassStructure,'html');
}

function responseClassStructure(data,source)
{
    $("#second-class-div").html(data);
    manageRightMenuIcon('listing','classes');
    NProgress.done();
    setPaperBckgrnd();
    removeString();
}

function paginationAjax(url,page,order_by,order,itemPerPage)
{
	NProgress.start();
	$.post(url+'/index',{'page':page,'order_by':order_by,'order':order,'type':'pagination','itemPerPage':itemPerPage},responsePaginationAjax,'html');
}

function setPage(value)
{
	NProgress.start();
	$.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':'pagination','itemPerPage':value},responsePaginationAjax,'html');
}

function paginationAjaxList(url,page,order_by,order)
{
	NProgress.start();
	$.post(url+'/index',{'page':page,'order_by':order_by,'order':order,'type':'no-pagination'},responsePaginationAjax,'html');
}

function responsePaginationAjax(data,source)
{
    $("#first-class-div").html(data);
	NProgress.done();
	/*Code for toggling of the buttons*/
	if(selectedbtn == "barBtn"){
	   $('.barBtn .fa').removeClass("barIcon").addClass("squareIconGray");
	   $('.powerBtn .fa').removeClass("powerIcon").addClass("squareIconArrowWhite");
	} else {
	   $('.barBtn .fa').removeClass("squareIconGray").addClass("barIcon");
	   $('.powerBtn .fa').removeClass("squareIconArrowWhite").addClass("powerIcon");
	}
}

function editClassProperty()
{
	var is_instance = $("#is_instance").val();
	if(is_instance == 'N')
	{
		var node_y_class_id = $("#node_y_class_id").val();
		if(parseInt(node_y_class_id) > 0)
		{
			NProgress.start();
		
		    $.post(domainUrl+'classes/classStructure',{'class_id':node_y_class_id,'mode':'Edit'},responseEditClassProperty,'html');
		    
		    if($("#node-x-li a").html()=='Node X'){
			  
			    $.post(domainUrl+'classes/getNodeX',{'mode':'Edit','nodeTypeId':1},responseGetNodeX,'html');
			}
			else {
				
				$.post(domainUrl+'classes/getNodeX',{'mode':'Edit','nodeTypeId':3},responseGetNodeX,'html');	
			}

		    
		   // $.post(domainUrl+'classes/getNodeXThirdPane',{'mode':'Edit'},responsegetNodeXThirdPane,'html');
		}
		currentmode = 'edit';
	}
	else
	{
		var node_instance_id = $("#node_instance_id").val();
		if(parseInt(node_instance_id) > 0)
		{
			NProgress.start();
			manageRightMenuIcon('add','classes');
    		$.post(domainUrl+'classes/instanceStructure',{'node_instance_id':node_instance_id,'mode':'Edit'},responseInstanceStructure,'html');
		}
	}
}

function responseEditClassProperty(data,source)
{
    $("#second-class-div").html(data);
	NProgress.done();
	setPaperBckgrnd();
    manageRightMenuIcon('add','classes');
	stopLastElementTabing();
	removeString();
	/*Custom code to add and remember Class highligting NodeX Problem*/
	var newNum = localStorage.getItem("liItemNumber");	
	$('#class_'+newNum).closest("ol").find("li .node-selected").removeClass("node-selected");
	$('#class_' +newNum).parent().parent().addClass('node-selected');
	localStorage.clear();
	/*End of custom Code - Vimal*/
	
}

function cancelClassProperty()
{
	if($("#node-x-li a").html()=='Node X'){
	  $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':1},responseGetNodeX,'html');
	}
	else {
		$.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':3},responseGetNodeX,'html');	
	}

	$.post(domainUrl+'classes/getNodeXThirdPane',{'mode':'Display'},responsegetNodeXThirdPane,'html');
	var is_instance = $("#is_instance").val();
	if(is_instance == 'N')
	{
		var node_y_class_id = $("#node_y_class_id").val();
		if(parseInt(node_y_class_id) > 0)
		{
			getClassStructure(node_y_class_id);
		}
		else
		{
			$(".first_class_structure").click();
		}
	}
	else
	{
		var node_instance_id = $("#node_instance_id").val();
		if(parseInt(node_instance_id) > 0)
		{
			NProgress.start();
			manageRightMenuIcon('listing','classes');
    		
    		$.post(domainUrl+'classes/instanceStructure',{'node_instance_id':node_instance_id,'mode':'Display'},responseInstanceStructure,'html');
		}
		else
		{
			var node_y_class_id = $("#node_y_class_id").val();
			$.post(domainUrl+'classes/getClassInstance',{'class_id':node_y_class_id,'page':1,'order_by':'node_instance_id','order':'DESC','mode':'pagination'},responseGetClassInstance1,'html');
		}
	}
}

function removeProperty(id)
{


	$("#prop_temp_li_"+id).remove();
	tabPositions();
}

function removePropertyNew(id)
{
	$("#old_"+id).remove();
	var npids	=	$("#remove_prop_ids").val()+id+',';
	$("#remove_prop_ids").attr('value',npids);
}

function deleteClassProperty()
{
	var is_instance 			= 	$("#is_instance").val();
	var counter					=	0;
	var class_id 				=	'';
	if(is_instance == 'N')
	{
		$('.single_check').each(function(){ 
			if($(this).is(':checked') == true)
			{
				counter 		= parseInt(counter)+1;
				class_id 		= $(this).val();
			}
		});
	}
	else
	{
		$('.single_i_check').each(function(){ 
			if($(this).is(':checked') == true)
			{
				counter 		= parseInt(counter)+1;
				class_id 		= $(this).val();
			}
		});
	}


	if(parseInt(counter) > 0)
	{
		$.post(domainUrl+'classes/deleteClassCount',{'counter':counter,'is_instance':is_instance,'class_id':class_id},responseOpenDialogOfDelete,'JSON');
	}
}

function responseOpenDialogOfDelete(data,source)
{
	$("#delMsgOfCI").html(data['msg']);
	$("#deleteInsOrClsPopup").modal('show');
}

function deleteClassPropertyAgain()
{
	NProgress.start();
	var is_instance = 	$("#is_instance").val();
	var delete_ids	=	'';
	if(is_instance == 'N')
	{
		$('.single_check').each(function(){ 
			if($(this).is(':checked') == true)
			{
				delete_ids = delete_ids + $(this).val() + ',';
			}
		});
		$.post(domainUrl+'classes/deleteClass',{'delete_ids':delete_ids},responseDeleteClassProperty,'html');
	}
	else
	{
		$('.single_i_check').each(function(){ 
			if($(this).is(':checked') == true)
			{
				delete_ids = delete_ids + $(this).val() + ',';
			}
		});
		$.post(domainUrl+'classes/deleteInstance',{'delete_ids':delete_ids},responseDeleteInstanceProperty,'html');
	}
}

function responseDeleteClassProperty(data,source)
{
	NProgress.done();
	$(".first_hit").click();
}

function responseDeleteInstanceProperty(data,source)
{
	var node_class_id = $("#node_y_class_id").val();
	$.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':'pagination','itemPerPage':'0'},responsePaginationInstanceAjax,'html');
}

function saveClassProperty(saveType)
{
	NProgress.start();
	var is_instance = $("#is_instance").val();
	if(is_instance == 'N')
	{
		if($.trim($("#class_caption").val()) == "" && $.trim($("#node_y_class_id").val()) == "")
			return false;
		else
		{
			/* code here start for save data fisrt class propert */
			selectedtextareaValue= "";
			  $(".property-child .node-content").each(function(i,v){
              if($(this).hasClass("node-selected")){
               selectedtextareaValue = $(this).find("textarea").val()
              }
            });

			if(selectedtextareaValue == ""  && $("#div-node-x-property").hasClass("active"))
			{
				bootbox.alert('Please enter value for the empty Node Y property.');
					
			}
			else 
			{
				/*save Instance data */
				/*check second pane condition textarea value*/		
	            var selectedtextareaValue = "";
	            $(".property-child .node-content").each(function(i,v){
	              if($(this).hasClass("node-selected")){
	               selectedtextareaValue = $(this).find("textarea").val()
	              }
	            });

	            //third pane condition   
	            var selectedparentId = 0;
	            if($(".thirdPaneActive .node-input").attr("data-class")!=undefined){
	                 selectedparentId =  parseInt($(".thirdPaneActive .node-input").attr("data-class").split("_")[1]);
	            }
	            var slectedCheckbox =   $("#third-class-div [id="+selectedparentId+"]").prop('checked');
	            //third pane condition
	            var flag = false
	            $(".instanceRunTab").each(function(){
	                if($(this).val().length>0){
	                    flag=true;
	                }
	            });

            	/* code here to check third pane check box */
		        var selectedparentId = 0;
	            if($(".thirdPaneActive .node-input").attr("data-class")!=undefined){
	                 selectedparentId =  parseInt($(".thirdPaneActive .node-input").attr("data-class").split("_")[1]);
	            }
				var slectedCheckbox =   $("#third-class-div [id="+selectedparentId+"]").prop('checked');
				
            	if(slectedCheckbox == true && flag == true)
            	{   
	            	saveInstanceVal();
            	}
            	else 
            	{
					if($.trim($("#node_y_class_id").val()) == "")
					$("#action_type").attr('value','save');
					else
					$("#action_type").attr('value','edit');
					sendClassJson();
					var myJsonString = JSON.stringify(classBuilder);
					$.post(domainUrl+'classes/saveClass',{'data':$("#class_structure_form").serialize(),'propertyJson':myJsonString,'mode':'normal','saveType':saveType},responseSaveClassProperty,'html');    		
            	}
				/*end code here*/
        	}
            /* end code here */
		}
	}
	else
	{
		if($.trim($("#node_instance_id").val()) == "")
		{
			$("#instance_action_type").attr('value','save');
		}
		else
		{		
			$("#instance_action_type").attr('value','edit');
		}
		if($.trim($("#instance_caption").val()) != ""){

					var postData = {
			            mapping_class_id: $.trim($("#node_y_class_id").val())
       				 }
       				if($.trim($("#node_instance_id").val())==''){ 
						$.ajax({
								type: "post",
								url: domainUrl+'classes/checkMappingClass',
								data: postData,
								dataType: "json",
								success: function (msg) {
									
									if (msg.count < 1) {
										
										$.post(domainUrl+'classes/saveInstance',{'data':$("#instance_structure_form").serialize(),'saveType':saveType},responseSaveInstanceProperty,'html');
									} 
									else {
										
										bootbox.alert("For this class you can not add more then one instance!");
										return false;
									}
								},
								
							});
						}
						else {
							
							if($.trim($("#node_y_class_id").val())==125){
								
								bootbox.confirm({
	                            title: 'Message',
	                            message: 'Please update the property of conversion class as well.',
		                            buttons: {
		                                'cancel': {
		                                   label: 'No',
		                                   className: 'btn-default'
		                                },
		                                'confirm': {
		                                   label: 'Yes',
		                                   className: 'btn-primary'
		                                }
		                            },
		                            callback: function(result) {
		                                 if (result) {
		                                       $.post(domainUrl+'classes/saveInstance',{'data':$("#instance_structure_form").serialize(),'saveType':saveType},responseSaveInstanceProperty,'html');

		                                }else{      
		                                       
		                                } 
		                            }
	            				});
							}
							else {
								$.post(domainUrl+'classes/saveInstance',{'data':$("#instance_structure_form").serialize(),'saveType':saveType},responseSaveInstanceProperty,'html');
							}

						}
				}
			
	}
}

function responseSaveClassProperty(data,source)
{
	$("#second-class-div").html(data);

	NProgress.done();

	if($("#node-x-li a").html()=='Node X'){
		 
		  $.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':1},responseGetNodeX,'html');
		}
		else {
			$.post(domainUrl+'classes/getNodeX',{'mode':'Display','nodeTypeId':3},responseGetNodeX,'html');	
		}
	
	currentmode = 'Display';

	if($("#action_type").val() == 'save')
	{
		$('#DataSaveMsg').html("<span>Class Saved Successfully</span>");
	}
	else
	{
		$('#DataSaveMsg').html("<span>Class Updated Successfully</span>");
	}
	
	


	$('#DataSaveMsg').fadeIn();
    setTimeout(function(){
        $('#DataSaveMsg').fadeOut();
    },3000);

	setPaperBckgrnd();
    manageRightMenuIcon('listing','classes');
	

	 if($("#action_type").val() == 'save')
	 {  
	 	if(!$("#div-node-x").hasClass("active")){
	 		
	 		$(".first_hit").click();
	 	}	
	 }
	 removeString();
}

function responseGetNodeX(data,source)
{

	$("#third-class-div").html(data);
	var coloum   = $(".list-row.current").find('td').first().next().text();
	var nodeId   = $(".list-row.current").find('td').first().next().next().text();
	var nodeVal  = $("#common_name_label_"+coloum).text()
	var nodetype = $("#node_type_label_"+coloum).text()
	var SelectName = "Node "+ nodetype + " (Properties): " + nodeId + " ("+nodeVal+")";

	$("#second-class-div-heading").html(cutString(SelectName));
		if(!$('.listing-wrapper').hasClass("active")){
				defaultSelection();
		}
		else  {
			thirdPaneselection();
		}
	dualPaneHeight();
}

function responsegetNodeXThirdPane(data,source)
{
	$("#fourh-class-div").html(data);
     //selectthirdNodeX();
     $(".nano").nanoScroller();
    dualPaneHeight()
}

/* function use here for assign node class instance node id */

function responseSaveInstanceNodeId(data,source){
		var appendInstanceId = $("#second-class-div").find(".node-selected .hidden-node-x").val();
		$("#second-class-div").find(".node-selected .hidden-node-x").val(appendInstanceId+','+data.node_id);

}	

/* end code here */

function responseSaveInstanceProperty(data,source)
{
	NProgress.done();
	if($("#instance_action_type").val() == 'save')
	{
		$('#DataSaveMsg').html("<span>Instance Saved Successfully</span>");
	}
	else
	{
		$('#DataSaveMsg').html("<span>Instance Updated Successfully</span>");
	}
	setTimeout(function(){
        $('#DataSaveMsg').fadeOut();
    },3000);
    manageRightMenuIcon('listing','classes');
    NProgress.start();
    if($("#instance_action_type").val() == 'save')
    {
	    var node_y_class_id = $("#node_y_class_id").val();
		$.post(domainUrl+'classes/getClassInstance',{'class_id':node_y_class_id,'page':1,'order_by':'node_instance_id','order':'DESC','mode':'pagination'},responseGetClassInstance1,'html');
	}
	else
	{
		NProgress.done();
		var node_instance_id = $("#node_instance_id").val();
		getInstanceStructure(node_instance_id);
	}

	$('#DataSaveMsg').fadeIn();
}

function responseGetClassInstance1(data,source)
{
	$("#first_instance_div").html(data);
	NProgress.done();
	if($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
	{
		$(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","none");
        $(".ExportInstanceData_li").addClass('inactive');
    	$(".ExportInstanceData_li").find('a').css("pointer-events","none");
    	$(".All_li").addClass('inactive');
        $(".All_li").find('a').css("pointer-events","none");
        $(".Draft_li").addClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","none");
        $(".Published_li").addClass('inactive');
        $(".Published_li").find('a').css("pointer-events","none");
    	$(".Edit-icon").hide();
        $(".Cancel-icon").hide();
	}
	else
	{
		$(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","all");
        $(".ExportInstanceData_li").removeClass('inactive');
		$(".ExportInstanceData_li").find('a').css("pointer-events","all");
		$(".All_li").removeClass('inactive');
        $(".All_li").find('a').css("pointer-events","all");
        $(".Draft_li").removeClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","all");
        $(".Published_li").removeClass('inactive');
        $(".Published_li").find('a').css("pointer-events","all");
		$(".Edit-icon").show();
	}
}

function listPage(displayType)
{  
	if(displayType == 'Y')
	{
	    selectedbtn  = "powerBtn";
		NProgress.start();
		var value = $("#temp_item_per_page").val();
		$.post(domainUrl+'classes/index',{'page':1,'order_by':'node_class_id','order':'DESC','type':'pagination','itemPerPage':value},responsePaginationAjax,'html');
		
		
	}
	else
	{
	    selectedbtn  = "barBtn";
		NProgress.start();
		$.post(domainUrl+'classes/index',{'order_by':'node_class_id','order':'DESC','type':'no-pagination'},responsePaginationAjax,'html');
	}
}

function setNumberPrint()
{
	$('.numbering .node-content').each(function(index, el) {
	    $(this).parent('li').find('.number_print').remove();
	    $(this).prepend("<span class='number_print'>"+(index + 1)+"</span>");
	    var firstNodewidth = $('#node-wrapper').width();
	    var currentNodewidth = $(this).parent().width();
	    var diff = firstNodewidth - currentNodewidth;
	    $(this).parent('li').find('.number_print').css("margin-left",-diff);
	});
}

function addChildProperty(getElement)
{
	
	var prop_number		=	$("#prop_number").val();

	var propHtml		=	'<li id="prop_temp_li_'+prop_number+'" class="numbering" data-class="prop_temp_li_'+prop_number+'"><div class="node-content  node-selected clearfix"><span class="number_print"></span><div class="node-left"><div class="node-circle node-white-circle">N</div><div class="node-head node-input"><textarea class="runTab" cols="30" rows="1" class="runTab" id="new_property_'+prop_number+'" name="new_property[]" placeholder=""></textarea></div><input type="hidden" class="hidden-node-x" name="node_x_y[]" value="" id="class_prop_temp_li_'+prop_number+'"></div><div class="node-right hide"><a class="action-move" onclick="removeProperty('+prop_number+');"><span><i class="fa fa fa-times"></i></span></a><a class="action-move addclass"><span><i class="fa fa-plus"></i></span></a></div></div><ol></ol></li>';
    
    $(".node-content").removeClass("node-selected");
    if(getElement!=undefined)
    {
        if(getElement.is("ol")){
        getElement.append(propHtml);
        getElement.find("li:last").find(".runTab").focus();
        }
        else if(getElement!=undefined){
        $(propHtml).insertAfter(getElement);
        getElement.next().find(".runTab").focus();
        }
    }   
    else{
    $(".property-child").append(propHtml);
    $(".property-child li:last").find(".runTab").focus();
    }

    var new_prop_number		=	parseInt(prop_number)+1;
    $("#prop_number").attr('value',new_prop_number);
    stopLastElementTabing();
    textareaIncreaseHeight();
    tabPositions();
    calculatePlusIcons(); 
    setNumberPrint();
    $(".nano").nanoScroller();
    setPaperBckgrnd();

    //In enter pressing unchecked all checkbox
    if($("#div-node-x").hasClass("active")){
    	$("#third-class-div input[name='nodeX[]']").removeAttr('checked');
    }
}

function responseFilter(data,source)
{
	$("#first-class-div").html(data);
	NProgress.done();
}

function instanceClassProperty()
{
	var is_instance = $("#is_instance").val();
	$(".classes_top_cl").click();
	if(is_instance == 'N')
	{
		var node_y_class_id = $("#node_y_class_id").val();
		if(parseInt(node_y_class_id) > 0)
		{
			NProgress.start();
		    $.post(domainUrl+'classes/getClassInstance',{'class_id':node_y_class_id,'mode':'Normal'},responseGetClassInstance,'html');
		}
	}
	else
	{
		GoTo(2);
	}
}

function setInstance()
{
	$("#is_instance").attr('value','N');
	$(".ins").remove();
	setWidth();
	setTimeout('instanceClassProperty()',1000);
}

function responseGetClassInstance(data,source)
{
	$("#div-node-x").before(data);
	var footerHtml = '<li class="ins strat_click" ><a href="#">Instance List</a></li><li class="ins strat_click" ><a href="#">Instance Properties</a></li>';
	$("#node-x-li").before(footerHtml);
	NProgress.done();
	
	$("#is_instance").attr('value','Y');
	manageRightMenuIcon('listing','classes');
	$(".AddNewInstance_li").show();
	$(".AddNewClass_li").hide();
	if($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
	{
		$(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","none");
        $(".ExportInstanceData_li").addClass('inactive');
    	$(".ExportInstanceData_li").find('a').css("pointer-events","none");
    	$(".All_li").addClass('inactive');
        $(".All_li").find('a').css("pointer-events","none");
        $(".Draft_li").addClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","none");
        $(".Published_li").addClass('inactive');
        $(".Published_li").find('a').css("pointer-events","none");
    	$(".Edit-icon").hide();
        $(".Cancel-icon").hide();
	}
	else
	{
		$(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","all");
        $(".ExportInstanceData_li").removeClass('inactive');
		$(".ExportInstanceData_li").find('a').css("pointer-events","all");
		$(".All_li").removeClass('inactive');
        $(".All_li").find('a').css("pointer-events","all");
        $(".Draft_li").removeClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","all");
        $(".Published_li").removeClass('inactive');
        $(".Published_li").find('a').css("pointer-events","all");
		$(".Edit-icon").show();
	}
	$(".ExportInstanceData_li").show();
	$(".GenerateInstanceTemplate_li").show();
	$(".ImportInstanceData_li").show();	
	initialLoad();
	GoTo(2);
}

function getInstanceStructure(id)
{
	$(".list-row-instance-class").removeClass('current');
	$("#list-row-instance-id_"+id).addClass('current');
	NProgress.start();
    $.post(domainUrl+'classes/instanceStructure',{'node_instance_id':id,'mode':'Display'},responseInstanceStructure,'html');
}

function responseInstanceStructure(data,source)
{
	$("#second_instance_div").html(data);
	NProgress.done();
    setPaperBckgrnd();
}

function paginationInstanceAjax(url,page,order_by,order,itemPerPage)
{
	NProgress.start();
	var node_class_id = $("#node_y_class_id").val();
	$.post(url,{'page':page,'order_by':order_by,'order':order,'class_id':node_class_id,'mode':'pagination','itemPerPage':itemPerPage},responsePaginationInstanceAjax,'html');
}

function setPageInstance(value)
{
	NProgress.start();
	var node_class_id = $("#node_y_class_id").val();
	$.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','mode':'pagination','itemPerPage':value,'class_id':node_class_id},responsePaginationInstanceAjax,'html');
}

function paginationInstanceAjaxList(url,page,order_by,order)
{
	NProgress.start();
	var node_class_id = $("#node_y_class_id").val();
	$.post(url,{'page':page,'order_by':order_by,'order':order,'class_id':node_class_id,'mode':'no-pagination'},responsePaginationInstanceAjax,'html');
}

function responseInstanceFilter(data,source)
{
	$("#first_instance_div").html(data);
	NProgress.done();
	stopLastElementInstanceTabbing()

	if($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
	{
		$(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","none");
        $(".ExportInstanceData_li").addClass('inactive');
    	$(".ExportInstanceData_li").find('a').css("pointer-events","none");
    	$(".All_li").addClass('inactive');
        $(".All_li").find('a').css("pointer-events","none");
        $(".Draft_li").addClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","none");
        $(".Published_li").addClass('inactive');
        $(".Published_li").find('a').css("pointer-events","none");
    	$(".Edit-icon").hide();
        $(".Cancel-icon").hide();
	}
	else
	{
		$(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","all");
        $(".ExportInstanceData_li").removeClass('inactive');
		$(".ExportInstanceData_li").find('a').css("pointer-events","all");
		$(".All_li").removeClass('inactive');
        $(".All_li").find('a').css("pointer-events","all");
        $(".Draft_li").removeClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","all");
        $(".Published_li").removeClass('inactive');
        $(".Published_li").find('a').css("pointer-events","all");
		$(".Edit-icon").show();
	}
}

function responsePaginationInstanceAjax(data,source)
{
	$("#first_instance_div").html(data);
	NProgress.done();
	/*Code for toggling of the buttons*/
	if(selectedbtn1 == "barBtn1"){
	   $('.barBtn1 .fa').removeClass("barIcon").addClass("squareIconGray");
	   $('.powerBtn1 .fa').removeClass("powerIcon").addClass("squareIconArrowWhite");
	} else {
	   $('.barBtn1 .fa').removeClass("squareIconGray").addClass("barIcon");
	   $('.powerBtn1 .fa').removeClass("squareIconArrowWhite").addClass("powerIcon");
	}

	if($.trim($('#first_instance_div div.set-content-height tr.list-row td').text()) == 'No Instance Found')
	{
		$(".DeleteClasses_li").addClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","none");
        $(".ExportInstanceData_li").addClass('inactive');
    	$(".ExportInstanceData_li").find('a').css("pointer-events","none");
    	$(".All_li").addClass('inactive');
        $(".All_li").find('a').css("pointer-events","none");
        $(".Draft_li").addClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","none");
        $(".Published_li").addClass('inactive');
        $(".Published_li").find('a').css("pointer-events","none");
    	$(".Edit-icon").hide();
        $(".Cancel-icon").hide();
	}
	else
	{
		$(".DeleteClasses_li").removeClass('inactive');
        $(".DeleteClasses_li").find('a').css("pointer-events","all");
        $(".ExportInstanceData_li").removeClass('inactive');
		$(".ExportInstanceData_li").find('a').css("pointer-events","all");
		$(".All_li").removeClass('inactive');
        $(".All_li").find('a').css("pointer-events","all");
        $(".Draft_li").removeClass('inactive');
        $(".Draft_li").find('a').css("pointer-events","all");
        $(".Published_li").removeClass('inactive');
        $(".Published_li").find('a').css("pointer-events","all");
		$(".Edit-icon").show();
	}
}

function listPageInstance(displayType)
{
	var node_class_id = $("#node_y_class_id").val();
	if(displayType == 'Y')
	{
		selectedbtn1  = "powerBtn1";
		NProgress.start();
		var value = $("#temp_item_per_page_instance").val();
		$.post(domainUrl+'classes/getClassInstance',{'page':1,'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':'pagination','itemPerPage':value},responsePaginationInstanceAjax,'html');
	}
	else
	{
		selectedbtn1  = "barBtn1";
		NProgress.start();
		$.post(domainUrl+'classes/getClassInstance',{'order_by':'node_instance_id','order':'DESC','class_id':node_class_id,'mode':'no-pagination'},responsePaginationInstanceAjax,'html');
	}
}

function stopLastElementTabing(){
	// code to stop last tab from popingup and breakingup the layout
	var id = $('.property-child li').last().children().find('input').attr('id');
	var firstID = $('#class_structure_form li').first().children().find('input').first().attr('id');
	$("body").on('keydown', '#'+id+',#'+firstID, function(e) { 
		var keyCode = e.keyCode || e.which;
		if (keyCode == 9) { 
		e.preventDefault(); 
		// call custom function here - Vimmy for last tab functionality
		} 
	});
}

function nodexSelection(){
	
	var selctedliId="";
	var selctedCheckarray = [];
	var selctedCheckarrayNodeY = [];
	$('body').on("click",'#second-class-div li',function(e){  
	   selctedliId="";
	   
      // $("#second-class-div li .node-content").removeClass("highlightNode");
       selctedliId = $(this).attr("data-class");
	   /*Setting the custom code id in local storage so that we can pull that id after ajax call and apply highliging to it*/
	   localStorage.setItem("liItemNumber",selctedliId);
	   /*End Vimal*/
       
	   console.log("dfdgf selctedliId",selctedliId);
       if(selctedliId != undefined){
		   
	       if($('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr('nodey-value')!=""){
		       	if($("#NodeX-tab:visible").hasClass("nodexdisplay")){
	                        $(".sprite-icon").css("visibility","hidden");
							selctedCheckarrayNodeY = $('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr("NodeY-value");
							console.log("selctedCheckarraydisplay",selctedCheckarrayNodeY);
							if(selctedCheckarrayNodeY != undefined){
								var pp =selctedCheckarrayNodeY.split(',');
								for(i=0;i<pp.length;i++){
								   $('#third-class-div span[id='+pp[i]+']').css("visibility","visible");
								}
							}
							
							if($("#div-node-x-property").hasClass("active")){
	                            parentDivSelection('Display');
						    }
		       	} 
		        else {      
	                        $("input[name='nodeX[]']").removeAttr('checked');
							selctedCheckarrayNodeY = $('[data-class='+selctedliId+']').find('.hidden-node-x:first').attr("NodeY-value");
							console.log("selctedCheckarraycheckbox",selctedCheckarrayNodeY);
							if(selctedCheckarrayNodeY != undefined){
								var pp =selctedCheckarrayNodeY.split(',');
								for(i=0;i<pp.length;i++){
								   $('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
								}
							}
							if($("#div-node-x-property").hasClass("active")){
							   parentDivSelection('Edit');
						    }
				}
	       } else {
	       
	       	 $("input[name='nodeX[]']").removeAttr('checked');
	       	 $(".sprite-icon").css("visibility","hidden");
	       	 $('#third-class-div li:first').addClass("thirdPaneActive");
	       }
	    }
      // $('[data-class='+selctedliId+']').find('.node-content:first').addClass("highlightNode");
      
       e.stopPropagation();
    });
}

function selectthirdNodeX(){

    if(currentmode == "Display"){
    	//console.log("display");
	    $('.thirdnodeX-Panel').css("visibility","hidden");
	    var selctedCheckarray = $("#second-class-div").find(".node-selected .hidden-node-x").val();
	    
	    if(selctedCheckarray != undefined){
			var pp =selctedCheckarray.split(',');
			for(i=0;i<pp.length;i++){
				//console.log("values",pp[i]);
			    $('#fourh-class-div [id='+pp[i]+']').css("visibility","visible");
			}
	    }
    } else {
       
        /*// $('.thirdnodeX-Panel').css("visibility","hidden");
	    var selctedCheckarray = $("#second-class-div").find(".node-selected .hidden-node-x").val();
	     //console.log("edit",selctedCheckarray);
	    if(selctedCheckarray != undefined){
		   
			var pp =selctedCheckarray.split(',');
			for(i=0;i<pp.length;i++){
				//console.log("values",pp[i]);
			    $('#fourh-class-div input[id='+pp[i]+']').prop('checked','checked');
			}
	    }*/
    }
}

function parentDivSelection(mode)
{
 	  var firstSelectedNode = 0;
 	  var flag = true;
 	  if(mode == "Display"){
	      $("#third-class-div .sprite-icon").each(function(i,v){
	        var visiblityshow = $(this).css("visibility");
	        if(visiblityshow == "visible"){
	        	if(flag == true){
	        		firstSelectedNode = $(this).attr("id");
	        		$('#third-class-div li').removeClass("thirdPaneActive");
	        		$(this).closest('li').addClass("thirdPaneActive");
	        		flag = false;
	        	}
	        }
			});
	       
	       //$('[id='+firstSelectedNode+']').trigger( "click" );
            var selctedliId = $('#third-class-div [id='+firstSelectedNode+']').parent().find('.node-input').attr("data-class");
            var selctedlname = $('#third-class-div [id='+firstSelectedNode+']').parent().find('.node-input').find('span').html();
            if(selctedliId == undefined){
        	    selctedliId ="Display_0"
            }
             //console.log("selctedliIdicon",selctedliId);
      } else {
            $('#third-class-div .nodeClass-Y input').each(function(i,v){
			     var firstChecked = $(this).prop('checked');
			     if(firstChecked == true){
		        	if(flag == true){
		        		firstSelectedNode = $(this).attr("id");
		        		$('#third-class-div li').removeClass("thirdPaneActive");
		        		$(this).closest('li').addClass("thirdPaneActive");
		        		flag = false;
		        	}
	            }
			});
			if(flag == true){
				$('#third-class-div li:first').addClass("thirdPaneActive");
			}
			
             var selctedliId = $('#third-class-div [id='+firstSelectedNode+']').parent().parent().find('.node-input').attr("data-class");
             var selctedlname = $('#third-class-div [id='+firstSelectedNode+']').parent().parent().find('.node-input').find('span').html();	
             
            if(selctedliId == undefined){
        	    selctedliId ="Edit_0"
            }
       }
        var NodeYId = selctedliId.split("_");
        if(NodeYId[0] == "Display"){
            currentmode = "Display";
        } else {
            currentmode = "Edit";
        }
        
	    $("#property-heading").html('');
        if($("#node-x-li a").html()=='Node X'){
               var nodeXPropertyName = selctedlname;
          }else {
              var nodeXPropertyName = selctedlname;
          }
		$("#property-heading").html(cutString(nodeXPropertyName));

        var node_id = $('.node-selected input').val();

        $.post(domainUrl+'classes/checkInstanceData',{'node_class_id':NodeYId[1],'node_id':node_id,'full_class_id':selctedliId,'selctedlName':nodeXPropertyName},responsecheckInstanceData,'json');
}

function defaultSelection(){
	
	var pp=[];
    var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');
    
    if(value != undefined){
    	
     pp = value.split(',');
        for(i=0;i<pp.length;i++){
            $('span[id='+pp[i]+']').css("visibility","visible");
            $('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
        }
    }
    
     $('#third-class-div li:first').addClass("thirdPaneActive");
     var selctedliId  = $("li.thirdPaneActive .node-input").attr("data-class");

     var selctedlName = $("li.thirdPaneActive .node-input").find('span').html();

     if(selctedliId == undefined){
        selctedliId ="Display_0";
        selctedlName ="Display";
     }
     divideInThreePane(selctedliId,selctedlName);
}

function divideInThreePane(selctedliId,selctedlName){
	$('li').removeClass('thirdPaneActive');
	//code for divide in three pane
   // var panewidth = $('.content-wrapper-new').width();
  //  var threepanenode = panewidth/3
  //  $(".listing-wrapper").removeClass("active");
   // $(".display-wrapper:first").addClass("active");
  //  $("#div-node-x").addClass("active");
   // $('#div-node-x-property').addClass('active');
   // $('.content-wrapper-new').find('.dashSlider.active').css('width',threepanenode);
    $('[data-class='+selctedliId+']').closest('li').addClass('thirdPaneActive');
    var nodeXPropertyName= '';
    //code for breadcrumb 
    var NodeYId = selctedliId.split("_");
    
    if(NodeYId[0] == "Display"){
        
        currentmode = "Display";

    } else {
        
        currentmode = "Edit";
    }
    $("#property-heading").html('');
    if($("#node-x-li a").html()=='Node X'){
            nodeXPropertyName = 'Node X (Properties): '+selctedlName;
      }
      else if($("#node-x-li a").html()=='Node Z'){
           nodeXPropertyName = 'Node Z (Properties): '+selctedlName;
     }
     else {
     	   nodeXPropertyName = 'Node Y (Properties): '+selctedlName;	
     }
	$("#property-heading").html(cutString(nodeXPropertyName));

	

	var classId = $("#node_y_class_id").val();
    var node_id = $('.node-selected input').val();	
 	$.post(domainUrl+'classes/checkInstanceData',{'node_class_id':NodeYId[1],'node_id':node_id,'full_class_id':selctedliId,'selctedlName':nodeXPropertyName},responsecheckInstanceData,'json');
    //$.post(domainUrl+'classes/instanceStructure',{'mode':NodeYId[0],'node_class_id':NodeYId[1],'node_id':node_id},responsenodex,'html');
    if(currentmode=='Edit' || currentmode=='Display'){
    	$("#instance_structure_form").attr('class','form_active1');
    }
}

function divideInThreePaneX(selctedliId,selctedlName){
	$('li').removeClass('thirdPaneActive');
	//code for divide in three pane
    // var panewidth = $('.content-wrapper-new').width();
    // var threepanenode = panewidth/3
    // $(".listing-wrapper").removeClass("active");
    // $(".display-wrapper:first").addClass("active");
    // $("#div-node-x").addClass("active");
    // $('#div-node-x-property').addClass('active');
    // $('.content-wrapper-new').find('.dashSlider.active').css('width',threepanenode);
    if(selctedliId == "Edit_0"){
        $("#third-class-div li:first").addClass('thirdPaneActive');
    } else {
    	 $('[data-class='+selctedliId+']').closest('li').addClass('thirdPaneActive');
    }
   

    //code for breadcrumb 
    var NodeYId = selctedliId.split("_");
    
    if(NodeYId[0] == "Display"){
        
        currentmode = "Display";

    } else {
        
        currentmode = "Edit";
    }
    
    
    $("#property-heading").html('');
        if($("#node-x-li a").html()=='Node X'){

               var nodeXPropertyName = 'Node X (Properties): '+selctedlName;
          }else {
              var nodeXPropertyName = 'Node Z (Properties): '+selctedlName;
          }
		$("#property-heading").html(cutString(nodeXPropertyName));

	var classId = $("#node_y_class_id").val();
    var node_id = $('.node-selected input').val();
	$.post(domainUrl+'classes/addNewInstance',{'node_class_id':NodeYId[1]},responsenodex,'html');
    if(currentmode=='Edit' || currentmode=='Display'){
    	$("#instance_structure_form").attr('class','form_active1');
    }
    
}

function divideInThreePaneInstance(selctedliId,selctedlName){
	$('li').removeClass('thirdPaneActive');
	//code for divide in three pane
    // var panewidth = $('.content-wrapper-new').width();
    // var threepanenode = panewidth/3
    // $(".listing-wrapper").removeClass("active");
    // $(".display-wrapper:first").addClass("active");
    // $("#div-node-x").addClass("active");
    // $('#div-node-x-property').addClass('active');
    // $('.content-wrapper-new').find('.dashSlider.active').css('width',threepanenode);
    $('[data-class='+selctedliId+']').closest('li').addClass('thirdPaneActive');

    //code for breadcrumb 
    var NodeYId = selctedliId.split("_");
    if(NodeYId[0] == "Display"){
        
        currentmode = "Display";

    } else {
        
        currentmode = "Edit";
    }
    
   	$("#property-heading").html('');
        if($("#node-x-li a").html()=='Node X'){
               var nodeXPropertyName = 'Node X (Properties): '+selctedlName;
          }else {
              var nodeXPropertyName = 'Node Z (Properties): '+selctedlName;
          }
		$("#property-heading").html(cutString(nodeXPropertyName));



	var classId = $("#node_y_class_id").val();
    var node_id = $('.node-selected input').val();
	
    $.post(domainUrl+'classes/instanceStructure',{'mode':NodeYId[0],'node_class_id':NodeYId[1],'node_id':node_id},responsenodex,'html');
    if(currentmode=='Edit' || currentmode=='Display'){
    	$("#instance_structure_form").attr('class','form_active1');
    }
}

function responsecheckInstanceData(data,source){

    	if(data.checkvalue>0){
    		divideInThreePaneInstance(data.full_class_id,data.selctedliId);

    	}
    	else {
    		divideInThreePaneX(data.full_class_id,data.selctedliId);
    	}
}

function responsenodex(d,s){
	$("#fourh-class-div").html(d);
    NProgress.done();
    setPaperBckgrnd();
    $("#instance_structure_form").attr('class','form_active1');
	
	/*if($("#node-x-li a").html() == "Node Z"){
    	$(".Nodex-icon").show();
	}else {
		$(".Nodez-icon").show();	
	}*/
}

function responseinstanceData(d,s)
{
	if($('.node-content.node-selected input').val()!=undefined){
		combineVal = $('.node-content.node-selected input').val().split(",");
	}
	else {
		combineVal = '';
	}
	if($('.nodeClass-Y input[value='+d.selected_node_class_id+']').prop("checked") == true){
		combineVal.push(d.node_id);
	} else {
		for(var i =0;i<combineVal.length; i++){
			if (combineVal[i] === d.node_id) combineVal.splice(i, 1);
		}
	}

	$('.node-content.node-selected input').val('')
	$('.node-content.node-selected input').val(combineVal);
	combineVal=[];
	if($('.node-content.node-selected input').val()==""){
		$('.node-content.node-selected input').val('0');
	}
}
    
function thirdPaneselection(){
	var pp=[];
	var value = $("#second-class-div").find(".node-selected .hidden-node-x").attr('nodey-value');
	if(value != undefined){
	pp = value.split(',');
	for(i=0;i<pp.length;i++){
	$('span[id='+pp[i]+']').css("visibility","visible");
	$('#third-class-div input[value='+pp[i]+']').prop('checked','checked');
	}
	}
	$('#third-class-div li:first').addClass("thirdPaneActive");
}

function saveInstanceVal(){
	if($.trim($("#node_instance_id").val()) == "")
    $("#instance_action_type").attr('value','save');
	else
    $("#instance_action_type").attr('value','edit');
    
    if($.trim($("#instance_caption").val()) != "")
	/*check here third pane node class id*/
	 var selctedliId  = $("#third-class-div .thirdPaneActive").find('.node-input').attr("data-class");
     var selctedlName = $("#third-class-div .thirdPaneActive").find('.node-input').attr("data-name");
     var classId = selctedliId.split("_");
	 var NodepropertyName = $(this).find('.node-input').find('span').html();
	 var node_id = $('.node-selected input').val();
	 $.post(domainUrl+'classes/saveInstanceData',{'data':$("#instance_structure_form").serialize()},responseInstanceNodeId,'json');
     
     //var node_id = $('.node-selected input').val();
     //$.post(domainUrl+'classes/checkInstanceData',{'node_class_id':classId[1],'node_id':node_id,'full_class_id':selctedliId,'selctedlName':NodepropertyName},responsecheckInstanceData,'json');
}

function responseInstanceNodeId(data,source){
	var appendInstanceId = $("#second-class-div").find(".node-selected .hidden-node-x").val();
	var instanceFlag = 0;
	$("#second-class-div").find(".node-selected .hidden-node-x").val(appendInstanceId+','+data.node_id);
	if(data.node_id!=""){
		
		if($.trim($("#node_y_class_id").val()) == "")
			$("#action_type").attr('value','save');
		else
			$("#action_type").attr('value','edit');
		sendClassJson();
		var myJsonString = JSON.stringify(classBuilder);
		
		$.post(domainUrl+'classes/saveClass',{'data':$("#class_structure_form").serialize(),'propertyJson':myJsonString,'mode':'normal'},responseSaveClassProperty,'html');    		
	}
}

/*code here to check string length and display after length character*/


/*function cutString_bk(test){
			
			var newVar 		= '', withnewVar  = '', string = '',withstr='';
			if(test!=''){	 
				string 	  = test.split(":");
			
			if(string[1]!='' && string[1]!=undefined){
				if(string[1].length > 15)
				{
					newVar = string[1].substr(0,15);
					if($("#node-x-li a").html()=='Node X'){
						return "Node X (Properties): "+newVar+"...)";
					}
					else {
						return "Node Z (Properties): "+newVar+"...)";
					}
				}
				else
				{
					if($("#node-x-li a").html()=='Node X'){
						return "Node X (Properties): "+string[1];
					}
					else {
						return "Node Z (Properties): "+string[1];
					}
				}				
			}
			else {
				if(withstr[1].length > 15){
					 newVar = withstr[1].substr(0,15);
					if($("#node-x-li a").html()=='Node X'){
						return "Node X (Properties): "+newVar+"...)";
					}
					else {
						return "Node Z (Properties): "+newVar+"...)";
					}
				}
				else
				{
					if($("#node-x-li a").html()=='Node X'){
						return "Node X (Properties): "+withstr[1];
					}
					else {
						return "Node Z (Properties): "+withstr[1];
					}
				}
			}
		}
}*/

function cutString(test){

    var newVar = '', string = '', withstr='';
	if(test!='' && test!=undefined){
		string           = test.split(":");

		if(string[1]!='' && string[1]!=undefined){
			
			if(string[2]!='' && string[2]!=undefined){

				if(string[2].length > 17)
					{
					newVar  = string[2].substr(0,17);
					withStr = string[1]+': '+newVar+"...)";
					return withStr;
					}
				else
					{
					withStr = string[1]+': '+string[2];
					return withStr;
					}
			}
			else 
			{
				if(string[1].length > 17)
				{
				newVar  = string[1].substr(0,17);
				withStr = string[0]+': '+newVar+"...)";
				return withStr;
				}
				else
				{
				withStr = string[0]+': '+string[1];
				return withStr;
				}

			}

		}

	}
}



function getSubClassStructure(node_class_id, subchildid){
	if($('.class-structure-within-subclass').hasClass('subclass-'+subchildid)){
		$('.subclass-'+subchildid).remove();
	}else{
		$('#temp-class').attr('value', subchildid);
		$.post(domainUrl+'classes/subClassStructure',{'class_id':node_class_id},getSubClassResponseStructure,'html');
	}			
}


function getSubClassResponseStructure(data,source){
	var subchildid = $('#temp-class').attr('value');
	$('.temp-sub-class-'+subchildid).closest('li').append(data);
	$('.temp-sub-class-'+subchildid).closest('li').children('.class-structure-within-subclass').addClass('subclass-'+subchildid);
}

