var keyIdArray=[];
var IDArray = [];
var roleArray = {};
var mainDivId;
var currentrollId = [];
var clickedRole;
var workflowAjaxUrl = 'ajaxhandler/workflow-ajaxhandler.php';
var clickedRoleactionId;
var flag = 0;
var count=0;
var EditPhase=0;
var EditOperation=0;
$approvedRoles=['Survey Administrator','Surveyor','Dealer Warranty Manager','Workflow Manager','Work Executive'];

$(document).ready(function(){
//hideAdministratorAddRole();
    //for scrollbar
    //var operationwrapHeight = $('.workflow-wrapper').height()-$('.operation-item').outerHeight();
    
    
    //dynamicHeightWidth();
    
});

$(function(){

    var Snippet = '<li class="operation relPosition phaseRow innerOperations"><div class="propBtn show-popup hide" data-target="#add-workflow-note" data-open="add-workflow-note" onclick="javascript:setModalName(this)"></div><div class="operation-item relPosition clearfix"><input placeholder="Enter Phase" class="operation_input form-control" type="text" value="" maxlength="18"/></div></li>';
    var rollSnippetDefault = '<div class="operation-item relPosition  operationItem phaseRow innerOperations"></div>';
    $('body').on('click','.addPhase',function(){
        
        if(workflowTextEditMode==1){
            return false;
        }
		
	$(".newDivAppend, .operation-wrap").sortable("disable");
        
	if(globalSubPhase==0)
		{		
        $('#default-phase').prepend(Snippet);
        $('#default-phase .operation_input').focus();
		}
		else{
		 $('#'+ globalSubID).prepend(Snippet);
         $('#'+ globalSubID + ' .operation_input').focus();	
		}
                var kk= $(rollSnippet).attr("id","defaultrollSnippet");
                     if(EditPhase==0){
			
			if(globalSubPhase==0)	
			{
			$(".workflow-survey-section .statemachine-demo").find(".newDivAppend").prepend(kk);
			}
			else{
			$("." + globalSubID + " .statemachine-demo").find(".newDivAppend").prepend(kk);	
			}
		
			}
			
			EditPhase=0;
                        workflowTextEditMode=1;
                        maintainAbsLineHeight();
                        detAtt();
		
    });


    var phaseSnippet = '<span class="title">%name%</span><span class="addOperation left operationAddBtn"><i class="icon added"></i></span><span class="closeOperation right"><i class="icon small-close"></i></span>';
    var rollSnippet = '<div class="operation-item relPosition  operationItem phaseRow innerOperations"></div>';
	var hold_operation = false;
    $("body").on("keypress blur",".operation_input", function(event) {
        var currentItem = $(this).parent().parent().parent().attr('id');
        var $mykeycode = (event.keyCode ? event.keyCode : event.which);
        if (($mykeycode === 13 || $mykeycode==0) && $.trim($(this).val()).length>0){
			if(hold_operation==true){
				return false;
			}
			hold_operation = true;			
            workflowTextEditMode=0;
            $(".operation_input").each(function(i,v){
                if($(v).val().length<=0){
                    $(v).parent().remove();
                }
            })
            $(".operation_sub_input").each(function(i,v){
                if($(v).val().length<=0){
                    $(v).parent().remove();
                }
            })
			
			
            var phaseId = "phaseId_" + new Date().getTime().toString();

            var k= phaseSnippet.replace('%name%',$.trim($(this).val()))
            $(this).parent().prepend(k);
			$(this).parent().parent().find(".propBtn").removeClass("hide");
 			if(EditPhase==0){
            $(this).parent().parent().attr("phase-Id",phaseId);
            }
			$(this).remove();

            var kk= $(rollSnippet).attr("Id",phaseId);
            
            $("#defaultrollSnippet").remove();
            
            if(EditPhase==0){
			
			if(globalSubPhase==0)	
			{
			$(".workflow-survey-section .statemachine-demo").find(".newDivAppend").prepend(kk);
			}
			else{
			$("." + globalSubID + " .statemachine-demo").find(".newDivAppend").prepend(kk);	
			}
		
			}
			
			EditPhase=0;
			$(".newDivAppend, .operation-wrap").sortable( "option", "disabled", false );
            maintainAbsLineHeight();
            detAtt();                        
       		hold_operation = false;			
	}    
            $(".workflow-nano").trigger("update");    
            dynamicHeightWidth();
    });


    var SnippetOpt = '<li class="operation operation-sub-item relPosition innerOperations"><div class="propBtn show-popup hide" data-target="#add-workflow-note" data-open="add-workflow-note" onclick="javascript:setModalName(this)"></div><input placeholder="Enter Operation" class="operation_sub_input form-control" type="text" value="" maxlength="32"/></li>';
    var addwindowDivDefault = '<div class="operation-item relPosition  operationItem" id="defaultAddWindow"></div>';
    $('body').on('click','.addOperation',function(event){
        if(workflowTextEditMode==1){
            return false;
        }
		$(".newDivAppend, .operation-wrap").sortable("disable");
        var parentPhaseIdDefault = $(this).parent().parent().attr("phase-Id");
        $(SnippetOpt).insertAfter($(this).parents('.operation'));
        $('.operation_sub_input').focus();
        $(addwindowDivDefault).insertAfter($('#'+parentPhaseIdDefault));
         maintainAbsLineHeight();
         detAtt();
        workflowTextEditMode=1;
        
	event.stopPropagation();
    });
    var operationSnippet = '<i class="icon-move"></i><span class="title">%name%</span><i class="icon operation-close small-close right"></i>';
    var addwindowDiv = '<div class="workflow-action-block-relative addwindow operationItem innerOperations" phase-Id="%phaseid%" id="%roleid%"></div>';

 
    $("body").on("keypress blur",".operation_sub_input", function(event) {
		var $mykeycode = (event.keyCode ? event.keyCode : event.which);
        if (($mykeycode === 13 || $mykeycode==0) && $.trim($(this).val()).length>0){
			if(hold_operation==true){
				return false;
			}
			hold_operation = true;						
        workflowTextEditMode=0; 
        $(this).parents("li").addClass("relPosition1");
        $(this).parents("li").removeClass("relPosition");            
            $(".operation_sub_input").each(function(i,v){

                if($(v).val().length<=0){
                    $(v).parent().remove();
                }
            })
            var subItem = "subItem_" + new Date().getTime().toString();
            var roleBlock = "roleBlock_" + new Date().getTime().toString();
            var k= operationSnippet.replace('%name%', $.trim($(this).val()));
            $(this).parent().append(k);
			$(this).parent().parent().find(".propBtn").removeClass("hide");
            $("#defaultAddWindow").remove();
            if(EditOperation==0){
			$(this).parent().addClass(subItem);
			}
            $(this).parent('.operation-sub-item').find('.dragging_workflow').show();
            //            console.log($(this));
            if(EditOperation==0)
			{
            $(this).parent('.operation-sub-item').attr("role-Id",roleBlock)
            var parentPhaseId = $(this).parent().prev().attr("phase-Id");
            $(this).parent('.operation-sub-item').addClass(parentPhaseId);
            $(this).parent('.operation-sub-item').attr("phase-Id",parentPhaseId);
            }
            if(EditOperation==1){
			var roleBlockNewID = $(this).parent('.operation-sub-item').attr('role-id');
				if($.trim($(this).val()).length>16){
					var getNewVal = $.trim($(this).val()).substring(0, 15) + "...";
					$("#"+roleBlockNewID).find(".roName").text(getNewVal);	
					$("#"+roleBlockNewID).find(".roName").attr("data-value",$.trim($(this).val()));	
				}
				else{
					$("#"+roleBlockNewID).find(".roName").text($.trim($(this).val()));
					$("#"+roleBlockNewID).find(".roName").attr("data-value",$.trim($(this).val()));	
				}
			}

			$(this).remove();     
            var addWindow  = addwindowDiv.replace('%roleid%',roleBlock);
            var addwindowbody  = addWindow.replace('%phaseid%',parentPhaseId);
    		            
            if(EditOperation==0)
			{
            $(addwindowbody).insertAfter($('#'+parentPhaseId));
            }

            var operationHeight = $("[role-id="+roleBlock+"]").outerHeight();
            $("#"+roleBlock).height(operationHeight - 21);
            //console.log("height", operationHeight);
            $(".workflow-action-block-relative").attr("name",$.trim($(this).val()));
			$(".newDivAppend, .operation-wrap").sortable( "option", "disabled", false );
            dynamicHeightWidth();
            maintainAbsLineHeight();
            detAtt();
		    EditOperation=0;
			hold_operation = false;			
        }
    });

    $("body").on("click",".closeOperation", function(e) {
        
        var getCurrentPhaseID = $(this).parents(".operation").attr("phase-id");
        
        $("."+getCurrentPhaseID).each(function(){
            $(this).find(".small-close").trigger("click");
        });
        
        $(this).parents(".operation").remove();
        $("#"+getCurrentPhaseID).remove();
        
    });


    $("body").on("click",".section-close", function(e) {
        var section = $(this).parent().parent().parent().attr('id');
        var sectionNav = $("[section-id="+section+"]").parent().attr('id');
        $("[section-id="+section+"]").each(function(i,value){
           $(this).find(".action-block-title .close-ab ").trigger("click");
           });
        
        //$("[role-id="+sectionNav+"]").remove();
        //$("#"+sectionNav).remove();
        //$("[section-id="+section+"]").remove();
        getNextSibblings = $(this).parent().parent().nextAll();
        
        $(this).parent().parent().parent().remove();

        if(globalSubPhase==0)
        {    
            var currentDiv  = '.workflow-survey-section';
        }
        else{
            var currentDiv  = '.' + globalSubID;
        }
        
        
        getNextSibblings.each(function(){
            var shiftBoxes = $(this).attr("id");
            if(shiftBoxes != undefined){
                if($(currentDiv + " [section-id="+shiftBoxes+"]").attr("id") !=undefined){   
                var newLeft = $(currentDiv + " [section-id="+shiftBoxes+"]").position().left-280;
                $(currentDiv + " [section-id="+shiftBoxes+"]").css("left",newLeft);
                }
            }
        });
        
        $(currentDiv + " #operationId .wf-wrap:first").css("margin-left","0px");
        
        if(globalSubPhase==0)
        {    
            var elm  = $('.workflow-survey-section .workflow-action-block');
        }
        else{
            var elm  = $('.' + globalSubID + ' .workflow-action-block');
        }
    
        var wd = $(elm).width();
        $(elm).width(wd-280);
        $('.scroll-content').width(wd-280);
        
        if($('.scroll-content').width()<=304){
           $('.scroll-content').width(305); 
        }
        
        
       
        if($('.workflow-editor').outerWidth() < $('.scroll-content').width()){
            $('body .hor-scroll').mCustomScrollbar("update");
        }
        if ($(window).width() < 1368) {
            if($(".default-admin").length>2 ){
                if($('.workflow-editor').outerWidth() > $('.scroll-content').width()){
                    $('body .hor-scroll').mCustomScrollbar("update");
                }
            }
        }
        else {
            if($(".default-admin").length>3 ){
                if($('.workflow-editor').outerWidth() > $('.scroll-content').width()){
          
                    $('body .hor-scroll').mCustomScrollbar("update");
                }
            }
        }
       
   
     
        $("[sectionid="+section+"]").remove();
        var leftvalue=0;
        
        if(globalSubPhase==0){
           var getLine  = ".workflow-survey-section .absLine";
           var getLineFirst  = ".workflow-survey-section .absLine:first";
        }
        else{
           var getLine = "." + globalSubID + " .absLine"; 
           var getLineFirst  = "." + globalSubID + " .absLine:first"; 
        }
        
        $(getLine).each(function(i,v){
            $(v).css("left",leftvalue);
            leftvalue = leftvalue+280;
        });
        
        $(getLineFirst).css("left","-1px");
    
        if(globalSubPhase==0){    
        $('.workflow-survey-section .operation-head').outerWidth($('.workflow-survey-section .workflow-action-block').outerWidth());
        }
        else{
        $('.' + globalSubID + ' .operation-head').outerWidth($('.' + globalSubID + ' .workflow-action-block').outerWidth());    
        }
    
        detAtt();
        dynamicHeightWidth();  
    
    });

    $(".save-workflow").click(function(e) {
        workflowProcess.saveWorkflow();
    });
    $("body").on("click",".operation-close", function(e) {
   
        $(this).parent().remove();
        var divRollId = $(this).parent().attr('role-id');
        mainDivId = $("#"+divRollId).find('.w').first().attr('id');
        keyIdArray = Object.keys(myarray);
        //var keyId = getKeyByValue(mainDivId); 
        // console.log(keyIdArray);
        var removeConnection=[];
        var removeConnectionTarget=[];

        // console.log("keyId",keyId);
        $("#"+divRollId).find('.kk').each(function(i,v){
            console.log("connectiomns",v.id);
            removeConnection.push(v.id);
			var removeFromActionNoteArray = $(this).attr("id");
			removeFromActionNoteArray = removeFromActionNoteArray.replace("fromTemplate","actionTemplate");
			delete ActionNote[removeFromActionNoteArray];
        })
        $.each(removeConnection,function(i,v){
            console.log("connecions",v);
            inst.detachAllConnections(v)
        });
        $.each(keyIdArray,function(i,v){
      
            if(myarray[v]==mainDivId){
                inst.detachAllConnections(v);
                jsPlumb.remove(v);
            }
   
        });
        $("#"+divRollId+ " .action-block-title .close-ab").trigger("click");
        $(this).parent().remove();
        $("#"+divRollId).remove();
        detAtt();

    });
    var leftvalue=0;
    $('.absLine').each(function(i,v){
        $(v).css("left",leftvalue);
        leftvalue = leftvalue+300;

    });
    
    $("body").on("click",".kk .close-ab", function(e) {

                var currentIndex = $(this).index( this );
 		var removeActionArray = $(this).parent().attr("id");
                removeActionArray=removeActionArray.replace("fromTemplate","actionTemplate");
                delete ActionNote[removeActionArray];
		
        var id = $(this).parent().attr('id');
        var parentId = $(this).parent().parent().parent().parent().attr('id');
		deleteConnection(id);

        $('#'+parentId).height($('#'+parentId).height()-31);
        $('#'+parentId).css("min-height",$('#'+parentId).height()-9+'px');
        $("[role-id="+parentId+"]").height($('#'+parentId).height()-8);

/*
        if($('#add-workflow-note').hasClass('show')){
            $('#add-workflow-note').find('.roles-wrap').eq(currentIndex).remove();
        }
        if($('#view-workflow-note').hasClass('show')){
            $('#view-workflow-note').find('.roles-wrap').eq(currentIndex).remove();
        }
*/		
    });

    
    $("body").on("click",".w.tp .close-ab", function(e) {
        mainDivId = $(this).attr('id');
        keyIdArray = Object.keys(myarray);
        var removeConnection=[];
        var removeConnectionTarget=[];
        
        $(this).parents('.tp').find('.kk').each(function(i,v){
            var removeFromAction = $(this).attr("id");
            removeFromAction=removeFromAction.replace("fromTemplate","actionTemplate");
            delete ActionNote[removeFromAction];
            removeConnection.push(v.id);
        })
        $.each(removeConnection,function(i,v){
            inst.detachAllConnections(v)
        });
        $.each(keyIdArray,function(i,v){
            if(myarray[v]==mainDivId){
                inst.detachAllConnections(v);
                jsPlumb.remove(v);
        }
   
        });
        
        var section = $(this).parent().parent().parent().attr('id');
        var sectionChild = $(this).parent().parent().attr('id');
        $("[parentcontainer*="+sectionChild+"]").remove();
        $("[role-id="+section+"]").remove();
        $("#"+section).remove();
        detAtt();   
    });

    //view Note functionality
    $("body").on("click",".view-note", function(e) {
        var clickedRoleId = $(this).parent().parent().parent().attr('id');
        clickedRoleactionId = $(this).parent().parent().next().next().attr('id')
        var roNumber = $('#'+clickedRoleId).children('.kk').length;
        console.log("roNumber",roNumber);
        addViewRO(clickedRoleId);
        clickedRole = clickedRoleId;
    });

    $("body").on("click",".add-note", function(e) {
        var clickedRoleId = $(this).parent().parent().parent().attr('id');
        // console.log("clickedRoleId",clickedRoleId);
        clickedRoleactionId = $(this).parent().parent().next().next().attr('id');
        // console.log("clickedRoleactionId",clickedRoleactionId);
        var roNumber = $('#'+clickedRoleId).children('.kk').length;
        // console.log("roNumber",roNumber);
        addViewRO(clickedRoleId);
        clickedRole = clickedRoleId;
    });


    $("body").on("change",".connection-change", function(e) {
        var connectionarray = {};
        var currentIndex = $( ".connection-change" ).index( this );
        clickedRoleactionId = $('#'+clickedRole).find('.kk').eq(currentIndex).attr('id');
        delete myarray[clickedRoleactionId];
        inst.detachAllConnections(clickedRoleactionId);
        var selectedvalueID = $(this).find("option:selected").attr('value');
        connectionarray[clickedRoleactionId]=selectedvalueID;
        makeconnection(connectionarray);
    // currentrollId.push(selectedvalueID);
    });


    $("body").on("click",".workflow-icon", function(e) {
         var clickRoleID = $(this).parent().parent().parent().attr('id');
         $('.workflow-item-section').find('.operation-status').empty();
  		 var currentElem = $(this).parent().parent().parent().attr("id");
		globalSubID=currentElem;
		globalSubID=globalSubID.replace("fromTemplate","workflowfromTemplate");

                var getCurrentElemParentID = $("#"+currentElem).parents(".rolesWorkflow").attr("class").split(" ")[0];
                if(getCurrentElemParentID=="workflow-survey-section"){
                     globalSubPhase=0;
                }
                
                var getCurrntSectionID = $("#" + currentElem).attr("section-id");
                var getCurrntRoleID = $("." + getCurrentElemParentID + " #"+getCurrntSectionID + " .wf-role span.left").text();                

                //$(".workflow-item-section .operation-head .title").text(getCurrntRoleID);
                $(".workflow-item-section .operation-head .btn-back").text("Back");
                $(".workflow-item-section .operation-head .btn-back").attr("back-id",getCurrentElemParentID);
                
                if(noBreadCrumbAddition==0){
                breadCrumbArray.push(getCurrentElemParentID);
                }
                console.log (breadCrumbArray);
                noBreadCrumbAddition=0;                
                
                if(globalSubPhase==0){
                 var wpTemplateID='.workflow-survey-section .tp';
                }
                else{
                 var parentDivID = $(this).parents(".rolesWorkflow").attr("class").split(" ")[0];
                 var wpTemplateID ='.' + parentDivID + ' .tp';   
                }
                
                $(".workflow-item-section .operation-status").empty();
		$(wpTemplateID).each(function(){
			var currentElemID = $(this).attr("id");
			currentElemID = currentElemID.replace("fromTemplate","btn");
			var kpt = $(this).attr("id");
			var kptText = $(this).find(".roName").text();
                	if(currentElem != kpt){
			var createBtn = '<button type="button" class="btn btn-default subItemBtn" id="'+currentElemID+'">'+ kptText +'</button>';
			}else{
			var createBtn = '<button type="button" class="btn btn-style subItemBtn" id="'+currentElemID+'">'+ kptText +'</button>';	
			}
                    $('.operation-status').append(createBtn);
		});
       
        $('.workflow-survey-section').css('display','none');   
        $('#default-phase').css('display','none');
        $('.workflow-item-section').css('display','block');
        $(".scroll-content .rolesWorkflow").css("display","none");
        $(".workflow-sidebar .operation-wrap").css("display","none");
        
        if($('.rolesWorkflow').hasClass('workflow'+clickRoleID)) {
            $(".workflow"+clickRoleID).css('display','block');
            $("#workflow"+clickRoleID).css('display','block');
            
        }else {
            var getParentStructure = $(this).parents(".w").attr("id");
            var getParentID = $(this).parents(".rolesWorkflow").attr("parentcontainer");
            if(getParentID=="" || getParentID=="undefined"){
            getParentStructure = getParentStructure;
            }else{
            getParentStructure = getParentStructure + " " + getParentID;  
            }
            
           //var workflowRO ='<div class="%workflow-survey-section% rolesWorkflow" parentcontainer="'+getParentStructure+'"><div class="workflow-action-col"><div class="operation-item operation-head clearfix" id="operationId" style="width:280px"><div class="wf-wrap" id="section1"><div class="wf-role btn btn-default"><span class="left">Survey Administrators</span><i class="icon small-close right"></i></div><div class="wf-count btn btn-default dropdown"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">1 </span><i class="fa fa-angle-down right"></i></div><ul aria-labelledby="dLabel" role="menu" class="dropdown-menu role-count"><li class=""><a class="roles" href="#">1</a>   </li></ul></div></div><div class="add-role"><i class="icon added"></i></div></div><div class="workflow-action-block" style="width:280px"><div class="nano workflow-nano"><div class="nano-content"><div class="demo statemachine-demo" id="statemachine-demo"><div class="w" id="opened" style="display:none;">BEGIN&nbsp;<div class="ep" style="display:none;"></div></div><div class="w hidden " id="template_newwindow"><div class="ep"></div></div><div class="newDivAppend kumark"></div>   <div class="absLine absLinePos1" sectionid="section1" style="left: 0px;"></div></div></div></div></div></div></div>';
           var workflowRO ='<div class="%workflow-survey-section% rolesWorkflow" parentcontainer="'+getParentStructure+'"><div class="workflow-action-col"><div class="operation-item operation-head clearfix" id="operationId" style="width:280px"><div class="wf-wrap" id="section1"><div class="wf-role btn btn-default"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">Survey Administrators</span><i class="icon small-close right section-close"></i><i class="fa fa-angle-down right wf-arrow"></i></div><ul role="menu" class="dropdown-menu role-count wf-dropdown"><li class=""><a class="roles" href="#">Vessel Administrator</a></li><li class=""><a class="roles" href="#">Survey Administrator</a></li><li class=""><a class="roles" href="#">Organization Administrator</a></li><li class=""><a class="roles" href="#">Vessel Owner</a></li><li class=""><a class="roles" href="#">Vessel Crew</a></li><li class=""><a class="roles" href="#">Vessel Guest</a></li><li class=""><a class="roles" href="#">Observer</a></li><li class=""><a class="roles" href="#">Surveyor</a></li><li class=""><a class="roles" href="#">Sales Representative</a></li></ul></div><div class="wf-count btn btn-default dropdown"><div class="clearfix" href="#" data-toggle="dropdown"><span class="left">1 </span><i class="fa fa-angle-down right"></i></div><ul aria-labelledby="dLabel" role="menu" class="dropdown-menu role-count"><li class=""><a class="roles" href="#">1</a>   </li></ul></div></div><div class="add-role"><i class="icon added"></i></div></div><div class="workflow-action-block" style="width:280px"><div class="nano workflow-nano"><div class="nano-content"><div class="demo statemachine-demo" id="statemachine-demo"><div class="w" id="opened" style="display:none;">BEGIN&nbsp;<div class="ep" style="display:none;"></div></div><div class="w hidden " id="template_newwindow"><div class="ep"></div></div><div class="newDivAppend kumark"></div>   <div class="absLine absLinePos1" sectionid="section1" style="left: 0px;"></div></div></div></div></div></div></div>';
            
            var k= workflowRO.replace('%workflow-survey-section%',"workflow"+clickRoleID);
            $('.workflow-editor .scroll-content').append(k);
            var workflowPhases ='<ul class="operation-wrap kumark clearfix phaseWorkflow" id="%RO-Phase%" parentcontainer="'+getParentStructure+'"></ul>';
            var kk = workflowPhases.replace('%RO-Phase%','workflow'+clickRoleID);
            $('.workflow-sidebar').append(kk);
            sortable();
            rolesortable();
        }
    globalSubPhase=1;

    $(".workflow-editor.hor-scroll").scrollLeft(0);

    if (globalSubPhase == 0) {
    var elm = $('.workflow-survey-section .workflow-action-block');
    }
    else {
        var elm = $('.' + globalSubID + ' .workflow-action-block');
    }
    var wd = $(elm).width();
    var btnDivWidth = $(".workflow-editor").find(".workflow-item-section").width();

    if (globalSubPhase == 1) {
        $(elm).width(wd);
        $('.scroll-content').width(wd + 280 + btnDivWidth + 2);
    }
    else {
        $(elm).width(wd);
        $('.scroll-content').width(wd + 280);
    }


    if ($('.workflow-editor').outerWidth() < $('.scroll-content').width()) {
        $('body .hor-scroll').mCustomScrollbar("update");
    }

    detAtt();
    dynamicHeightWidth();
	maintainAbsLineHeight();
    });

    $("body").on("click",".workflow-item-section .operation-head .btn-back", function(e) {
       
       var getCurrentBackID = breadCrumbArray[breadCrumbArray.length-1];
       var getCurrentBackID1 = breadCrumbArray[breadCrumbArray.length-2];
       if(getCurrentBackID=="workflow-survey-section")
       {
        $('.workflow-item-section').css('display','none');
        $('.rolesWorkflow').css('display','none');
        $('.phaseWorkflow').css('display','none');
        $('.workflow-survey-section').css('display','block');
        $('#default-phase').css('display','block');
        breadCrumbArray.pop();
        globalSubPhase=0;
        }
        else{
        $('.rolesWorkflow').css('display','none');
        $('.phaseWorkflow').css('display','none');            
        $('#'+getCurrentBackID).css('display','block');
        $('.'+getCurrentBackID).css('display','block');
                    var currentText = $(this).find(".title").text();
                   // alert(currentText);
                    var DivID = $('.'+getCurrentBackID1).attr("class").split(" ")[0];
                    var wpTemplateID ='.' + DivID + ' .tp';
                    var getCurrntRoleID = $("."+DivID).find("#section1 .wf-role .left").text();
                    $(".workflow-item-section .operation-head .btn-back").text(getCurrntRoleID);
                    $(".workflow-item-section .operation-head .btn-back").attr("back-id",DivID);
                    breadCrumbArray.pop();
                    console.log(breadCrumbArray);
                    $(".workflow-item-section .operation-status").empty();
                    $(wpTemplateID).each(function(i, val){
			var currentElemID = $(this).attr("id");
			currentElemID = currentElemID.replace("fromTemplate","btn");
			var kpt = $(this).attr("id");
			var kptText = $(this).find(".roName").text();
			var createBtn = '<button type="button" class="btn btn-style subItemBtn" id="'+currentElemID+'">'+ kptText +'</button>';	
                        $('.operation-status').append(createBtn);
                        });
                    noBreadCrumbAddition=1; 
                    $('.operation-status').find("button:first").trigger("click"); 
                    
        
        }
            newInstance();
            $.each( myarray, function( key, value ) {
        	//alert(key + " : " + value);
                var currentPlumbShow=$("#"+key).parents(".rolesWorkflow").css("display");
                if(currentPlumbShow!="none"){
                    inst.connect({
                        source:key, 
                        target:value,
                        anchors:["Right", "Right"]
                    });
                }
            });
        $(".workflow-editor.hor-scroll").scrollLeft(0);            
        dynamicHeightWidth();
    });
    
	$("body").on("click",".subItemBtn", function(e) {
		var getClickedBtnID = $(this).attr("id");
		getClickedBtnID = getClickedBtnID.replace("btn","fromTemplate");
		//$(".workflow-item-section .operation-head").trigger("click");
                noBreadCrumbAddition=1;
		$("#" + getClickedBtnID).find(".left .workflow-icon").trigger("click");
	});

    
    //edit workflow details
    
    $("body").on("click",".edit-workflow-detail", function(e) {
        manageButtons("save");
        var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
        $.ajax({
            url:workflowAjaxUrl,
            type:'post',
            data:{
                task:'editworkflowdetail',
                version:'version',
                workflowID:workflowId
            },
            beforeSend:function(){
                commonScriptObj.showHalfLoader();
            },
            success:function(data){
                $("#workflow-detail").html(data);
            },
            complete:function(){
                commonScriptObj.hideHalfLoader(); 
            }
        });
    });


    //save workflow details

    $("body").on("click",".save-workflow-detail", function(e) {
        
        $("#submit-edit-organization").trigger('click');
    //$("#submit-edit-organization").trigger('click');
    });


    //reset workflow details

    $("body").on("click",".reset-workflow", function(e) {
        var section=$(".change_breadcrumb").text();
        section=section.toLowerCase().slice(0,-1);                 
        if(!checkEditFormOpen(section, $(this))){
            return false;
        }
        manageButtons("block");
        var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
        $(".Ajaxdata-getWorkflowWithPagination tr#"+workflowId+"").trigger("click");
    });
    
    
    
    $("body").on("click",".cancel-new-workflow", function(e) {
        //$("#addnew-workflow-form").remove();
		 if ($('table .clone').length > 0) {
            $obj = $(this);
            $('#exit-confirmation').modal('show');
            $('#exit-confirmation').data('clickclass', $obj);
            return;
        }
        $("#workflow-detail").html("");
		manageButtons("block");
        resetWorkflowList();
    });
    
    
    //remove workflow
    
    $("body").on("click",".delete-workflow", function(e) {
       
         $("#delete-workflow-popup").modal("show");
     });
    
    
    //on confirm delete
    $('body').on('click','#delete-workflow-confirm',function(event,opt){
        var selectedRow=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr");
        var workflowId=$(selectedRow).attr('id');
        commonScriptObj.showFullLoader();
            $.ajax({
                type:'POST',
                url:'ajaxhandler/workflow-ajaxhandler.php',
                data:{
                    task:'deleteWorkflowList',
                    workflowId:workflowId
                },
                success:function(resp){
                    commonScriptObj.hideFullLoader();
                     manageButtons("block");
					 $("#workflow-detail").html("");
                    resetWorkflowList();
					//$(".workflow-list").trigger("click");
                }
            });
    });
    
    
    
    
    //Show workflow List.

    $('body').on('click', '.workflow-list,.cancel-workflow', function(event,opt){

		//  alert($('#addnew-workflow-form').length);
		//  alert($('table .clone').length);	
		if ($('table .clone').length > 0) {
            $obj = $(this);
            $('#exit-confirmation').modal('show');
            $('#exit-confirmation').data('clickclass', $obj);
            return;
        }


	    $('.left-head .detail-icon').removeClass('inactive');
        $('.left-head .detail-icon').addClass('active');
        if(typeof opt =="undefined"){
            var section=$(".change_breadcrumb").text();
            section=section.toLowerCase().slice(0,-1);                 
            if(!checkEditFormOpen(section, $(this))){
                return false;
            }
        }
        maintainSelections($('.workflow-list'));
        var datas = {
            task:'getWorkflowList'
        };
        commonScriptObj.showFullLoader();
        $('#workflow-search-text-box').val('');
        $.ajax({
            type:'POST',
            url:'ajaxhandler/workflow-ajaxhandler.php',
            data:datas,
            success:function(resp){
             
                commonScriptObj.hideFullLoader();
                $('.dashboard').empty();
                $('.dashboard').html(resp);
                if($(".Ajaxdata-getWorkflowWithPagination tr.workflow-title").length>0){
                    if($(".Ajaxdata-getWorkflowWithPagination tr.first td:eq(1)").text()==""){
                        
                    // $(".modify-workflow").hide();
                        
                    }
                    else{
                        $(".modify-workflow").show();
                    }
                    
                }
                else{
                    $(".modify-workflow").hide();
                    $("#workflow-detail").html("");
                }
                    
                
                $('.workflow-options li:nth-child(1)').addClass('active');
                $(".custom-workflows-count").text($(".custom-workflows").length);
                $(".default-workflows-count").text($(".workflow-title").length);
                var selectedTab=$('.workflow-options li.active').text();
                $('a[class="change_breadcrumb workflow-list"]').text(selectedTab);
               
                $('.main-title.right-side-heading').html('Detail');
                $(".custom-workflow-count").text($(".custom-workflows").length);
                $('.workflow-menu li.selectlist').css('display','block');
                addBreadCrumb();
               
                //checkbox change
                $(".Ajaxdata-getWorkflowWithPagination").find("input[type='checkbox']").on('change',function(){
                    $selectedChkbox=$(this);
                    if($(this)[0].checked){
    
                        $("#publish-workflow").modal("show");
                        $selectedChkbox=$(this);
                        //var r = confirm("Are you sure you want to publish this ?");
//                        if (r != true) {
//                            $(this).prop('checked', false);
//                        } 
//                        else{
//                            
//                            publishWorkflow($(this),"1");
//                        }
                    }
                    else{
                         $("#unpublish-workflow").modal("show");
//                        var r = confirm("Are you sure you want to unpublish this ?");
//                        if (r != true) {
//                            $(this).prop('checked', true);
//                            
//                        } 
//                        else{
//                            publishWorkflow($(this),"0");
//                            
//                        }
                    }

                });
                setscrollbar();
            },
            complete:function(){
                if(typeof opt !="undefined"){
                    
                    $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").trigger("click");
                    var parentId= $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").attr('parent-id');
                    var workflow=$(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").prev(".workflow-title");
                    //$(workflow).nextAll("tr[parent-id='"+parentId+"']").toggle("fast");
                    $("tr[parent-id='"+parentId+"'].workflow-title").nextAll("tr[parent-id='"+parentId+"']").toggle("fast");
                    var expandIcon= $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").prev(".workflow-title").find('i');
                    if($(expandIcon).hasClass('fa-angle-up')){
                        $(expandIcon).removeClass('fa-angle-up');
                        $(expandIcon).addClass('fa-angle-down');
                    }else{
                        $(expandIcon).addClass('fa-angle-up');
                        $(expandIcon).removeClass('fa-angle-down');

                    }
                }
                else{
                    
                    
                    $(".workflow-title").has('i').each(function(){
                        $(this).find("i").click();
                    });
                    var len = parseInt($(".Ajaxdata-getWorkflowWithPagination tr.workflow-title").length);
                    if(len==0)
                    {
                        $('.Ajaxdata-getWorkflowWithPagination').html('<tr class="no-data-found active-tr"><td style="text-align:center" colspan="5">No record found</td></tr>');
                        $(".dashboard > .diaplay-wrapper").addClass(" no-data-block");
                        manageButtons("norecord");
                    }
                    else
                    {
                        $(".dashboard > .diaplay-wrapper").removeClass(" no-data-block");
                        manageButtons("record");
                                        
                        $(".Ajaxdata-getWorkflowWithPagination tr:first").trigger("click");
                        if($("#hide-edit-button").val()=="1"){
                            $("#vEdit-workflow").show();
                        }
                    }
                    if ($('.Ajaxdata-getWorkflowWithPagination tr').length < 25) {
                        var x = surveyPage.addExtraTr($('.Ajaxdata-getWorkflowWithPagination tr').length, 4);
                        $('.Ajaxdata-getWorkflowWithPagination').append(x);
                    }
                    
                }
            }
        });
    });
    
    
    // get custom Workflow list
    $('body').on('click', '.custom-workflow-list', function(event,opt){   
        maintainSelections($(this));
        var datas = {
            task:'getCustomWorkflows'
        };
        commonScriptObj.showFullLoader();
        $('#workflow-search-text-box').val('');
        $.ajax({
            type:'POST',
            url:'ajaxhandler/workflow-ajaxhandler.php',
            data:datas,
            success:function(resp){
                
                commonScriptObj.hideFullLoader();
                $('.dashboard').empty();
                $('.dashboard').html(resp);
                $('.workflow-options li:nth-child(1)').addClass('active');
                
               
                var selectedTab=$('.workflow-options li.active').text();
                $('a[class="change_breadcrumb workflow-list"]').text(selectedTab);
               
                $('.main-title.right-side-heading').html('Detail');
                $(".custom-workflow-count").text($(".custom-workflows").length);
                $('.workflow-menu li.selectlist').css('display','block');
                addBreadCrumb();
              
                if ($('.Ajaxdata-getWorkflowWithPagination tr').length < 25) {
                    var x = surveyPage.addExtraTr($('.Ajaxdata-getWorkflowWithPagination tr').length, 4);
                    $('.Ajaxdata-getWorkflowWithPagination').append(x);
                }
                //checkbox change
                $(".Ajaxdata-getWorkflowWithPagination").find("input[type='checkbox']").on('change',function(){

                    if($(this)[0].checked){
    
                    $("#publish-workflow").modal("show");
                        var r = confirm("Are you sure you want to publish this ?");
                        if (r != true) {
                            $(this).prop('checked', false);
                        } 
                        else{
                            
                            publishWorkflow($(this),"1");
                        }
                    }
                    else{
    
                        var r = confirm("Are you sure you want to unpublish this ?");
                        if (r != true) {
                            $(this).prop('checked', true);
                            
                        } 
                        else{
                            publishWorkflow($(this),"0");
                            
                        }
                    }

                });
                setscrollbar();
            },
            complete:function(){
                if(typeof opt !="undefined"){
                    $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").trigger("click");
                    var parentId= $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").attr('parent-id');
                    var workflow=$(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").prev(".workflow-title");
                    $(workflow).nextAll("tr[parent-id='"+parentId+"']").toggle("fast");
                    var expandIcon= $(".Ajaxdata-getWorkflowWithPagination tr#"+opt.workflowId+"").prev(".workflow-title").find('i');
                    if($(expandIcon).hasClass('fa-angle-up')){
                        $(expandIcon).removeClass('fa-angle-up');
                        $(expandIcon).addClass('fa-angle-down');
                    }else{
                        $(expandIcon).addClass('fa-angle-up');
                        $(expandIcon).removeClass('fa-angle-down');

                    }
                }
                else{
                    
                    
                    $(".workflow-title").has('i').each(function(){
                        $(this).find("i").click();

                    });
                    
                    var len = parseInt($(".Ajaxdata-getWorkflowWithPagination tr.custom-workflows").length);
                    if(len==0)
                    {
                        $(".dashboard > .diaplay-wrapper").addClass(" no-data-block");
                        $('.Ajaxdata-getWorkflowWithPagination').html('<tr class="no-data-found active-tr"><td style="text-align:center" colspan="5">No record found</td></tr>');
                        manageButtons("norecords");
                    }
                    else
                    {
                        $(".Ajaxdata-getWorkflowWithPagination tr:first").trigger("click");
                        $(".dashboard > .diaplay-wrapper").removeClass(" no-data-block");
                        manageButtons("record");
                    }
                    if ($('.Ajaxdata-getWorkflowWithPagination tr').length < 25) {
                        var x = surveyPage.addExtraTr($('.Ajaxdata-getWorkflowWithPagination tr').length, 4);
                        $('.Ajaxdata-getWorkflowWithPagination').append(x);
                    }
                    
                }
                $(".custom-workflows-count").text($(".custom-workflows").length);
                
            }
        });
    }); 
    
    //show selected workflow
    $('body').on('click', '.workflow-actions', function(){
		var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
        var workflowName=$(".workflow-detail-name").text();
         var parentWorkflow=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr("parent-id");
        if(workflowId!=""){
            var datas = {
                task:'getWorkflowActions',
                workflowId:workflowId,
                workflowName:workflowName,
                parentworkflow:parentWorkflow
            };
            commonScriptObj.showFullLoader();
            $.ajax({
                type:'POST',
                url:'ajaxhandler/workflow-ajaxhandler.php',
                data:datas,
                success:function(resp){
                    commonScriptObj.hideFullLoader();
                    $('.dashboard').empty();
                    $('.dashboard').html(resp);
                    $('.main-title.right-side-heading').html('Detail');
                    createMCustomScroller();
                    dynamicHeightWidth();
                    $(".hidden-ViewWorkflow").css("display","block");
                    $('.left-head .detail-icon').addClass('inactive').removeClass('active');
					//hideAdministratorAddRole();
                }
            });
        }
        else{
            alert("please select workflow");
        }
    });
    
    //add new workflow
    //    $('body').on('click', '.add-new-workflow', function(){
    //        var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
    //        var datas = {
    //            task:'addnewWorkflow',
    //            workflowId:workflowId
    //        };
    //        commonScriptObj.showFullLoader();
    //        $.ajax({
    //            type:'POST',
    //            url:'ajaxhandler/workflow-ajaxhandler.php',
    //            data:datas,
    //            success:function(resp){
    //                commonScriptObj.hideFullLoader();
    //                $('.dashboard').empty();
    //                $('.dashboard').html(resp);
    //                $('.main-title.right-side-heading').html('Detail');
    //                $('.workflow-menu li.selectlist').css('display','none');
    //                createMCustomScroller();
    //                dynamicHeightWidth();
    //            }
    //        });
    //    });

    //Create new workflow
    $('body').on('click', '.add-new-workflow', function(){
		
        if ($('table .clone').length > 0) {
            $obj = $(this);
            $('#exit-confirmation').modal('show');
            $('#exit-confirmation').data('clickclass', $obj);
            return false;
        }
		
        var datas = {
            task:'createnewworkflow'
        };
        $.ajax({
            type:'POST',
            url:'ajaxhandler/workflow-ajaxhandler.php',
            data:datas,
            beforeSend:function(){
                commonScriptObj.showHalfLoader();
            },
            success:function(data){
				var getUserName = $(".user-action a:eq(0) span").text();
				getUserName = getUserName.trim();
                $('.main-title.right-side-heading').html('Detail');
                $injectHtml='<tr class="workflow-title active-tr clone" parent-id="" id=""><td><label><input type="checkbox" name="" disabled></label></td><td></td><td>'+getUserName+'</td><td>0</td></tr>';
                $(".Ajaxdata-getWorkflowWithPagination tr:first").before($injectHtml);
                $(".Ajaxdata-getWorkflowWithPagination tr").removeClass("active-tr");
                $(".Ajaxdata-getWorkflowWithPagination tr:first").addClass("active-tr");
                
                $("#workflow-detail").html(data);
                $(".dashboard > .diaplay-wrapper").removeClass(" no-data-block");
                manageButtons("norecord");
                $("#vCreate-workflow").show();
                $("#vCancelNew-workflow").show();
                
            },
            complete:function(){
                commonScriptObj.hideHalfLoader(); 
            }
        });
    });
    
    //Create new workflow
   
    $("body").on("click",".create-workflow", function(e) {
        
        $("#submit-new-workflow").trigger('click');
    });
	
    $("body").on("click",".modify-workflow-version", function(e) {
        var workflowID=$(this).attr("data-id");
        var workflowName=$(this).attr("data-name");
        var parentWorkflow=$("#main-workflow").val();
        $(".modify-workflow").trigger('click',{
            workflowID:workflowID,
            workflowName:workflowName,
            parentWorkflow:parentWorkflow
        });
    });
    
    $("body").on("click",".propBtn",function(){
		$(".saveworkflowarray").removeClass("hide");
		$(".cancelworkflowarray").removeClass("hide");
		$(".saveworkflow").addClass("hide");
		$(".cancelworkflow").addClass("hide");		
	});
	
	
    //add new workflow
    $('body').on('click', '.modify-workflow', function(event,opt){
        var section=$(".change_breadcrumb").text();
        section=section.toLowerCase().slice(0,-1);                 
        if(!checkEditFormOpen(section, $(this))){
            return false;
        }
        commonScriptObj.showFullLoader();
        var workFlowName=$(".workflow-detail-name").text();
        var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
        var published = $(".Ajaxdata-getWorkflowWithPagination tr.active-tr").find("input[type='checkbox']").is(":checked");
        var version=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").hasClass("workflow-title");
        var parentWorkflow=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr("parent-id");
       
        if(typeof opt !="undefined"){
            
            workflowId=  opt.workflowID;
            workFlowName=opt.workflowName;
            parentWorkflow=opt.parentWorkflow;
        }
        var datas = {
            task:'modifyWorkflow',
            workflowId:workflowId,
            published:published,
            baseversion:version,
            parentworkflow:parentWorkflow
        };
        $.ajax({
            type:'POST',
            url:'ajaxhandler/workflow-ajaxhandler.php',
            data:datas,
            success:function(resp){
                commonScriptObj.hideFullLoader();
                $('.dashboard').empty();
                $('.dashboard').html(resp);
                $('.main-title.right-side-heading').html('Detail');
                var breadCrumbData={
                    section:"editor",
                    workFlowName:workFlowName
                };
                addBreadCrumb(breadCrumbData);
                setRoleChange();
                dynamicHeightWidth();
			    //hideAdministratorAddRole();			
            }
        });
    });
    
    // add organization 
  
    $(".add-organization").on('click',function(){
        $(".select-organization").attr('value','Submit');
        $(".select-organization").removeClass("icon-select").addClass("icon-submit");
        $(".select-organization").removeClass('unselected');
    });
  
    //find organization change the button behaviour
  
    $(".find-organisation-list").on('click',function(){
        $(".select-organization").attr('value','Select');
        $(".select-organization").removeClass("icon-submit").addClass("icon-select");
        $(".select-organization").addClass('unselected');
        $("#organization-added").hide();
    });
  
});

function addViewRO(clickedRoleId){
    roleArray = {};
    if(globalSubPhase==0){
     var getFromElement=".workflow-survey-section";   
    }
    else{
     var getFromElement="."+globalSubID;   
    }
    $(getFromElement + ' .w.tp').each(function(i,v){
        var roleid = $(v).attr('id')
        var roleName = $("#"+roleid).children('.action-block-title').find('.roName').attr("data-value");
        if(roleid == clickedRoleId){
            delete roleArray[roleid];
        } else {
            roleArray[roleid]=roleName;
        }
    });
	$(".saveworkflowarray").removeClass("hide");
	$(".cancelworkflowarray").removeClass("hide");
	$(".saveworkflow").addClass("hide");
	$(".cancelworkflow").addClass("hide");
}


/**
* 
View workflow details.
* 
* */


function getworkflowdetail(workflow){
    var workflowid=$(workflow).attr("id");
    var parentId=$(workflow).attr("parent-id");
    manageButtons("block");
    //    console.log('%c workflow id:','background:#234233;color:white',workflow);
   
    $.ajax({
        url:workflowUrl,
        type:'post',
        data:{
            task:'viewworkflowdetail',
            version:'base',
            workflowID:workflowid
        },
        beforeSend:function(){
            commonScriptObj.showHalfLoader();
        },
        success:function(data){
            $("#workflow-detail").html(data);
            
            $(".right-side-heading").text( $(".workflow-detail-name").text());
        },
        complete:function(){
            commonScriptObj.hideHalfLoader(); 
        }
    });

}
$('body').on("click",".Ajaxdata-getWorkflowWithPagination tr.workflow-title", function (event,opt) {
     var getTDText = $(this).find("td:eq(1)").text();
	 if(getTDText==""){
		return false;
	 }
	 
	if ($('table .clone').length > 0) {
            $obj = $(this);
            $('#exit-confirmation').modal('show');
            $('#exit-confirmation').data('clickclass', $obj);
            return false;
        }
	 
    //To check the form is open  
    var section=$(".change_breadcrumb").text();
    section=section.toLowerCase().slice(0,-1);                 
    
    
    if(!checkEditFormOpen(section, $(this))){
        return false;
    }
    
    if($(".Ajaxdata-getWorkflowWithPagination tr:first td:eq(1)").text() ==""){
            
        $(".Ajaxdata-getWorkflowWithPagination tr:first")
    }

    var workflowTitlecount  = $('.Ajaxdata-getWorkflowWithPagination tr.workflow-title').length;
    if($(event.target).hasClass('tr-collapse')){ 
        var workflow=$(event.target).parent().parent();
        var parentId=$(workflow).attr("parent-id");
        $(workflow).nextAll("tr[parent-id='"+parentId+"']").toggle("fast",function(){
       
            if($(event.target).hasClass('fa-angle-up')){
                $(event.target).removeClass('fa-angle-up');
                $(event.target).addClass('fa-angle-down');
                //                console.log("down arrow",event.target);
                //functionality for managing blankrow
                var childCount = $("[parent-id="+parentId+"]").length;
                if(flag == 1) {
                    var j=1;
                    $('.table-workflow tbody .blank-row').each(function(i,v){
                        if(j <= childCount-1)
                            $(v).remove();
                        j++;
                    })
                }

                if(flag == 0){
                    ++count;
                    if(count == workflowTitlecount){
                        //console.log("hi");
                        flag=1;
                    }
           
                } 
            }
            else{
                $(event.target).addClass('fa-angle-up');
                $(event.target).removeClass('fa-angle-down');
                var childCount = $("[parent-id="+parentId+"]").length;
                for (j = 1; j <= childCount-1;j++) {
                    var clone = '';
                    clone += '<tr class="blank-row" style="height:30px">';
                    for (i = 1; i <= 4; i++) {
                        clone += '<td></td>';
                    }
                    clone += '</tr>';
                    $('.table-workflow tbody').append(clone);
                       
                }    
            }
            setscrollbar();
        });
    }
    else{
        getworkflowdetail($(this));
    }
    
});


$("#getCountry li a").on('click',function(){
    $("#organization-country").val($(this).attr('data-id'));
});
$("#getState li a").on('click',function(){
    $(".organization_state").val($(this).attr('data-id'));
});

$('#workflow-search-text-box').keypress(function(e)
{
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13)
    {
        searchWorkFlow();
    }
});


/**
* 
View workflow details.
* 
* */
function getworkflowVersiondetail(workflow){
    var workflowid=$(workflow).attr("id");
    
    manageButtons("edit");
    //console.log('%c workflow id:','background:#234233;color:white',workflowid);
   
    $.ajax({
        url:workflowUrl,
        type:'post',
        data:{
            task:'viewworkflowdetail',
            version:'version',
            workflowID:workflowid
            
        },
        beforeSend:function(){
            commonScriptObj.showHalfLoader();
        },
        success:function(data){
            $("#workflow-detail").html(data);
            $(".right-side-heading").text( $(".workflow-detail-name").text());
        },
        complete:function(){
            commonScriptObj.hideHalfLoader(); 
        }
    });

}



$(".table-organization tr td label input[type='checkbox']").on('change',function(){
    
    var selectedTr=$(".table-organization tr td label input[type='checkbox']:checked ").length;
    if(selectedTr>0){
        
        $(".select-organization").removeClass("unselected");
    }
    else{
        $(".select-organization").addClass("unselected");
    }
    
});
$('body').on('click','#organization-added-btn',function(){
    showWidgets_('organization-added',{
        animation:'slide'
    });
//reloadVTable();
});

$("#unpublish-workflow").find('#publish-workflow-cancel').click(function(){
    $selectedChkbox.prop('checked',true);
   
});
$("#unpublish-workflow").find('#publish-workflow-confirm').click(function(){
    
    publishWorkflow($selectedChkbox,"0");
});
$("#publish-workflow").find('#publish-workflow-cancel').click(function(){
    
   $selectedChkbox.prop('checked',false);
});
$("#publish-workflow").find('#publish-workflow-confirm').click(function(){
     publishWorkflow($selectedChkbox,"1");
   
});
function showSelectedOrganization(){
    var activeTab=$(".find-organization-list li.active a").text();
    if(activeTab=='Find Organization'){
        var selectedTr=$(".table-organization tr.active-tr").length;
        if(selectedTr>0){
            $(".organizations-name").html("");
            $(".table-organization tr.active-tr").each(function(){
                var organizationId=$(this).attr("id").split("-");
                var organizationName=$(this).find('.organization-name').text();
                // console.log("%c Selected tr :","background-color:grey;color:black",organizationId,organizationName);
                $(".organizations-name").append("<div><input type='hidden' value='"+organizationId[1]+"' class='assignedOrganizations' name='assignedOrganizations"+organizationId[1]+"'>"+organizationName+"</div> <span id='"+organizationId[1]+"' class='assigned-orgainzation'><span>");
                
                $("#find-organization").removeClass("show");
                $(".mask-left").hide();
            });        
        
        }
        else{
            //alert("Please select atleast one");
    
        }
    }else{
       
        $("#submit-add-new-organization").trigger('click')
    }
}
//in window resize handle workspace
$( window ).resize(function() {

    dynamicHeightWidth();
    maintainAbsLineHeight();
});


// publish the workflow

function publishWorkflow(ele,publishStatus){
    var workflowId=ele.val();
    var datas = {
        task:'publishworkflow',
        workflowId:workflowId,
        publishStatus:publishStatus
    };
            
    $.ajax({
        type:'POST',
        url:'ajaxhandler/workflow-ajaxhandler.php',
        data:datas,
        success:function(resp){
                    
        }
    });
    
}

//manage edit/save button 
function manageButtons(mode){
    $("#vCreate-workflow").hide();
    $("#vCancelNew-workflow").hide();
    switch(mode){
        case "records":
            $("#vWorkfow").find("a").removeClass("inactive");
            $("#vWorkfow").find("a").addClass("workflow-actions");
            $("#vEdit-workflow").show();
            $("#vSave-workflow").hide();
            $("#vCancel-workflow").hide();
            $("#vDelete-workflow").show();
            break;
        case "edit":
            $("#vEdit-workflow").show();
            $("#vSave-workflow").hide();
            $("#vCancel-workflow").hide();
            $("#vDelete-workflow").show();      
            break;
        case "save":
            $("#vEdit-workflow").hide();
            $("#vSave-workflow").show();
            $("#vCancel-workflow").show();
            $("#vDelete-workflow").show();
            break;
        case "norecord":
            $("#vEdit-workflow").hide();
            $("#vSave-workflow").hide();
            $("#vCancel-workflow").hide();
            $("#vDelete-workflow").hide();
            $("#vWorkfow").find("a").addClass("inactive");
            $("#vWorkfow").find("a").removeClass("workflow-actions");
            break;
        default:
            $("#vEdit-workflow").hide();
            $("#vSave-workflow").hide();
            $("#vCancel-workflow").hide();
            $("#vDelete-workflow").hide();
            if($("#hide-edit-button").val()=="1"){
                $("#vEdit-workflow").show();
                $("#vDelete-workflow").show();
            }
            $(".hidden-ViewWorkflow").css("display","none");
            break;
        
    }
    
   
    
    
    
}

function searchWorkFlow(){
    searchString=$.trim($('#workflow-search-text-box').val());
    

    if(searchString!="")
    {
		
        $like  = searchString;
        if(typeof($like)=='undefined'){
            $like='';
        }
        if($like !=''){
            //alert('call nextFn');
            var searchString1 = ellipsisText(searchString);
            // var searchString1 = searchString;
            // len= searchString1.length;
            // if(len > 10)
            // {
            //     searchString1 = searchString1.substr(0,10) + '..';
            // }
            
            // $('.block-head span.left-side-heading').text('');
            //$('.block-head span.left-side-heading').html('Vessels (<a class="title-icon icon filter"></a>Search: '+ searchString1 +')');
            // $('#search-string-li').show();
            // $('#search-string-li').trigger('click');
            // $('#search-string-li').addClass('active');
            //$('.vessel-table-view').removeClass('active');
            //$('#search-string').text(searchString1);
            nextFn('getWorkflowWithPagination',1,100 ,"",'workflow_version_id',searchString,$like);
                         
        }
    }	
                
}


function maintainSelections(ele){
    
    $(".workflow-filters li").removeClass("active");
    $(ele).parent().addClass("active");
    
}

/*
 * Submit add organization form
 * 
 */
function submitAddOrganizationForm(){
    
    if(($("#add-new-organization-form input[name='zip']").val()) != ""){
        if((($('.show-country').val()) == "")&&(($("#add-new-organization-form input[name='zip']").val()) != "")){
            $("#add-new-organization-form input[name='zip']").removeAttr("data-validetta","postalcode[.show-country]");
            $('.sizipcode-span').css("display","block");
        } else {
            $('.sizipcode-span').css("display","none");
            $("#add-new-organization-form input[name='zip']").attr("data-validetta","postalcode[.show-country]");
        }
    } else {
        $('.sizipcode-span').css("display","none");
    // $("#add-new-vessel-manufacturer-form input[name='zip']").attr("data-validetta","required");
    }
   
    $submitOrganisationForm=1;
    $('#add-new-organization-form').validetta({
        onCompleteFunc :function(object, event){ 
            if($submitOrganisationForm==1)
            {
                var formdata = $('#add-new-organization-form').serialize();
                       
                commonScriptObj.showFullLoader();
                $.ajax({
                    type:'POST',
                    url:'ajaxhandler/workflow-ajaxhandler.php?task=saveOrganization',
                    data:formdata,
                    success:function(resp){
                        commonScriptObj.hideFullLoader();
                        $('#organization-added').slideDown();
                        $('.table-organization tbody tr.active-tr').removeClass('active-tr');
                        $('.table-organization tbody tr:first').before(resp);
                        //$("#organization-added").hide();
                        setColumnsH();
                    }
                });	
                        
                $submitOrganisationForm=0;
            }
        }
    });
    return false;
    
}

function submitEditWorkflowForm(){

    
  
    //$('#edit-workflow-form').validetta();
    $editWorkflowForm=1;
    $('#edit-workflow-form').validetta({
        onCompleteFunc :function(object, event){ 
            if($editWorkflowForm==1)
            {
                var workflowId=$(".Ajaxdata-getWorkflowWithPagination tr.active-tr").attr('id');
                var workflowName=$("#workflow-name").val();
                var workflowDescription=$("#workflow-description").val();
                var workflowObjective=$("#workflow-objective").val();
                var assignedOrganizations=[]
                $(".assigned-orgainzation").each(function(){

                    assignedOrganizations.push($(this).attr('id'));
                });

                //niceConsole("assigned organizations","orange","black",assignedOrganizations);  // beautify niceConsole(message,backgroundcolor,fontcolor,valuetoprint); 
                $.ajax({
                    url:workflowAjaxUrl,
                    type:'post',
                    data:{
                        task:'saveworkflowdetail',
                        workflowid:workflowId,
                        workflowname:workflowName,
                        workflowdescription:workflowDescription,
                        workflowobjective:workflowObjective,
                        assignedOrganizations:assignedOrganizations
                    },
                    beforeSend:function(){
                        commonScriptObj.showHalfLoader();
                    },
                    success:function(data){
                        //$(".workflow-filters li.active")
						$("#workflow-detail").html("");
                        resetWorkflowList();
						//$(".workflow-filters li.active a").trigger("click",{
                        //    workflowId:workflowId
                        //});
                        manageButtons("block");
                    //$(".Ajaxdata-getWorkflowWithPagination tr#"+workflowId+" td:eq(1)" ).text("- "+workflowName);
          
                    },
                    complete:function(){
             
                        commonScriptObj.hideHalfLoader(); 
                    }
                });
                        
                $editWorkflowForm=0;
            }
        }
    });
    return false;
    
}
function submitNewWorkflowForm(){

     //$('#edit-workflow-form').validetta();
    $addWorkflowForm=1;
    $('#addnew-workflow-form').validetta({
        onCompleteFunc :function(object, event){ 
            if($addWorkflowForm==1)
            {
                         
                var workflowID=$("#addnew-workflow-id").val();
                var workflowName=$("#workflow-name").val();
                var workflowDescription=$("#workflow-description").val();
                var workflowObjective=$("#workflow-objective").val();
                var assignedOrganizations=[]
                $(".assigned-orgainzation").each(function(){

                    assignedOrganizations.push($(this).attr('id'));
                });

                //niceConsole("assigned organizations","orange","black",assignedOrganizations);  // beautify niceConsole(message,backgroundcolor,fontcolor,valuetoprint); 
                $.ajax({
                    url:workflowAjaxUrl,
                    type:'post',
                    data:{
                        task:'savenewworkflowdetail',
                        workflow_id:workflowID,
                        name:workflowName,
                        description:workflowDescription,
                        objective:workflowObjective
                    },
                    beforeSend:function(){
                        commonScriptObj.showHalfLoader();
                    },
                    success:function(data){
                        //$(".workflow-filters li.active")
					   $(".Ajaxdata-getWorkflowWithPagination tr:first td:eq(1)").text(workflowName);
					   $(".Ajaxdata-getWorkflowWithPagination tr:first").removeClass("clone");
                        resetWorkflowList();
					   // $(".workflow-filters li.active a").trigger("click");
                        //manageButtons("block");
                    //$(".Ajaxdata-getWorkflowWithPagination tr#"+workflowId+" td:eq(1)" ).text("- "+workflowName);
          
                    },
                    complete:function(){
             
                        commonScriptObj.hideHalfLoader(); 
                    }
                });
                        
                $addWorkflowForm=0;
            }
        }
    });
    return false;
    
}
function getOrganizationData(){
    if ($("#add-new-organization-form").find(".validetta-bubble").length > 0) {
                   
        $("#add-new-organization-form").find(".validetta-bubble").remove()
    }
    $(".find-organisation-list").trigger('click');
        
    $.ajax({
        type:'POST',
        url:'ajaxhandler/workflow-ajaxhandler.php?task=getOrganizations',
        success:function(resp){
            $('#organization-added').slideUp();
            $('.table-organization tbody tr.active-tr').removeClass('active-tr');
            $('.table-organization tbody').html(resp);
                    
            
            
            if ($('.table-organization tbody tr').length < 25) {
                var x = surveyPage.addExtraTr($('.table-organization tbody tr').length, 3);
                $('.table-organization tbody').append(x);
            }
            $(".assignedOrganizations").each(function(){
                //select the assigned organization.
                $('.table-organization tbody tr#organization-'+$(this).val()+'').addClass("active-tr");
                $("input[type='checkbox']#org-"+$(this).val()+"").prop("checked",true)
                
                
            });
            if($(".table-organization:eq(1) tr.active-tr").length>0){
                $(".select-organization").removeClass("unselected");
                
            }
            
            $("#find-organization").find(".table-organization tr").find("input[type='checkbox']").on('click',function(e){
                console.log($(this));
                //remove or add class on tr active-tr class on based of selection of the row.
                if($(this).closest("tr").hasClass("active-tr")){
                    $(this).closest("tr").removeClass("active-tr");
                    $(this).attr('checked', false);
                }
                else{
                    $(this).closest("tr").addClass("active-tr");
                    $(this).attr('checked', true);

                }
                //remove or add class on button for unselected or selected based on the selection of the rows.
                if($(".table-organization:eq(1) tr.active-tr").length>0){
                    $(".select-organization").removeClass("unselected");

                }
                else{
                    $(".select-organization").addClass("unselected");
                    e.stopPropagation();
                }
            });
            setColumnsH();
        }
    });	


}

function confirmDelete(selectedRow){
    var isPublished=$(selectedRow).find("input[type='checkbox']").is(':checked');
    
    if(isPublished){
        var r = confirm("Are you sure you want to delete this ?");
        if (r != true) {
            return false;
                            
        } 
        else{
            return true; 
        }
        
    }
    else{
        return true;   
    }
}

/*
 * A nicer way to output in browser console tool.
 * @augments message static message to show in console.
 * @augments backgroundColor string or hex code.
 * @augments fontColor string or hex code.
 * @augments valueToPrint dynamic value to print.
 */

function niceConsole(message,backgroundColor,fontColor,valueToPrint){
    
    console.log('%c '+message+'','background-color:'+backgroundColor+';color:'+fontColor+'',valueToPrint);
}


/*
 * Set role on change
 * @event onChange
 * @class UI class used for this .role-count li
 */
function setRoleChange(){
    
      
    //change role 
    $(".role-count li").each(function(){
        $(this).on('click',function(){
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });

    });
    
}



function addBreadCrumb(breadCrumbData){
    var injectHtml;

    if(typeof breadCrumbData!="undefined"){
    
        injectHtml=' <a class="" href="#">'+breadCrumbData.workFlowName+'</a> <a class="" href="#">Workflow Editor</a>';
    }
    else{
    
        injectHtml="";
    }

    BreadcrumbModule.html('<li class="workflows-breadcrumb active"><a class="change_breadcrumb workflow-list" href="#">Workflows</a>'+injectHtml+'</li>');

}


function submitAddNoteForm(){
	submitAddNoteForm1();
	return false;
    $addNoteWorkflowForm=1;
    $('#add-new-note-form').validetta({ 
        onCompleteFunc :function(object, event){
            if($addNoteWorkflowForm==1)
            {
                event.preventDefault();
                datas  =  $('#add-new-note-form').serialize();
                commonScriptObj.showHalfLoader();
                $.ajax({
                    url: workflowUrl+'?task=saveRoleOperationNote',
                    type: 'POST',
                    data: datas,
                    success: function(resp){ 			
                        $("#add-workflow-note").removeClass('show');
                    },
                    complete: function(data)
                    {
                        roleOperationId=datas.split("&");
                        roleOperationId=roleOperationId[1].split("=");
                        $("#fromTemplate_"+roleOperationId[1]).find('i.add-note').removeClass('add-note').addClass('view-note');
                        $("#note_"+roleOperationId[1]).removeAttr('data-open');
                        $("#note_"+roleOperationId[1]).removeAttr('data-target');
                        $("#note_"+roleOperationId[1]).attr({
                            'data-open':'view-workflow-note'
                        });
                        roleOperationNoteDescription=roleOperationId[0].split("=");
                        $("#fromTemplate_"+roleOperationId[1]).append("<input type='hidden' value='"+roleOperationNoteDescription[1]+"' id='note_"+roleOperationId[1]+"'/>");
                        $("#note_"+roleOperationId[1]).click();
                        $("#add-workflow-note").removeClass('show');
						$(".hidden-ViewWorkflow").css("display","none");
                    }
	                      
                });
                $addNoteWorkflowForm=0;
            }
        }
    });
}

function resetWorkflowList(){

    //$(".workflow-filters li.active a").trigger('click',{action:'reset'});
    //$(".Ajaxdata-getWorkflowWithPagination tr:first").trigger("click",{action:'reset'});
	$(".workflow-list").trigger("click");
}

function hideAdministratorAddRole(){
	$(".workflow-survey-section").find(".add-role").css("display","none");
	$(".workflow-survey-section").find(".wf-role .small-close").css("display","none");
}