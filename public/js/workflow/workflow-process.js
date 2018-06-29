/* 
 * Custome js for workflow section
 * Org : Prospus
 * Email : 
 */
var workflowAjaxUrl = 'ajaxhandler/workflow-ajaxhandler.php';
    workflowProcess = {
        saveWorkflow: function(){
var arr= {};
var arr1=[];
var workFlowId=$("#add-workflow").val();
$('.operation').each(function( key, value ) {
    var phase = {};
    var opeartion=[];
    var opeartionName = $(value).find('.operation-item').find('.title').text();
    var phaseId= $(this).attr('phase-id');
       $('.'+phaseId).each(function( key2, subvalue) {
         var operation_data={};
           var opeartionActions=[];
           operation_data['operation_name'] = $(subvalue).find('.title').text();
           var roleid = $(subvalue).attr('role-id');
           $("#"+roleid).find(".kk").each(function(key1,subsubvalue) {
                var operation_action={};
                operation_action['Action-Name'] = $(subsubvalue).find('.role_value').text();
                operation_action['Action-Id'] = $(subsubvalue).attr('id');
                operation_action['Target-Role-OperationId']=myarray[operation_action['Action-Id']];
				var getActionID = $(subsubvalue).attr('id');
				getActionID = getActionID.replace("fromTemplate","actionTemplate");
				if(typeof ActionNote[getActionID]!="undefined"){
                                operation_action['Note-Description'] = ActionNote[getActionID].noteDescription;
				operation_action['Action-Description'] = ActionNote[getActionID].actionDescription;
				operation_action['Role'] = ActionNote[getActionID].roleChange;
				operation_action['Transition'] = ActionNote[getActionID].connChange;
                                }
								
                var actionId = $(subsubvalue).attr('id');
             opeartionActions.push(operation_action);
           });
           
           operation_data['Ro-Action'] = opeartionActions; 
           var roleId = $(subvalue).attr('role-id');
           var sectionId =$("#"+roleId+" div").attr('section-id');
           var roleName=$("#"+sectionId+" .wf-role span").text();
           var roleMode=$("#"+sectionId+"").find('.role-count li.active a').text();

           //console.log("section ",sectionId);
           
            var OperationId = $("#"+roleId).children().attr('id')
            operation_data['role_id'] =roleId;
            operation_data['role_name'] =roleName;
            operation_data['role_mode'] =roleMode;
            operation_data['Operation-Id'] = $("#"+roleId).children().attr('id');
            //console.log("operation ",$("#"+OperationId));
            var roleOperationId=OperationId.split("_");
            operation_data['Operation-Note'] = $("#note_"+roleOperationId[1]).val();
            operation_data['Operation-Top'] = $("#"+OperationId).css("top");
           operation_data['Operation-Left'] = $("#"+OperationId).css("left");
           opeartion.push(operation_data);
        });
        phase['name']= opeartionName;
        phase['operation']= opeartion;
        // AMIT MALAKAR >>>
        if(opeartionName){
            arr1.push(phase);
        }
        // <<< AMIT MALAKAR
    });

arr.phase = arr1;
console.log(arr);
var data = arr;
            
            var wfData = {task:'saveWorkflow', data:data,workflowID:workFlowId};
             $.ajax({
                type: 'POST',
                url: workflowAjaxUrl,
                data: wfData,
                success: function(){
                    
                }
             });
        },
updateWorkflow:function(){
          
          var arr= {};
var arr1=[];
var workFlowId=$("#edit-workflow-id").val();
$('.operation').each(function( key, value ) {
    var phase = {};
    var opeartion=[];
    var opeartionName = $(value).find('.operation-item').find('.title').text();
    var phaseId= $(this).attr('phase-id');
       $('.'+phaseId).each(function( key2, subvalue) {
           //console.log("roleoperations:",key2, subvalue);
         var operation_data={};
           var opeartionActions=[];
           operation_data['operation_name'] = $(subvalue).find('.title').text();
           var roleid = $(subvalue).attr('role-id');
           $("#"+roleid).find(".kk").each(function(key1,subsubvalue) {
                var operation_action={};
                operation_action['Action-Name'] = $(subsubvalue).find('.role_value').text();
                operation_action['Action-Id'] = $(subsubvalue).attr('id');
                operation_action['Target-Role-OperationId']=myarray[operation_action['Action-Id']];
                          
				var getActionID = $(subsubvalue).attr('id');
                                getActionID = getActionID.replace("fromTemplate","actionTemplate");
                                
				if(typeof ActionNote[getActionID]!="undefined"){
                                operation_action['Note-Description'] = ActionNote[getActionID].noteDescription;
				operation_action['Action-Description'] = ActionNote[getActionID].actionDescription;
				operation_action['Role'] = ActionNote[getActionID].roleChange;
				operation_action['Transition'] = ActionNote[getActionID].connChange;
                                }
				
                var actionId = $(subsubvalue).attr('id');
                
                opeartionActions.push(operation_action);
           });
           
           operation_data['Ro-Action'] = opeartionActions; 
           var roleId = $(subvalue).attr('role-id');
           var sectionId =$("#"+roleId+" div").attr('section-id');
           var roleName=$("#"+sectionId+" .wf-role span").text();
           var roleMode=$("#"+sectionId+"").find('.role-count li.active a').text();

           //console.log("section ",sectionId);
           
           var OperationId = $("#"+roleId).children().attr('id')
            operation_data['role_id'] =roleId;
            operation_data['role_name'] =roleName;
            operation_data['role_mode'] =roleMode;
            operation_data['Operation-Id'] = $("#"+roleId).children().attr('id');
            //console.log("operation ",$("#"+OperationId));
            var roleOperationId=OperationId.split("_");
            operation_data['Operation-Note'] = $("#note_"+roleOperationId[1]).val();
            operation_data['Operation-Top'] = $("#"+OperationId).css("top");
           operation_data['Operation-Left'] = $("#"+OperationId).css("left");
           opeartion.push(operation_data);
        });
        phase['name']= opeartionName;
        phase['operation']= opeartion;
        // phase['action']= opeartionActions; 
        
        arr1.push(phase);
     });

arr.phase = arr1;
var published=$("#workflow-published").val();
var version=$("#workflow-baseversion").val();
var baseworkflow=$("#main-workflow").val();
console.log(arr);
var data = arr;
             commonScriptObj.showFullLoader();
             var wfData = {
                 task:'updateWorkFlow',
                 data:data,workflowID:workFlowId,
                 published:published,
                 baseversion:version,
                 baseworkflow:baseworkflow
             };
             
             $.ajax({
                type: 'POST',
                url: workflowAjaxUrl,
                data: wfData,
                success: function(){
                    commonScriptObj.hideFullLoader();
                }
             });
        
          
      }
    
     
    }
	
var ActionNote={};	
	
function submitAddNoteForm1(){

var getRoleID = $('#add-new-note-form').find('input[name="role_operation_id"]').val();
$('#add-new-note-form .chkAction').each(function(index, element) {
    var getActionID = $(this).attr("id");
	var getActionIDAppended = "#"+getActionID;
	ActionNote[getActionID] = ({noteDescription :$("#input_location").val(), actionDescription: $(getActionIDAppended).find(".area-field").val(), roleChange: $(".role-change option:selected").val(), connChange: $(getActionIDAppended).find(".connection-change option:selected").val()});
});
console.log(ActionNote);
 $("#add-workflow-note").animate({
            right: -500
        }, 400, function () {
            $("#add-workflow-note").removeClass("show");
        });
//$("#add-workflow-note").removeClass('show');
$(".hidden-ViewWorkflow").css("display","none");
$(".saveworkflowarray").addClass("hide");
$(".cancelworkflowarray").addClass("hide");
$(".saveworkflow").removeClass("hide");
$(".cancelworkflow").removeClass("hide");
}