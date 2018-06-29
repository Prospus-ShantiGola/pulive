import React from 'react';
import ChatApp from '../../chat_app';
import {connect} from 'react-redux';
import EditCourseDialogueTitle from '../edit_course_dialogue_title';
import AddProductionCourse from '../../course_builder/new_production';
import AddProduction from '../../course_builder/add_production';
import ViewProduction from '../../course_builder/view_production';
import StartProduction from '../../course_builder/start_production';
import EditStartProduction from '../../course_builder/edit_start_production';
import RightActionBarProduction from '../../course_builder/right_action_bar';
import {showAdminHeader} from '../../../actions/actions';
import {changeChatView,appendProductionStart} from '../../../actions/actions';
import {getCurrentDialogue} from '../../functions/common_functions';

class ChatSection extends React.Component {
    constructor() {
      super();
      this.state={
        workflowProduction:{},
      };
    }
    render() {
        let {change_chat_view} = this.props;
        return (
            this.getChatSection(change_chat_view)
        )
    }
    getChatSection(change_chat_view) {
        let self = this;
        let {view_type} = this.props;
        var img = ''

        if(view_type == 'bycourse'){
            img = PU_CDN_URL + 'public/img/course-banner.jpg'
        }
        if(view_type == 'byactor'){
            img = PU_CDN_URL + 'public/img/by-actor.jpg'
        }

        if(change_chat_view) {
            let course_action_menu = $("#course_action_menu");
            let {currentChatDialogueDetail, courseList} = this.props;
            course_action_menu.find("a").addClass("hide");
            if(currentChatDialogueDetail.chat_view_type != 'add_new_dialogue') {
                let menudashboard = $("#menudashboard");
                menudashboard.find('#add-new-dialogue-untitled-wrapper').remove();
                course_action_menu.find("#react-button-cancel-add-new-dialogue").remove();
            }

            if(currentChatDialogueDetail.chat_view_type == 'add_new_course') {
                return (
                    <div className="flex-item half-pane" id="rightPane">
                        <span className="dialogue-container">
                            {
                                this.getChatHeaderAddMode()
                            }
                        </span>

                        <ChatApp />

                    </div>
                )
            }

            if(currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
                return (
                    <div className="flex-item half-pane" id="rightPane">
                        <span className="dialogue-container">
                            {
                                this.getChatHeaderAddMode()
                            }
                        </span>
                        <ChatApp />
                    </div>
                )
            }

            if(currentChatDialogueDetail.chat_view_type=="add_new_template"){
                return  this.getProductionSection()
            }

            if(currentChatDialogueDetail.chat_view_type=="add_production"){
                return  this.getProductionAdd()
            }

            if(currentChatDialogueDetail.chat_view_type=="view_production_template"){
                return  this.viewProductionSection()
            }

            if(currentChatDialogueDetail.chat_view_type=="start_production_template"){
                return  this.getStartProductionSection()
            }

            if(currentChatDialogueDetail.chat_view_type=="edit_production_template"){
                return  this.getEditProductionSection()
            }

            if(currentChatDialogueDetail.chat_view_type=="saving_data"){
                return (
                         <div className="flex-item half-pane" id="rightPane">
                            <div className="control-bar view-course-control-bar" id="viewCourseControlBar">
                                <div className="row">
                                    <div className="col-md-12 left-head">
                                        <div className="block-head view-block-head">
                                            <div className="course-top-panel">
                                                <div className="viewCourseTitleHeadline"></div>
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
                                                <div className="imitation-wrapper">
                                                    <p>Saving Data....</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                )
            }

            if(currentChatDialogueDetail.chat_view_type=="loading_data"){
                return (
                         <div className="flex-item half-pane" id="rightPane">
                            <div className="control-bar view-course-control-bar" id="viewCourseControlBar">
                                <div className="row">
                                    <div className="col-md-12 left-head">
                                        <div className="block-head view-block-head">
                                            <div className="course-top-panel">
                                                <div className="viewCourseTitleHeadline"></div>
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
                                                <div className="imitation-wrapper">
                                                    <p>Loading Data....</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                )
            }

            return (
                <div className="flex-item half-pane" id="rightPane">
                    <div className="flex-head clearfix" id="existingDialogueControl">
                        <div className="add-course-pane">
                            {
                                this.getChatHeader()
                            }
                        </div>

                     </div>


                    {/*
                        <div className="control-bar existing-dialogue-control-wrap show" id="existingDialogueControl">
                            <div className="row">
                                <div className="col-md-12 left-head-chat">
                                    <div className="block-head existing-dialogue-block-head">
                                        <div className="course-top-panel clearfix">
                                            <div className="existTopPanel clearfix">

                                                {
                                                    this.getChatHeader()
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    */}




                    <ChatApp />
                </div>
            )
        }
        this.hideActionButtons();        
        return (
            <div className="flex-item half-pane" id="rightPane">

                <div className="flex-head clearfix">
                    <div className="left detail-title"><i className="icon-sm course-black"></i>
                    <span>Course Detail</span></div>
                    <div className="right detail-action">
                      <i className="icon-sm dot-md"></i>
                    </div>
                </div>

                <div className="detail-pane">
                    <div className="nano paneHT">
                    <div className="nano-content">
                        <div className="view-course-pane">
                                    <div className="panel-group" id="course-view" role="tablist" aria-multiselectable="true">
                                      {
                                        this.showProductionWorkflow()
                                      }
                                        <div className="panel panel-default">
                                            <div className="panel-heading" role="tab" id="headingTwo">
                                              <h4 className="panel-title">
                                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#course-view1" href="#course-notification" aria-expanded="false" aria-controls="collapseTwo">
                                                    <div className="course-col">
                                                        <span className="course-left-pane"><i className="icon-sm notification"></i><span className="course-title">Notifications</span></span>
                                                        <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                              </h4>
                                            </div>
                                            <div id="course-notification" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                                              <div className="panel-body">
                                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                                              </div>
                                            </div>
                                        </div>
                                        <div className="panel panel-default">
                                            <div className="panel-heading" role="tab" id="headingThree">
                                              <h4 className="panel-title">
                                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#course-view1" href="#course-dialogue" aria-expanded="false" aria-controls="collapseThree">
                                                    <div className="course-col">
                                                        <span className="course-left-pane"><i className="icon-sm dialogue-white"></i><span>Dialogues</span></span>
                                                        <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                                    </div>
                                                </a>
                                              </h4>
                                            </div>
                                            <div id="course-dialogue" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                                              <div className="panel-body">
                                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                                              </div>
                                            </div>
                                        </div>


                                    </div>
                        </div>
                      </div>
                     </div>
                </div>




                {/*
                <div className="HalfPaneHeight mainAccordianHig viewCourseDefaultSec" id="viewCourseDefaultWrapper">
                    <div className="viewDefaultContainer">
                        <div className="mainAccordianDiv">
                            <div className="nano clearfix">
                                <div className="nano-content clearfix fixedTableHig">

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            */}
            </div>

        )
    }

    showWorkFlowOperations(workflow){
        let self = this;
        let prod_workflow = this.props.productionStart;
        let currentOperation = prod_workflow.operationKey;
        let getUsers = prod_workflow.course_details.all_users;
        let getControllerID = prod_workflow.formJson.actions.controllerID;
        return(
                workflow.map(function(key, index){
                let thisOperationID = workflow[index].operationKey;
                let activeClass = "";
                let getRoleID = workflow[index].roleID;
                let controllerName = "";
                let showDetail="";
                for(var newKey in getUsers){
                    if(getUsers[newKey].role_id==getRoleID){
                        if(getUsers[newKey].first_name && getUsers[newKey].last_name){
                            controllerName = getUsers[newKey].first_name + " " + getUsers[newKey].last_name;
                        }
                        else{
                            controllerName = getUsers[newKey].email;
                        }
                        break;
                    }
                }
                if(thisOperationID!=currentOperation){
                    activeClass = "inactive";
                    showDetail = <tr><td colspan="3"><EditStartProduction /></td></tr>;
                    return(
                        <tr className={activeClass}  key={index}>
                            <td>
                            <table>
                                <tbody>
                                    <tr>
                                    <td><span className="circle-icon">{parseInt(index)+1}</span></td>
                                    <td>
                                        <h5>{workflow[index].operationName}</h5>
                                        <h6>{controllerName}</h6>
                                    </td>
                                    <td><i className="icon view"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            </td>
                        </tr>
                    )
                }
                else{
                    return(
                        <tr className={activeClass}  key={index}>
                            <td>
                            <table>
                                <tbody>
                                    <tr>
                                    <td><span className="circle-icon">{parseInt(index)+1}</span></td>
                                    <td>
                                        <h5>{workflow[index].operationName}</h5>
                                        <h6>{controllerName}</h6>
                                    </td>
                                    <td><i className="icon view" onClick={self.showProductionDetails.bind(self)}></i></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="showDashboardProduction clearfix hide"><EditStartProduction /></div>
                            <div className="clearfix dashBoardProductionButtons hide">
                                {
                                    <RightActionBarProduction/>
                                }
                            </div>
                            </td>
                        </tr>
                     )
                }

                })
            )
    }

    showProductionDetails(){
        if($(".showDashboardProduction").hasClass("hide")){
           $(".showDashboardProduction").removeClass("hide");
           $(".dashBoardProductionButtons").removeClass("hide");
        }
        else{
           $(".showDashboardProduction").addClass("hide");
           $(".dashBoardProductionButtons").addClass("hide");
        }
    }

    showEditProduction(){
        let prod_workflow = this.props.productionStart;
        if(!Object.keys(prod_workflow).length){
            return true;
        }
        return <EditStartProduction />
    }

    showEditProductionBtns(){
        /*let prod_workflow = this.props.productionStart;
        let self = this;
        if(!Object.keys(prod_workflow).length){
            return true;
        }
        let getProduction = this.props.productionStart;
        let formComponents = getProduction.formJson;
        if(formComponents.actions.length==0){
          return ( <div className="flex-item right-action-bar">
                    <div id="dashboard-action-bar" className="flex-item">
                      <ul>
                      </ul>
              </div></div>);
        }
        if(formComponents.customHTML){
        return ( <div className="flex-item right-action-bar">
                    <div id="dashboard-action-bar" className="flex-item">
                      <ul>
                      <li>
                        <a href="javascript:void(0)" id={"prodbtn_0"} onClick={this.submitEditStartProductionCustom.bind(this,0)}><i className="icon publish"></i><span>{formComponents.actions.label}</span></a>
                      </li>
                      </ul>
              </div></div>);
        }
        else{
              let formActions = formComponents.actions.subactions;
              return ( <div className="flex-item right-action-bar">
                  <div id="dashboard-action-bar" className="flex-item">
                      <ul>
                 {formActions.map((key, index) => (
                  <li key={index}>
                    <a href="javascript:void(0)" onClick={this.submitEditStartProduction.bind(this,index)} key={index} id={"prodbtn_"+index}><i className="icon publish"></i><span>{formActions[index].label}</span></a>
                  </li>
              ))}
              </ul>
              </div></div>);
        }*/
    }

    closeFlyout() {
            $(".rightMenuFlyout.prod").removeClass("fly-in")
    }

    showProductionWorkflow(){
        let {currentChatDialogueDetail} = this.props;
        let prod_workflow = this.props.productionStart;
        if(!prod_workflow){
            return true;
        }
        if(!Object.keys(prod_workflow).length){
            return true;
        }
        let workflow = prod_workflow.workflow;
        if(workflow=="" || workflow==undefined){
            return true;
        }
        if (typeof workflow == 'string') {
            workflow = JSON.parse(workflow);
        }
        else{
            workflow = JSON.parse(JSON.stringify(workflow));
        }
        let prod_template = prod_workflow.production_template_name;
        return(
              <div className="panel panel-default">
                <div className="panel-heading" role="tab" id="headingOne">
                  <h4 className="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#course-view1" href="#course-workflow" aria-expanded="true" aria-controls="collapseOne">
                        <div className="course-col">
                            <span className="course-left-pane"><i className="icon-sm workflow"></i><span>Workflow ({prod_template})</span></span>
                            <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                        </div>
                    </a>
                  </h4>
                </div>
                <div id="course-workflow" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                      <div className="panel-body">
                          <div className="clearfix dashBoardProductionView">
                            <table className="workflow-list-table">
                                <tbody>
                                  {
                                    this.showWorkFlowOperations(workflow)
                                  }
                                </tbody>
                            </table>
                            </div>
                      </div>
                </div>
            </div>
            )
    }




    getChatHeader() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if(currentChatDialogueDetail.chat_view_type == 'add_new_course') {
            return this.getChatHeaderAddMode();
        }
        if(typeof courseList == 'string') {
            courseList = JSON.parse(courseList);
        }
        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);

        let admin_id;

        if(view_type == 'bycourse') {
            admin_id = currentDialogue.dialogue['created_by'];
        } else if(view_type == 'byactor') {
            admin_id = currentDialogue['dialogue_created_by'];
        } else {
            admin_id = currentDialogue['dialogue_created_by'];
        }
        if(admin_id == window.setUserID) {
            return this.getChatHeaderEditMode();
        }
        //will remove it in future when right panel manage by react
        this.props.dispatch(showAdminHeader({showAdminHeader : 0}));
        return this.getChatHeaderDisplayMode();

    }
    getTmplForAddNewDialogue() {
        let {currentChatDialogueDetail, courseList} = this.props;
        if(currentChatDialogueDetail.chat_view_type == 'add_new_dialogue') {
            if(typeof courseList == 'string') {
                courseList = JSON.parse(courseList);
            }
            let courseTitle = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].course;
            return (
                <span className="courseTitleAddView">{courseTitle}</span>
            )
        }

        return (
            <input type="text" className="form-control input-field  margin-left-two course-title-input" maxLength={COURSE_DIALOGUE_TITLE_LENGTH} id="course-title-value" placeholder="Course Title" autoFocus=""/>
        )
    }
    getChatHeaderAddMode() {

        return (
          <div className="view-course-pane">
              <div className="panel-group" id="course-dialogue-view" role="tablist" aria-multiselectable="true">
                  <div className="panel panel-default">
                      <div className="panel-heading" role="tab" id="headingOne">
                        <h4 className="panel-title">
                          <a role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-default" aria-expanded="true" aria-controls="collapseOne">
                              <div className="course-col">
                                  <span className="course-left-pane"><i className="icon-sm course-white"></i><span>Course</span></span>
                                  <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                              </div>
                          </a>
                        </h4>
                      </div>
                      <div id="course-default" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                        <div className="panel-body">
                            <div className="form-row">
                                <label className="form-label">Course Title</label>
                                <span className="form-input">{
                                    this.getTmplForAddNewDialogue()
                                }
                                </span>
                            </div>
                            <div className="form-row">
                                <label className="form-label">Admin</label>
                                <span className="form-input">
                                    <div className="user-temp">
                                        <span className="img">{profileImage ? <img src={profileImage}/> : <span className="initials-box">{initialName}</span>}</span>
                                        <span className="name">{setUsername}</span>
                                    </div>
                                </span>
                            </div>
                        </div>
                      </div>
                  </div>
                  <div className="panel panel-default">
                      <div className="panel-heading" role="tab" id="headingTwo">
                        <h4 className="panel-title">
                          <a className="collapsed" role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-dialogue" aria-expanded="false" aria-controls="collapseTwo">
                              <div className="course-col">
                                  <span className="course-left-pane"><i className="icon-sm dialogue-white"></i><span className="course-title">Dialogue</span></span>
                                  <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                              </div>
                          </a>
                        </h4>
                      </div>
                      <div id="course-dialogue" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                        <div className="panel-body">
                            <div className="form-row">
                                <label className="form-label">Dialogue Title</label>
                                <span className="form-input"><input type="text" className="form-control input-field  dialogue-title-input" id="dialogue-title-value" maxLength={COURSE_DIALOGUE_TITLE_LENGTH} placeholder="Dialogue Title" /></span>

                            </div>
                            <div className="form-row">
                                <label className="form-label">Participant(s)</label>
                                 <div className="right receivedListBox form-input">
                                    <div className="input-icon-group">
                                        <input type="hidden" id="individual_user_id" name="individual_user_id" value=""/>
                                        <input type="hidden" id="individual_user_name" name="individual_user_name" value=""/>
                                        <input type="hidden" id="individual_user_initial_name" name="individual_user_initial_name" value=""/>
                                        <input type="hidden" id="individual_user_image" name="individual_user_image" value=""/>
                                        <input type="text" id="individual_user_list" name="individual_user_list" className="form-control input-field email_info auto-suggest" placeholder="Email" data-validation-rules="empty" data-is-multiple="1" data-multiple-selector="input[name='recipient_id[]']" autoComplete="off" />
                                        <input type="hidden" id="is_new_user" name="is_new_user" value=""/>
                                        <span><i className="icon tick addCourseDialogueList"></i></span>
                                    </div>
                                    <div className="addNiceScrollWrapper clearfix"></div>
                                </div>
                                <div id="individualAutoCompleteBox" className="clearfix"><div className="autocomplete-suggestions"></div></div>
                            </div>
                        </div>
                      </div>
                  </div>

              </div>
          </div>
        )


        return (
            <span className="dialogue-container">
                <div className="control-bar new-course-control-wrap" id="newCourseControl">
                    <div className="row">
                        <div className="col-md-12 left-head">
                            <div className="block-head expand-block-head">
                                <input type="hidden" id="course-dialogue-type" value="new" name="course-dialogue-type" />
                                <div className="course-top-panel clearfix">
                                    <div className="courseBoard">Default</div>
                                    <div className="expandBlockWrap">
                                        <div className="expandInputWrap clearfix">
                                            <div className="course-title-expand clearfix">
                                                <span className="active course-action"><i className="icon-sm course-black"></i></span>
                                                {
                                                    this.getTmplForAddNewDialogue()
                                                }
                                            </div>
                                            <div className="dialogue-title-expand clearfix chat-toggle">
                                                <span className="active dialogue-action"><i className="icon dialogue-title"></i></span>
                                                <input type="text" className="form-control input-field  margin-left-two dialogue-title-input" maxLength={COURSE_DIALOGUE_TITLE_LENGTH} id="dialogue-title-value" placeholder="Dialogue Title" />
                                            </div>
                                        </div>
                                        <div className="expanArrowBox">
                                            <span className="active course-action"><i className="icon toggle-section-btn collapse-down"></i></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="courseListedUser clearfix chat-toggle">
                                    <div className="newCourseDetailed initialCourseUserWrap clearfix">
                                        <div className="left dropListBox">
                                            <div className="select-wrap">
                                                <span>Admin</span>
                                            </div>
                                        </div>
                                        <div className="user-temp">
                                            <span className="img">{profileImage ? <img src={profileImage}/> : <span className="initials-box">{initialName}</span>}</span>
                                            <span className="name">{setUsername}</span>
                                        </div>
                                        {/*<div className="right receivedListBox">
                                            <div className="receiver-label-box">
                                                <span><i className="icon admin-user"></i>{userEmail}</span>
                                            </div>
                                        </div>*/}
                                    </div>
                                    <div className="newCourseDetailed multiCourseUserWrap clearfix selectCourseRowAdd">
                                        <div className="left dropListBox">
                                            <div className="select-wrap">
                                                <select className="select-field">
                                                    <option>Participant(s)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="right receivedListBox">
                                            <div>
                                                <input type="hidden" id="individual_user_id" name="individual_user_id" value=""/>
                                                <input type="hidden" id="individual_user_name" name="individual_user_name" value=""/>
                                                <input type="hidden" id="individual_user_initial_name" name="individual_user_initial_name" value=""/>
                                                <input type="hidden" id="individual_user_image" name="individual_user_image" value=""/>
                                                <input type="text" id="individual_user_list" name="individual_user_list" className="form-control input-field email_info auto-suggest" placeholder="Email" data-validation-rules="empty" data-is-multiple="1" data-multiple-selector="input[name='recipient_id[]']" autoComplete="off" />
                                                <input type="hidden" id="is_new_user" name="is_new_user" value=""/>
                                                <span><i className="icon tick addCourseDialogueList"></i></span>
                                            </div>
                                            <div className="addNiceScrollWrapper clearfix"></div>
                                        </div>
                                        <div id="individualAutoCompleteBox" className="clearfix"><div className="autocomplete-suggestions"></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        )
    }

    getChatHeaderDisplayMode() {
        let {currentChatDialogueDetail, courseList, view_type} = this.props;
        if(typeof courseList == 'string') {
            courseList = $.parseJSON(courseList);
        }
        let currentDialogue = getCurrentDialogue(view_type, courseList, currentChatDialogueDetail);
        let courseTitle = currentDialogue.course;
        let dialogue, users;
        let created_by_index;
        if(view_type == 'bycourse') {
            dialogue = currentDialogue.dialogue;
            courseTitle = courseList[' ' + $.trim(currentChatDialogueDetail.course_node_id)].course;
            users = currentDialogue.users;
            created_by_index = 'created_by';
        } else if(view_type == 'byactor') {
            currentDialogue.dialogue_title = currentDialogue.dialogue;
            dialogue = currentDialogue;
            users = currentDialogue.users;
            created_by_index = 'dialogue_created_by';
        } else {
            currentDialogue.dialogue_title = currentDialogue.dialogue;
            dialogue = currentDialogue;
            users = currentDialogue.actors;
            created_by_index = 'dialogue_created_by';
        }
        let adminUser = '', adminProfileImage = '', adminInitialName = '';
        let dialogueCreatedBy = dialogue[created_by_index];
        if(users[dialogue[created_by_index]]) {
            adminUser = users[dialogue[created_by_index]].first_name + ' ' + users[dialogue[created_by_index]].last_name;
            adminProfileImage = users[dialogue[created_by_index]].profile_image;
            adminInitialName = ((users[dialogue[created_by_index]].first_name.charAt(0)) + (users[dialogue[created_by_index]].last_name.charAt(0))).toUpperCase();
        }
        /*let userList = [];
        Object.keys(users).map(function(key) {
            let user = users[key];
            if(key == setUserID){
                userList.push('You');
                return true;
            }
            userList.push(user.first_name + ' ' + user.last_name);
        });*/



        return(
                <div className="view-course-pane">
                  <div className="panel-group" id="course-dialogue-view" role="tablist" aria-multiselectable="true">
                    <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingOne">
                          <h4 className="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-default" aria-expanded="true" aria-controls="collapseOne">
                                <div className="course-col">
                                    <span className="course-left-pane"><i className="icon-sm course-white"></i><span>Course</span></span>
                                    <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                </div>
                            </a>
                          </h4>
                        </div>
                        <div id="course-default" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                          <div className="panel-body">
                              <div className="form-row">
                                  <label className="form-label">Course Title</label>
                                  <span className="form-input"><span className="existCourseTitle">{courseTitle}</span></span>
                              </div>
                              <div className="form-row">
                                  <label className="form-label">Admin</label>
                                  <span className="form-input">
                                      <div className="user-temp">
                                                <span className="img">{adminProfileImage ? <img src={adminProfileImage}/> : <span className="initials-box">{adminInitialName}</span>}</span>
                                                <span className="name">{adminUser}</span>
                                            </div>
                                  </span>
                              </div>
                          </div>
                        </div>
                    </div>

                    <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingTwo">
                          <h4 className="panel-title">
                            <a className="collapsed" role="button" data-toggle="collapse" data-parent="#course-dialogue-view1" href="#course-dialogue" aria-expanded="false" aria-controls="collapseTwo">
                                <div className="course-col">
                                    <span className="course-left-pane"><i className="icon-sm dialogue-white"></i><span className="course-title">Dialogue</span></span>
                                    <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                </div>
                            </a>
                          </h4>
                        </div>
                        <div id="course-dialogue" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                          <div className="panel-body">
                              <div className="form-row">
                                  <label className="form-label">Dialogue Title</label>
                                  <span className="form-input"><span className="existDialogueTitle">{dialogue.dialogue_title}</span></span>

                              </div>
                              <div className="form-row">
                                  <label className="form-label">Participant(s)</label>
                                   <div className="receivedListBox form-input">
                                      <div className="admin-info-box">
                                            <div className="addNiceScrollWrapper">
                                            {

                                                Object.keys(users).map(function(key) {
                                                    let user = users[key];
                                                    if(key == dialogueCreatedBy){
                                                        return null;
                                                    }
                                                    return (
                                                        <div className="user-temp" key={key}>
                                                            <span className="img">{user.profile_image? <img src={user.profile_image}/> : <span className="initials-box">{((user.first_name.charAt(0)) + (user.last_name.charAt(0))).toUpperCase()}</span>}</span>
                                                            <span className="name">{user.first_name + ' ' + user.last_name}</span>
                                                        </div>
                                                    )
                                                })
                                            }
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


    getChatHeaderEditMode() {
        return   <EditCourseDialogueTitle/>
    }
    hideActionButtons() {
        $("#course_action_menu").find('a').not('.user-roles').addClass('hide');
        $("#edit_chat_statement").remove();
    }
    callFunction() {
        if(typeof courseTitleTruncate == 'function') {
            courseTitleTruncate();
        }
    }
    componentDidMount() {
        this.callFunction();
        //this.defaultWorkflow();
        setTimeout(function() {
            if(typeof adjustMenudashboardChildWidth == 'function') {
                adjustMenudashboardChildWidth();
            }
        }, 100);
        setTimeout(function() {
            imitationDemoWidthHeight();
        }, 500);
        if(typeof setColumnsH == "function"){
            setColumnsH();
        }
        // close left menu flyout
        // $('.menu-flyout-close').trigger("click");
        let courseBuilderFlyout = $("#courseTemplateFlyout.leftFlyout ");
        if (courseBuilderFlyout.hasClass('in')) {
            courseBuilderFlyout.removeClass("in");
        }
        if($("#menudashboard").css('display') == 'block') {
            dashboardInitalLoad();
        }
        niceScrollDialogue();
        $(".nano").nanoScroller();
    }
    componentDidUpdate() {
        this.callFunction();
        if(typeof adjustMenudashboardChildWidth == 'function') {
            adjustMenudashboardChildWidth();
        }
        niceScrollDialogue();
    }
    componentWillReceiveProps() {
        $.post(domainUrl+'menudashboard/getAllUsers',{},ChatdialogueModule.responseIndividualParticipant,'json');
        $("#is_individual_list").val('Y');
/*        this.setState({
            workflowProduction:{}
        })  */
        newCourseDialogueDefault();
        var self = this;
        setTimeout(function(){
            self.callFunction();
            //self.defaultWorkflow();
        })
    }

getProductionSection(){
   return <AddProductionCourse />
}

getProductionAdd(){
   return <AddProduction />
}

viewProductionSection(){
   return <ViewProduction />
}

getStartProductionSection(){
   return <StartProduction />
}

getEditProductionSection(){
    return <EditStartProduction />
}





}
const mapStateToProps = (state) => {
    return {
        change_chat_view: state.changeChatView,
        currentChatDialogueDetail: state.currentChatDialogueDetail,
        courseList: state.courseList,
        productionStart: state.productionStart,
        isAddNewProduction:state.isAddNewProduction,
        view_type: state.view_type
    }
}
const ConnectedChatSection = connect(mapStateToProps)(ChatSection);
export default ConnectedChatSection;
