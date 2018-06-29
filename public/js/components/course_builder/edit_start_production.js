import React from 'react';
import {connect} from 'react-redux';
import {appendProductionStart,changeChatView,appendProductionDetail,appendProductionInstance} from '../../actions/actions';
import EditStartProductionDetail from './edit_start_production_detail';

class EditStartProduction extends React.Component {
    constructor() {
      super();
    }
    render() {
        let getProduction = this.props.productionStart;
        let course_name = getProduction.course_details.course_name;
        let prod_template = getProduction.production_template_name;
        let production_name = getProduction.course_details.production_name;
        let nanoClass = "nano detail-pane-HT";
        let nanoContentClass = "nano-content";
        let paneClass = "flex-item half-pane";
        let detailPaneClass = "detail-pane";
        let classPanelGroup = "panel-group";
        if(this.props.currentChatDialogueDetail){
          if(this.props.currentChatDialogueDetail.chat_view_type!="edit_production_template"){
            nanoClass = "full-content";
            nanoContentClass = "full-content";
            paneClass = "flex-item full-content";
            detailPaneClass = "detail-pane full-content";
            classPanelGroup = "panel-group hide";
          }
        }
        else{
            nanoClass = "full-content";
            nanoContentClass = "full-content";
            paneClass = "flex-item full-content";
            detailPaneClass = "detail-pane full-content";
            classPanelGroup = "panel-group hide";
        }

        return (
          <div className={paneClass} id="rightPane">
            <div className={detailPaneClass}>
                <div className={nanoClass}>
                <div className={nanoContentClass}>
                  <div className="view-course-pane">
                    <div className={classPanelGroup} id="production-view" role="tablist" aria-multiselectable="true">
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingTwo">
                              <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#production-view1" href="#course-notification1" aria-expanded="false" aria-controls="collapseTwo">
                                    <div className="course-col">
                                        <span className="course-left-pane"><i className="icon-sm course-white"></i><span className="course-title">Course</span></span>
                                        <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                    </div>
                                </a>
                              </h4>
                            </div>
                            <div id="course-notification1" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                              <div className="panel-body">
                                <div className="form-row">
                                  <label className="form-label">Course Title</label>
                                  <span className="form-input"><span className="existCourseTitle">{course_name}</span></span>
                                </div>
                                <div className="form-row">
                                  <label className="form-label">Course Template</label>
                                  <span className="form-input"><span className="existProdTemplate">{prod_template}</span></span>
                                </div>
                              </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingThree">
                              <h4 className="panel-title">
                                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#production-view1" href="#production-dialogue" aria-expanded="false" aria-controls="collapseThree">
                                    <div className="course-col">
                                        <span className="course-left-pane"><i className="icon-sm production-white"></i><span>Production</span></span>
                                        <span className="course-right-pane"><i className="icon-sm dot-white"></i></span>
                                    </div>
                                </a>
                              </h4>
                            </div>
                            <div id="production-dialogue" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                              <div className="panel-body">
                                <div className="form-row">
                                  <label className="form-label">Production Title</label>
                                  <span className="form-input"><span className="existCourseTitle">{production_name}</span></span>
                                </div>
                                {
                                  this.getUserHeader()
                                }
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="list-section viewCourseDefaultSec" id="viewCourseDefaultWrapper">
                      <EditStartProductionDetail/>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )
        }

getUserHeader(){
  let getProduction = this.props.productionStart;
  let getUsers = getProduction.course_details.all_users;
  return Object.keys(getUsers).map(function(key, index) {
    let first_name = getUsers[key].first_name;
    let last_name = getUsers[key].last_name;
    if(typeof last_name == 'undefined') {
        last_name = '';
    }
    let getInitials;
    if(getUsers[key].profile_image && getUsers[key].profile_image!=""){
      getInitials = "<img src='"+getUsers[key].profile_image+"'>";
    }
    else{
      getInitials = "<span class='initials-box'>"+first_name.charAt(0) + last_name.charAt(0)+"</span>";
    }


     return (<div className="form-row" key={index}>
       <label className="form-label">{getUsers[key].role_name}</label>
       <div className="user-temp"><span className="img" dangerouslySetInnerHTML={{__html: getInitials}}></span><span className="name">{first_name + " " + last_name}</span></div>
    </div>);


  });
}

addProductionButtons(){
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    if(formComponents.actions.length==0){
      return true;
    }

    if(formComponents.customHTML){
        return (<div>
            <button id={"prodbtn_0"} onClick={this.submitEditStartProductionCustom.bind(this,0)} style={{display:'none'}}>{formComponents.actions.label}</button>
        </div>);
    }
    else{
        let formActions = formComponents.actions.subactions;
        return (<div>
        {formActions.map((key, index) => (
            <button key={index} id={"prodbtn_"+index} onClick={this.submitEditStartProduction.bind(this,index)} style={{display:'none'}}>{formActions[index].label}</button>
        ))}
        </div>);
    }
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
    }
}
const ConnectedEditStartProduction = connect(mapStateToProps)(EditStartProduction);
export default ConnectedEditStartProduction;
