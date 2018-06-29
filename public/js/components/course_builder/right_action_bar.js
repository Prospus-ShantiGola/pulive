import React from 'react';
import {connect} from 'react-redux';
import {addGuestUser,getGuestUsersProduction} from '../functions/common_functions';
import {appendProductionStart,changeChatView,appendProductionDetail,appendProductionInstance} from '../../actions/actions';
class RightActionBarProduction extends React.Component {
     constructor() {
      super();
      this.state={
        users:{},
        currentUserEmail:''
      };
    }
    render() {
        let self = this;
        let {newProductionCourse} = self.props;
        let noRightActionBar = "flex-item right-action-bar";
        let getTemplateType;
        if(self.props.currentChatDialogueDetail){
          getTemplateType = self.props.currentChatDialogueDetail.chat_view_type;
            if(this.props.currentChatDialogueDetail.chat_view_type!="edit_production_template"){
                noRightActionBar = "flex-item";
            }
        }
        else{
          noRightActionBar = "flex-item";
        }

        if(getTemplateType=="add_new_template"){
            return (
                <div className="flex-item right-action-bar">
                    <div id="dashboard-action-bar" className="flex-item">
                        <ul>
                        <li>
                            <a href="javascript:void(0)" onClick={this.saveProduction.bind(this,"P")} id="publish_new_course_production"><i className="icon publish"></i><span>Publish</span></a>
                        </li>
                        <li>
                            <button className="btn-anchor" id="react-button-cancel-add-new-course" onClick={self.cancelAddNewCourse.bind(self)}>
                            <i className="icon cancel"></i><span>Cancel</span>
                            </button>
                        </li>
                    </ul>
                    </div>
                </div>
            )
        }
        else{
          let getProduction = this.props.productionStart;
          let formComponents = getProduction.formJson;
          let closeFlyout = <li onClick={self.closeFlyout.bind(self)} className='prodFlyoutCloseBtn hide'><a href='javascript:void(0)'><i className='icon-sm close-black'></i></a></li>;
          if(formComponents.actions.length==0){
            return ( <div className={noRightActionBar}>
                      <div id="dashboard-action-bar" className="flex-item">
                        <ul>
                          {closeFlyout}
                        </ul>
                </div></div>);
          }
          if(formComponents.customHTML){
          return ( <div className={noRightActionBar}>
                      <div id="dashboard-action-bar" className="flex-item">
                        <ul>
                        {closeFlyout}
                        <li>
                          <a href="javascript:void(0)" id={"prodbtn_0"} onClick={this.submitEditStartProductionCustom.bind(this,0)}><i className="icon publish"></i><span>{formComponents.actions.label}</span></a>
                        </li>
                        </ul>
                </div></div>);
          }
          else{
                let formActions = formComponents.actions.subactions;
                //let closeFlyout = <li onClick={self.closeFlyout.bind(self)} className='prodFlyoutCloseBtn hide'><a href='javascript:void(0)'><i className='icon-sm close-black'></i></a></li>;
                return ( <div className={noRightActionBar}>
                    <div id="dashboard-action-bar" className="flex-item">
                        <ul>
                        {closeFlyout}
                   {formActions.map((key, index) => (
                    <li key={index}>
                      <a href="javascript:void(0)" onClick={this.submitEditStartProduction.bind(this,index)} key={index} id={"prodbtn_"+index}><i className="icon publish"></i><span>{formActions[index].label}</span></a>
                    </li>
                ))}
                </ul>
                </div></div>);
          }
        }
    }

closeFlyout() {
            $(".prodFlyoutCloseBtn").addClass("hide");
            $(".rightMenuFlyout.prod").removeClass("fly-in")
}

cancelAddNewCourse() {
    var self = this;
    bootbox.confirm({
        title: 'Confirm',
        message: 'Are you sure you want to cancel?',
        callback: function (state) {
            if (state) {
                let menudashboard = $("#menudashboard");
                menudashboard.find('.add-new-course-tmpl').closest('.list-row').remove();
                let buttonWrapper = $("#course_action_menu");

                buttonWrapper.find("#react-button-cancel-add-new-course").remove();
                $('.course-list-panel-additional').remove();
                buttonWrapper.find('a').not('.user-roles').addClass('hide');
                $('.no-record').show();
                var firstElement = menudashboard.find('.list-row:first').find('.react-list').find('tr:first');
                let currentChatDialogue;
                if (firstElement.length) {
                    currentChatDialogue = {chat_view_type: ''};
                    self.props.dispatch(changeChatView(currentChatDialogue));
                    firstElement.trigger('click');
                } else {
                    currentChatDialogue = {change_chat_view: 0};
                    self.props.dispatch(changeChatView(currentChatDialogue));
                }
            }
        }
    });
}

getAllUsers(){
  var self = this;
  $.ajax({
          url: domainUrl+'menudashboard/getAllUsers',
          type: 'POST',
          data:{is_production:"Y"},
          success: function(response) {
            if(typeof response=="string"){
                response = JSON.parse(response);
            }

            self.setState({
              users: response,
            });

            var userList = [];
            var getCurrentUserEmail;
            $.each(self.state.users, function (index, user) {
              userList.push({"key":user['node_id'],"value":user['email_address']});
              if(window.setUserID == user['node_id']){
                getCurrentUserEmail = user['email_address'];
              }
            });
          }
      });
}

saveProductionWithGuest(saveType){
  var self = this;
  $.ajax({
          url: domainUrl+'menudashboard/getAllUsers',
          type: 'POST',
          data:{is_production:"Y"},
          success: function(response) {
            if(typeof response=="string"){
                response = JSON.parse(response);
            }

            self.setState({
              users: response,
            });

            var userList = [];
            var getCurrentUserEmail;
            $.each(self.state.users, function (index, user) {
              userList.push({"key":user['node_id'],"value":user['email_address']});
              if(window.setUserID == user['node_id']){
                getCurrentUserEmail = user['email_address'];
              }
            });

            setTimeout(function(){
              self.saveProduction(saveType);
            },100)
          }
      });
}

saveProduction(saveType){
  let getNewProduction = this.props.newProductionCourse;
  var self = this;
  var getTitle = $("#prodTitle").val();
  //var productionObj = this.state.productionList.list.filter(function ( search ) {return search.instance_node_id == self.refs.productionList.value})[0];
  var ProdID = getNewProduction.productionID;
  var classID = null;
  var prodObjective = $("#courseObjective").val(); //this.refs.courseObjective.value;
  var prodDecription = $("#courseDecription").val(); //this.refs.courseDecription.value;
  var productionTitle = $("#productionTitle").val(); //this.refs.productionTitle.value;

  if(ProdID=="select"){
    bootbox.alert("Please select template");
    return false;
  }

  if($.trim(getTitle)==""){
    bootbox.alert("Please enter course title");
    return false;
  }

  if($.trim(productionTitle)==""){
    bootbox.alert("Please enter production title");
    return false;
  }

  var allUsers = true;
  var users = [];
  var userList = [];
  $.each(self.state.users, function (index, user) {
    userList.push({"key":user['node_id'],"value":user['email_address']});
  });

  $(".individual_user_id").each(function(){
    var getRoleID = $(this).attr("data-role");
    var getUserName = $.trim($(this).val());
    var emailTest = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(getUserName!="" && emailTest.test(getUserName)){
      var getUsersObj = userList.filter(function ( search ) {return search.value == getUserName})[0];
      if(getUsersObj){
        users.push({role_id:getRoleID,user_id:getUsersObj.key});
        $(this).removeClass("newUser");
      }
      else{
        $(this).addClass("newUser");
      }
    }
    else{
      allUsers = false;
    }
  });

  if(!allUsers){
    bootbox.alert("You have entered either blank or invalid email id.");
    return false;
  }

  let guestUsers = getGuestUsersProduction(self.saveProductionWithGuest.bind(self,saveType));
  if(guestUsers.length) {
      return true;
  }

  NProgress.start({position: 'middle'});
  var msg = {type:'addProductionCourse',template_id:ProdID,production_title:productionTitle,course_title:getTitle,course_instance_id:null,course_description:prodDecription,course_objective:prodObjective,created_by: window.setUserID,class_nid:classID,production_nid:ProdID,roles:users,saveType:saveType,default_params:{added_by_name:setUsername}};

  socket.send(JSON.stringify(msg));

  let currentChatDialogue = {
      change_chat_view: 1,
      currentChatDialogueDetail: {
          chat_view_type: "saving_data"
      }
  };
  NProgress.start({position: 'middle'});
  this.props.dispatch(changeChatView(currentChatDialogue));
  $("#viewCourseDefaultWrapper .input-field").val("");
  $("#viewCourseDefaultWrapper .textarea-field").val("");
}

submitEditStartProductionCustom(getBtnIndex){
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    var source = formComponents.actions.dataSource;
    var productionID = formComponents.actions.dataProduction;
    var dataToSend = {production_data_node_id:getProduction.production_data_node_id,instance_id:getProduction.instance_id,class_id:null,production_details_node_id:getProduction.production_details_node_id,operationKey:getProduction.operationKey,target:source,targetProduction:productionID,nodes:'customHTML',variables:null};
    NProgress.start({position: 'middle'});
    $.ajax({
          url: domainUrl+'board/saveProductionTemplate',
          type: 'POST',
          data: dataToSend,
          success: function(response) {
            let currentChatDialogue = {
                change_chat_view: 1,
                currentChatDialogueDetail: {
                    chat_view_type: "saving_data"
                }
            };

            if(typeof response=="string"){
                response = JSON.parse(response);
            }
            let getCourseList = self.props.courseList;
            let currentChatDialogueDetail = self.props.currentChatDialogueDetail;
            if(typeof getCourseList=="string"){
              getCourseList = JSON.parse(self.props.courseList);
            }
            var courseID = currentChatDialogueDetail.expand_course_node_id;//$(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
            let whichCourse = getCourseList[' '+$.trim(courseID)];
            whichCourse = whichCourse.course_instance_id;
            var getProdInstanceID = getProduction.production_details_node_id;//$(".production_list.current:not(.sub)").attr("data-id");
           // self.props.dispatch(changeChatView(currentChatDialogue));
            $.ajax({
                  url: domainUrl+'board/getProductionTemplate',
                  type: 'POST',
                  data:{course_instance_id:whichCourse,production_node_id:getProdInstanceID,status:'P',userID: window.setUserID},
                  success: function(response) {
                    self.props.dispatch(appendProductionDetail({course_node_id:courseID,response:response}));
                   // self.props.dispatch(changeChatView(currentChatDialogue));
                    setTimeout(function(){
                      if(typeof response=="string"){
                        response = JSON.parse(response);
                      }
                      if(response.permission==undefined || $.trim(response.permission)==""){
                        autoProductionClickCheck = true;
                        $(".main_production_list.current").find(".productionlistTitle").trigger("click");
                      }
                      else{
                        $(".main_production_list.current").find(".productionlistTitle").trigger("click");
                      }
                    });
                    var msg = {type:'updateProductionList',production_node_id:getProdInstanceID,userID: window.setUserID};
                    socket.send(JSON.stringify(msg));
                    NProgress.done();
                  }
            });
          }
      });
}

submitEditStartProduction(getBtnIndex){

    if(!validateCB()){
        return false;
    }

    var source,productionID;
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    if(formComponents.actions.length==0){
      return true;
    }
    let formActions = formComponents.actions.subactions[getBtnIndex];
    let getConditions = formActions.conditions;
    var getVars;

    var breakLogic = false;
    var operators = {
    '>': function(a, b) { return a > b },
    '<': function(a, b) { return a < b },
    '>=': function(a, b) { return a >= b },
    '<=': function(a, b) { return a <= b },
    '==': function(a, b) { return a == b },
    '!=': function(a, b) { return a != b },
    };
    for(var x=0;x<getConditions.length;x++){
        breakLogic = false;
        var getLogic = getConditions[x].logic;
        getVars = getConditions[x].variables;
        for(var z=0;z<getLogic.length;z++){
            var getOperator = getLogic[z].dataOperator;
            var getDataComparisonValue = getLogic[z].dataComparisonValue;
            var getDataProduction = getLogic[z].dataProduction;
            var getDataSource = getLogic[z].dataSource;
            var getDataAttribute = getLogic[z].dataAttribute;
            var compareVal = $("[data-id='"+getDataAttribute+"']").val();
            if(getOperator!='==' && getOperator!='!='){
                compareVal = parseInt(compareVal);
                getDataComparisonValue = parseInt(getDataComparisonValue);
            }
            if(getOperator==null || getOperator==undefined){
                source = getDataSource;
                productionID = getDataProduction;
                break;
            }
            if(operators[getOperator](compareVal, getDataComparisonValue)){
                source = getDataSource;
                productionID = getDataProduction;
            }
            else{
                breakLogic = true;
                break;
            }
        }

        if(breakLogic==false){
            break;
        }
    }

    if(breakLogic==true){
        bootbox.alert("Invalid Inputs");
        return false;
    }

    if(getVars==undefined){
      getVars = "";
    }

    let holdElements = [];
    var self = this;
    $(".productionElm").each(function(){
        var nodeID = $(this).attr("data-id");
        var nodeValue = $(this).val();
        holdElements.push({nodeID:nodeID,value:nodeValue});
    });

    let holdCheckBoxes = {};
    $(".productionCheckboxElm:checked").each(function(){
        var nodeID = $(this).attr("data-id");
        var nodeValue = $(this).val();
        if(holdCheckBoxes[nodeID]==undefined){
          holdCheckBoxes[nodeID] = [];
        }
         holdCheckBoxes[nodeID].push(nodeValue);
    });

    for(var s in holdCheckBoxes){
      var tempVar="";
      var chkLength = holdCheckBoxes[s].length;
      for(var x=0;x<chkLength;x++){
        tempVar = tempVar+holdCheckBoxes[s][x]+"~#~";
      }
      holdElements.push({nodeID:s,value:tempVar});
    }

    $(".productionRadioElm:checked").each(function(){
        var nodeID = $(this).attr("data-id");
        var nodeValue = $(this).val();
        holdElements.push({nodeID:nodeID,value:nodeValue});
    });

    var dataToSend = {production_data_node_id:getProduction.production_data_node_id,instance_id:getProduction.instance_id,class_id:getProduction.formJson.dataClass,production_details_node_id:getProduction.production_details_node_id,operationKey:getProduction.operationKey,target:source,targetProduction:productionID,nodes:holdElements,variables:getVars};
    NProgress.start({position: 'middle'});
    $.ajax({
          url: domainUrl+'board/saveProductionTemplate',
          type: 'POST',
          data: dataToSend,
          success: function(response) {
            let currentChatDialogue = {
                change_chat_view: 1,
                currentChatDialogueDetail: {
                    chat_view_type: "saving_data"
                }
            };

            if(typeof response=="string"){
                response = JSON.parse(response);
            }
            let getCourseList = self.props.courseList;
            let currentChatDialogueDetail = self.props.currentChatDialogueDetail;
            if(typeof getCourseList=="string"){
              getCourseList = JSON.parse(self.props.courseList);
            }
            var courseID = currentChatDialogueDetail.expand_course_node_id;//$(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
            let whichCourse = getCourseList[' '+$.trim(courseID)];
            whichCourse = whichCourse.course_instance_id;
            var getProdInstanceID = getProduction.production_details_node_id;//$(".production_list.current:not(.sub)").attr("data-id");
            var msg = {type:'sendProductionNotification',course:response.notification.course,production:response.notification.production,userID: window.setUserID,notification_all:response.notification.all,notification_next:response.notification.next};
            console.log(msg);
            console.log("Sending Desktop Notification");
            socket.send(JSON.stringify(msg));
            //self.props.dispatch(changeChatView(currentChatDialogue));
            $.ajax({
                  url: domainUrl+'board/getProductionTemplate',
                  type: 'POST',
                  data:{course_instance_id:whichCourse,production_node_id:getProdInstanceID,status:'P',userID: window.setUserID},
                  success: function(response) {
                    self.props.dispatch(appendProductionDetail({course_node_id:courseID,response:response}));
                    //self.props.dispatch(changeChatView(currentChatDialogue));
                    setTimeout(function(){
                      if(typeof response=="string"){
                        response = JSON.parse(response);
                      }
                      if(response.permission==undefined || $.trim(response.permission)==""){
                        autoProductionClickCheck = true;
                        if($(".rightMenuFlyout.prod.fly-in").length==0){
                          $(".main_production_list.current").find(".productionlistTitle").trigger("click");
                        }
                      }
                      else{
                        if($(".rightMenuFlyout.prod.fly-in").length==0){
                          $(".main_production_list.current").find(".productionlistTitle").trigger("click");
                        }
                      }
                    });
                    var msg = {type:'updateProductionList',production_node_id:getProdInstanceID,userID: window.setUserID};
                    socket.send(JSON.stringify(msg));
                    self.props.dispatch(appendProductionStart({response:response}));
                    NProgress.done();
                  }
            });
          }
      });
}

componentDidMount() {
    //var getTemplateType = this.props.currentChatDialogueDetail.chat_view_type;
    this.getAllUsers();
}

}
const mapStateToProps = (state) => {
    return {
        changeChatView : state.changeChatView,
        showAdminHeader : state.showAdminHeader,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        view_type: state.view_type,
        productionStart: state.productionStart,
        newProductionCourse: state.newProductionCourse
    }
}
const ConnectedRightActionBarProduction = connect(mapStateToProps)(RightActionBarProduction);
export default ConnectedRightActionBarProduction;
