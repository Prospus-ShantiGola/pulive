import React from 'react';
import {connect} from 'react-redux';
import {productionDetail,changeChatView} from '../../actions/actions';

class ViewProduction extends React.Component {
    constructor() {
      super();
      this.state={
        productionList:{},
        roleList:{},
        users:{},
        userList:[],
        usersObject:{},
        courseTitle:"",
        courseObjective:"",
        courseDescription:"",
        productionTitle:""
      };
    }
    render() {
      let roles = this.state.roleList;
      let course = this.props.courseList;
      var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
      let productionDetail = course[" "+ $.trim(getCourseID)].productionDetail;
      let courseReadonly = false;
      let formLabel = "";
        if(productionDetail.course_status=="P"){
            courseReadonly = true;
        }
        else{
            courseReadonly = false;
        }
        return (
            <div className="display-wrapper dashSlider clearfix set-height active courseViewData">
                <div className="control-bar view-course-control-bar" id="viewCourseControlBar">
                    <div className="row">
                        <div className="col-md-12 left-head">
                            <div className="block-head view-block-head">
                                <div className="course-top-panel">
                                    <div className="viewCourseTitleHeadline">{this.state.productionTitle}</div>
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
                                                <select id="selectProduction" className="select-field" ref="productionList" disabled>
                                                    <option value="select">Select Templates</option>
                                                </select>
                                            </div>
                                            <div className="list-col">
                                            <input type="text" className="form-control input-field" readOnly={courseReadonly} id="prodTitle" placeholder="Course Title" value={this.state.courseTitle} onChange={event=>{this.setState({courseTitle: event.target.value})}}/>
                                            </div>
                                       </div>
                                       <div className="prod-list-row">
                                            <div className="list-col">
                                              <span>Course Objective</span>
                                            </div>
                                            <div className="list-col">
                                              <textarea rows="3" cols="3" className="form-control textarea-field" readOnly={courseReadonly} ref="courseObjective" value={this.state.courseObjective} onChange={event=>{this.setState({courseObjective: event.target.value})}}></textarea>
                                            </div>
                                       </div>
                                       <div className="prod-list-row">
                                            <div className="list-col">
                                                <span>Course Description</span>
                                            </div>
                                            <div className="list-col">
                                                <textarea rows="3" cols="3" className="form-control textarea-field" readOnly={courseReadonly} ref="courseDecription" value={this.state.courseDescription} onChange={event=>{this.setState({courseDescription: event.target.value})}}></textarea>
                                            </div>
                                       </div>

                                       <div className="prod-list-row">
                                            <div className="list-col">
                                                <span>Production Title</span>
                                            </div>
                                            <div className="list-col">
                                                <input type="text" className="form-control input-field" readOnly={courseReadonly} value={this.state.productionTitle} ref="productionTitle" onChange={event=>{this.setState({productionTitle: event.target.value})}}/>
                                            </div>
                                       </div>

                                       <div className="prod-list-row">
                                            <div className="list-col">
                                                <span><strong>Role(s)</strong></span>

                                            </div>
                                            <div className="list-col">
                                                <span><strong>Actor(s)</strong></span>
                                            </div>
                                       </div>
                                          {
                                            this.getProductionRoles()
                                          }
                                          <div id="individualAutoCompleteBox" className="individualAutoCompleteBox clearfix">
                                            <div className="autocomplete-suggestions"></div>
                                            <div className="autocomplete-suggestions" style={{position:'absolute', display:'none', width:'82%', maxHeight:'300px', zIndex:'9999'}}></div>
                                            <div className="autocomplete-suggestions" style={{position:'absolute', display:'none', width:'82%', maxHeight:'300px', zIndex:'9999'}}></div>
                                          </div>
                                          <button id="saveDraftProduction" onClick={this.saveProduction.bind(this,"D")} style={{display:'none'}}>Save</button>
                                          <button id="savePublishProduction" onClick={this.saveProduction.bind(this,"P")} style={{display:'none'}}>Publish</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

saveProduction(saveType){
  let course = this.props.courseList;
  var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
  var getProductionID = ' ' + $.trim($(".production_list.current").attr("data-id"));
  var self = this;
  var getTitle = $("#prodTitle").val();
  var getTitleID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.title.course_prop_id;
  //var productionObj = this.state.productionList.list.filter(function ( search ) {return search.instance_node_id == self.refs.productionList.value})[0];
  var ProdID = this.refs.productionList.value;
  //var classID = productionObj.class_node_id;
  var prodObjective = this.refs.courseObjective.value;
  var prodObjectiveID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.objectives.course_prop_id;
  var prodDecription = this.refs.courseDecription.value;
  var prodDecriptionID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.description.course_prop_id;
  var productionTitle = this.refs.productionTitle.value;
  var productionTitleID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].property.production_name.property_id;
  var course_instance_id = course[' '+$.trim(getCourseID)].course_instance_id;
  var productionInstanceID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].production_instance_id;


  if($.trim(getTitle)==""){
    bootbox.alert("Please enter course title");
    return false;
  }

  if($.trim(prodObjective)==""){
    bootbox.alert("Please enter objective");
    return false;
  }

  if($.trim(prodDecription)==""){
    bootbox.alert("Please enter description");
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
  })

  if(!allUsers){
    bootbox.alert("All roles are mandatory");
    return false;
  }

  var msg = {type:'editProductionCourse',template_id:$("#selectProduction").val(),production_title:productionTitle,production_title_id:productionTitleID,course_title:getTitle,course_title_id:getTitleID,course_instance_id:course_instance_id,course_description:prodDecription,course_description_id:prodDecriptionID,course_objective:prodObjective,course_objective_id:prodObjectiveID,created_by: window.setUserID,production_nid:ProdID,production_instance_id:productionInstanceID,roles:users,saveType:saveType,default_params:{added_by_name:setUsername}}
  socket.send(JSON.stringify(msg));
  let currentChatDialogue = {
    change_chat_view: 1,
    currentChatDialogueDetail: {
        chat_view_type: "saving_data"
    }
  };
  self.props.dispatch(changeChatView(currentChatDialogue));
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

              var getUserList = [];
              $.each(self.state.users, function (index, user) {
              getUserList.push({"key":user['node_id'],"value":user['email_address']});
              });
              self.setState({
                userList: getUserList
              });
              $('.auto-suggest').autocomplete({
              appendTo: "#individualAutoCompleteBox",
              lookup: self.state.userList,
              width: '80%',
              forceFixPosition: 'auto',
              orientation: 'bottom'
          });

          }
      });
}


getProductionTemplates(){
    var self = this;
    let course = this.props.courseList;
    var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
    var getProductionID = ' ' + $.trim($(".production_list.current").attr("data-id"));
    if(!course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID]){
      return true;
    }
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
            var getTemplateID = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].template_id;
            if(getTemplateID!=undefined){
              $("#selectProduction").val(getTemplateID);
            }
            if(course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.objectives){
              var courseObjective = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.objectives.course_prop_val;
            }
            else{
              var courseObjective = "";
            }


            if(course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.description){
              var courseDescription = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].property.description.course_prop_val;
            }
            else{
              var courseDescription = "";
            }


            self.setState({
              usersObject: course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].users,
              courseTitle: course[' '+$.trim(getCourseID)].course,
              courseObjective: courseObjective,
              courseDescription: courseDescription,
              productionTitle: course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].property['production_name']['property_val']
            });
          }
      });
}

getProductionRoles(){
    var self = this;
    let course = this.props.courseList;
    var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
    let productionDetail = course[" "+ $.trim(getCourseID)].productionDetail;
    let courseReadonly = false;
      if(productionDetail.course_status=="P"){
          courseReadonly = true;
      }
      else{
          courseReadonly = false;
      }
    return Object.keys(this.state.usersObject).map(function(key, index) {
          let roleName = self.state.usersObject[key].role_name;
          let userEmail = self.state.usersObject[key].email;
          let roleID = self.state.usersObject[key].role_id;
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{roleName}</span>
                  </div>
                  <div className="list-col">
                      <input type="text" data-role={roleID} defaultValue={userEmail} readOnly={courseReadonly} className="individual_user_id form-control input-field auto-suggest"/>
                  </div>
                </div>
              )
      });
}

componentDidMount() {
    this.getProductionTemplates();
    this.getAllUsers();
    $("#course_action_menu a").addClass("hide");
    let course = this.props.courseList;
    var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
    let productionDetail = course[" "+ $.trim(getCourseID)].productionDetail;
    let courseReadonly = false;
      if(productionDetail.course_status!="P"){
          //$("#react-button-cancel-add-new-course").removeClass("hide");
          $("#react-button-cancel-add-new-course").remove();
          $("#react-button-savedraft-new-template-course").removeClass("hide");
          $("#react-button-publish-new-template-course").removeClass("hide");
      }
}

componentWillReceiveProps(newProps){
  let course = newProps.courseList;
  var getCourseID = $(".course-list-detail:visible").parent().find(".table").attr("data-course-node-id");
  var getProductionID = ' ' + $.trim($(".production_list.current").attr("data-id"));
  var getNewProdTitle = course[' '+$.trim(getCourseID)].productionDetail[$.trim(getCourseID)].production[getProductionID].property['production_name']['property_val']
  if(getNewProdTitle!=this.state.productionTitle){
      this.getProductionTemplates();
      this.getAllUsers();
      $("#course_action_menu a").addClass("hide");
      let productionDetail = course[" "+ $.trim(getCourseID)].productionDetail;
      let courseReadonly = false;
        if(productionDetail.course_status!="P"){
            //$("#react-button-cancel-add-new-course").removeClass("hide");
            $("#react-button-cancel-add-new-course").remove();
            $("#react-button-savedraft-new-template-course").removeClass("hide");
            $("#react-button-publish-new-template-course").removeClass("hide");
        }
  }
}

}

const mapStateToProps = (state) => {
    return {
        changeChatView: state.changeChatView,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        isAddNewProduction:state.isAddNewProduction,
        productionDetail:state.productionDetail
    }
}
const ConnectedProductionDetail = connect(mapStateToProps)(ViewProduction);
export default ConnectedProductionDetail;
