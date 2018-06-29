import React from 'react';
import {connect} from 'react-redux';
import {changeChatView} from '../../actions/actions';
class AddProductionCourse extends React.Component {
    constructor() {
      super();
      this.state={
        productionList:{},
        roleList:{},
        users:{},
        initiator:'',
        currentUserEmail:''
      };
    }
    render() {
      let roles = this.state.roleList;
      let self = this;
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
                                  <div className="view-course-pane">
                                    <div className="panel-group" id="production-view" role="tablist" aria-multiselectable="true">
                                      <div className="panel panel-default">
                                          <div className="panel-heading" role="tab" id="headingOne">
                                            <h4 className="panel-title">
                                              <a role="button" data-toggle="collapse" data-parent="#production-view1" href="#prodCourse" aria-expanded="true" aria-controls="collapseOne">
                                                  <div className="course-col">
                                                      <span className="course-left-pane"><i className="icon-sm course-white"></i><span>Course</span></span>
                                                      <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                                  </div>
                                              </a>
                                            </h4>
                                          </div>
                                          <div id="prodCourse" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                            <div className="panel-body">
                                              <div className="list-section">
                                                  <div className="prod-list-row">
                                                      <div className="list-col">
                                                          <input style={{"display":"none"}} id="selectProduction" className="select-field" ref="productionList"/>
                                                          <span className="form-label">Course Title</span>
                                                      </div>
                                                      <div className="list-col">
                                                          <input type="text" className="form-control input-field" maxLength={COURSE_DIALOGUE_TITLE_LENGTH} id="prodTitle" placeholder="Course Title"/>
                                                      </div>
                                                 </div>
                                                 <div className="prod-list-row">
                                                      <div className="list-col">
                                                        <span className="form-label">Course Objective</span>
                                                      </div>
                                                      <div className="list-col">
                                                        <textarea rows="3" cols="3" className="form-control textarea-field" ref="courseObjective" id="courseObjective"></textarea>
                                                      </div>
                                                 </div>
                                                 <div className="prod-list-row">
                                                      <div className="list-col">
                                                          <span className="form-label">Course Description</span>
                                                      </div>
                                                      <div className="list-col">
                                                          <textarea rows="3" cols="3" className="form-control textarea-field" ref="courseDecription" id="courseDecription"></textarea>
                                                      </div>
                                                 </div>

                                                 <div className="prod-list-row">
                                                      <div className="list-col">
                                                          <span className="form-label">Production Title</span>
                                                      </div>
                                                      <div className="list-col">
                                                          <input type="text" className="form-control input-field" ref="productionTitle" id="productionTitle"/>
                                                      </div>
                                                 </div>
                                              </div>
                                            </div>
                                          </div>
                                      </div>
                                      <div className="panel panel-default">
                                          <div className="panel-heading" role="tab" id="headingTwo">
                                            <h4 className="panel-title">
                                              <a className="collapsed" role="button" data-toggle="collapse" data-parent="#production-view1" href="#prodRole" aria-expanded="false" aria-controls="collapseTwo">
                                                  <div className="course-col">
                                                      <span className="course-left-pane"><i className="icon-sm roles-white"></i><span className="course-title">Roles</span></span>
                                                      <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                                  </div>
                                              </a>
                                            </h4>
                                          </div>
                                          <div id="prodRole" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                                            <div className="panel-body">
                                              <div className="list-section">
                                                  <div className="prod-list-row">
                                                    <div className="list-col">
                                                        <span><strong>Role(s)</strong></span>

                                                    </div>
                                                    <div className="list-col">
                                                        <span><strong>Actor(s)</strong></span>
                                                    </div>
                                               </div>

                                               <div className="prod-list-row productionMSGBox" style={{color:'#ff0000'}}>
                                               Loading Roles...
                                               </div>
                                                  {
                                                     Object.keys(roles).map(function(keyName, index) {
                                                      let roleName = roles[keyName];
                                                      let roleID = keyName;
                                                      let initiator = "";
                                                      let setValue = "";
                                                      let currentUser = "";
                                                      if(self.state.initiator==roleID){
                                                        initiator = <span style={{color:'#ff0000'}}>(Initiator)</span>;
                                                        setValue = <input type='hidden' data-role={roleID} value={self.state.currentUserEmail} readOnly className='hidden individual_user_id form-control input-field auto-suggest-prod'/>;
                                                        currentUser = self.state.currentUserEmail;
                                                      }
                                                      else{
                                                        setValue = <input type='text' data-role={roleID} className='individual_user_id form-control input-field auto-suggest-prod'/>;
                                                      }
                                                      return (
                                                                <div className="prod-list-row productionRoleBox" key={index} style={{display:'none'}}>
                                                                  <div className="list-col">
                                                                      <span className="form-label">{roleName}</span>
                                                                  </div>
                                                                  <div className="list-col">
                                                                      {setValue}{currentUser} {initiator}
                                                                  </div>
                                                                </div>
                                                              )
                                                     })
                                                  }
                                                  <div id="individualAutoCompleteBox" className="individualAutoCompleteBox clearfix">                                                    
                                                  </div>
                                                </div>
                                            </div>
                                          </div>
                                      </div>
                                      <div className="panel panel-default">
                                          <div className="panel-heading" role="tab" id="headingThree">
                                            <h4 className="panel-title">
                                              <a className="collapsed" role="button" data-toggle="collapse" data-parent="#production-view1" href="#prodDialogue" aria-expanded="false" aria-controls="collapseThree">
                                                  <div className="course-col">
                                                      <span className="course-left-pane"><i className="icon-sm dialogue-white"></i><span>Dialogues</span></span>
                                                      <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                                  </div>
                                              </a>
                                            </h4>
                                          </div>
                                          <div id="prodDialogue" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                            <div className="panel-body" style={{"display":"none"}}>
                                            </div>
                                          </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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

            self.setState({
              currentUserEmail:getCurrentUserEmail
            });

            $('.auto-suggest-prod').autocomplete({
                  appendTo: "#individualAutoCompleteBox",
                  lookup: userList,
                  width: '80%',
                  forceFixPosition: 'auto',
                  orientation: 'bottom'
            });

            $(".productionRoleBox").css("display","flex");
            $(".productionMSGBox").css("display","none");
          }
      });
}


getProductionTemplates(){
    var self = this;
    let getNewProduction = this.props.newProductionCourse;
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
            var getPID = $("#courseTemplateFlyoutList li.active").attr("data-productionid");
            if(getPID!=undefined){
              $("#selectProduction").val(getPID);
              self.getProductionRoles();
            }
          }
      });
}

getProductionRoles(){
    $("#viewCourseDefaultWrapper .input-field").val("");
    $("#viewCourseDefaultWrapper .textarea-field").val("");
    var self = this;
    let getNewProduction = this.props.newProductionCourse;
    getNewProduction = getNewProduction.productionID;
    if(!getNewProduction){
      return false;
    }

    //var productionObj = this.state.productionList.list.filter(function ( search ) {return search.instance_node_id == self.refs.productionList.value})[0];
    $.ajax({
          url: domainUrl+'board/activeRolesFromProduction', //domainUrl+'menudashboard/getCourseBuilderClasses',
          type: 'POST',
          data: {'productionId':getNewProduction},
          success: function(response) {
           if(typeof response=="string"){
              response = JSON.parse(response);
           }

           self.setState({
              roleList: response.role_list,
              initiator:response.initiator
            });

            self.getAllUsers();
          }
      });

}

componentDidMount() {
    //this.getProductionTemplates();
    //this.getAllUsers();
    this.getProductionRoles();
    $("#course_action_menu a").addClass("hide");
    $("#react-button-cancel-add-new-course").removeClass("hide");
    //$("#react-button-savedraft-new-template-course").removeClass("hide");
    $("#react-button-publish-new-template-course").removeClass("hide");
}

componentWillReceiveProps(newProps){
   // this.getProductionTemplates();
    //this.getAllUsers();
    this.getProductionRoles();
    $("#course_action_menu a").addClass("hide");
    $("#react-button-cancel-add-new-course").removeClass("hide");
    //$("#react-button-savedraft-new-template-course").removeClass("hide");
    $("#react-button-publish-new-template-course").removeClass("hide");
}

}
//export default AddProductionCourse;
const mapStateToProps = (state) => {
    return {
        view_type: state.view_type,
        chatItems: state.chatItems,
        chatType: state.chatType,
        updaetd_timestamp: state.updaetd_timestamp,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        header_notification: state.header_notification,
        newProductionCourse: state.newProductionCourse
    }
}

const AddProductionCourseExport = connect(mapStateToProps)(AddProductionCourse);
export default AddProductionCourseExport;
