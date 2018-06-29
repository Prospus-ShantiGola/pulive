import React from 'react';
import {connect} from 'react-redux';
import {changeChatView} from '../../actions/actions';

class AddProduction extends React.Component {
    constructor() {
      super();
      this.state={
        productionList:{},
        roleList:{},
        users:{}
      };
    }
    render() {
      let roles = this.state.roleList;
        return (
            <div className="display-wrapper dashSlider clearfix set-height active courseViewData">
                <div className="control-bar view-course-control-bar" id="viewCourseControlBar">
                    <div className="row">
                        <div className="col-md-12 left-head">
                            <div className="block-head view-block-head">
                                <div className="course-top-panel">
                                    <div className="viewCourseTitleHeadline">New Production</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="HalfPaneHeight mainAccordianHig viewCourseDefaultSec" id="viewCourseDefaultWrapper">
                    <div className="viewDefaultContainer">
                        <div className="mainAccordianDiv">
                            <div className="nano clearfix">
                                <div className="nano-content clearfix fixedTableHig">
                                    <div className="list-section">
                                       <div className="prod-list-row">
                                            <div className="list-col">
                                                <select id="selectProduction" className="select-field" ref="productionList" onChange={this.getProductionRoles.bind(this)}>
                                                    <option value="select">Select Template</option>
                                                </select>
                                            </div>
                                       </div>
                                       <div className="prod-list-row">
                                            <div className="list-col">
                                                <span>Production Title</span>
                                            </div>
                                            <div className="list-col">
                                                <input type="text" className="form-control input-field" ref="productionTitle"/>
                                            </div>
                                       </div>
                                          {
                                            this.addProductionHeaders()
                                          }
                                          {
                                             Object.keys(roles).map(function(keyName, index) {
                                              let roleName = roles[keyName];
                                              let roleID = keyName;
                                              return (
                                                        <div className="prod-list-row" key={index}>
                                                          <div className="list-col">
                                                              <span>{roleName}</span>
                                                          </div>
                                                          <div className="list-col">
                                                              <input type="text" data-role={roleID} className="individual_user_id form-control input-field auto-suggest"/>
                                                          </div>
                                                        </div>
                                                      )
                                             })
                                          }
                                          <div id="individualAutoCompleteBox" className="individualAutoCompleteBox clearfix">
                                            <div className="autocomplete-suggestions"></div>
                                            <div className="autocomplete-suggestions" style={{position:'absolute', display:'none', width:'82%', maxHeight:'300px', zIndex:'9999'}}></div>
                                            <div className="autocomplete-suggestions" style={{position:'absolute', display:'none', width:'82%', maxHeight:'300px', zIndex:'9999'}}></div>
                                          </div>
                                          <button id="saveNewProduction" onClick={this.saveNewProduction.bind(this)} style={{display:'none'}}>Save</button>
                                          <button id="cancelNewProduction" onClick={this.cancelNewProduction.bind(this)} style={{display:'none'}}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

addProductionHeaders(){
  let roles = this.state.roleList;
  if(Object.keys(roles).length !== 0){
      return(
     <div className="prod-list-row">
          <div className="list-col">
              <span><strong>Role(s)</strong></span>
          </div>
          <div className="list-col">
              <span><strong>Actor(s)</strong></span>
          </div>
     </div>
      )
  }
}

cancelNewProduction(){
  let currentChatDialogue = {
      change_chat_view: 0,
      currentChatDialogueDetail: {
          chat_view_type: "add_production"
      }
  };
  $("#course_action_menu .productionRHSButtons").remove();
  $("#course_action_menu a").addClass("hide");
  this.props.dispatch(changeChatView(currentChatDialogue));
}

saveNewProduction(saveType){
  var self = this;
  var getTitle = $("#prodTitle").val();
  var ProdID = this.refs.productionList.value;
  var productionTitle = this.refs.productionTitle.value;
  var getCourses = this.props.courseList;
  if(typeof getCourses=="string"){
    getCourses = JSON.parse(getCourses);
  }
  var whichCourse = this.props.newProduction;
  var courseInstanceID = getCourses[' '+$.trim(whichCourse)].course_instance_id
  if(ProdID=="select"){
    bootbox.alert("Please select template");
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
    if(getUserName!=""){
      var getUsersObj = userList.filter(function ( search ) {return search.value == getUserName})[0];
      users.push({role_id:getRoleID,user_id:getUsersObj.key});
    }
    else{
      allUsers = false;
    }
  });

  if(!allUsers){
    bootbox.alert("All roles are mandatory");
    return false;
  }

  var msg = {type:'addProductionCourse',template_id:ProdID,production_title:productionTitle,course_instance_id:courseInstanceID,created_by: window.setUserID,production_nid:ProdID,roles:users,default_params:{added_by_name:setUsername}};
  socket.send(JSON.stringify(msg));
  $("#viewCourseDefaultWrapper .input-field").val("");
  $("#viewCourseDefaultWrapper .textarea-field").val("");
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
              users: response
            });
          }
      });
}


getProductionTemplates(){
    var self = this;
    $.ajax({
          url: domainUrl+'board/getCourseBuilderClasses', //domainUrl+'menudashboard/getCourseBuilderClasses',
          type: 'POST',
          data: {'isCall':'Y','user_id': window.setUserID},
          success: function(response) {
            if(typeof response=="string"){
                response = JSON.parse(response);
            }

            for(var x=0;x<response.list.length;x++){
                $("#selectProduction").append("<option value='"+response.list[x].production_id+"'>"+response.list[x].title1+"</option>");
            }
            self.setState({
              productionList: response
            });
          }
      });
}

getProductionRoles(){
    var self = this;
    if(this.refs.productionList.value=="select"){
      this.setState({
              roleList: {}
            });
      return false;
    }
    var productionObj = this.state.productionList.list.filter(function ( search ) {return search.instance_node_id == self.refs.productionList.value})[0];
    $.ajax({
          url: domainUrl+'board/activeRolesFromProduction', //domainUrl+'menudashboard/getCourseBuilderClasses',
          type: 'POST',
          data: {'productionId':productionObj.instance_node_id, 'classNodeId':productionObj.class_node_id},
          success: function(response) {
           if(typeof response=="string"){
              response = JSON.parse(response);
           }
            self.setState({
              roleList: response.role_list
            });

            var userList = [];

            $.each(self.state.users, function (index, user) {
              userList.push({"key":user['node_id'],"value":user['email_address']});
            });

            $('.auto-suggest').autocomplete({
                  appendTo: "#individualAutoCompleteBox",
                  lookup: userList,
                  width: '80%',
                  forceFixPosition: 'auto',
                  orientation: 'bottom'
            });

          }
      });

}

componentDidMount() {
    this.getProductionTemplates();
    this.getAllUsers();
    $("#course_action_menu .productionRHSButtons").remove();
    $("#course_action_menu a").addClass("hide");
    $("#course_action_menu").append("<a href='javascript:void(0)' data-action='saveNewProduction' class='productionRHSButtons'><i class='icon publish'></i><br><span>Save</span></a>");
    $("#course_action_menu").append("<a href='javascript:void(0)' data-action='cancelNewProduction' class='productionRHSButtons'><i class='icon cancel'></i><br><span>Cancel</span></a>");
}

}

const mapStateToProps = (state) => {
    return {
        changeChatView: state.changeChatView,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        isAddNewProduction:state.isAddNewProduction,
        productionDetail:state.productionDetail,
        productionStart:state.productionStart,
        productionInstance:state.productionInstance,
        newProduction:state.newProduction
    }
}
const ConnectedAddProduction = connect(mapStateToProps)(AddProduction);
export default ConnectedAddProduction;
