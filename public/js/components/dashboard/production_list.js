import React from 'react';
import {connect} from 'react-redux';
import {adNewProduction,changeChatView,appendProductionList,appendProductionDetail,appendProductionStart,appendProductionInstance} from '../../actions/actions';
import AddProductionCourse from '../course_builder/new_production';
import AddProduction from '../course_builder/add_production';
import {getCount,highlightSearch} from '../functions/common_functions';
import NoRecordFound from '../no_record_found';

class ProductionList extends React.Component {
    render() {
        let course = this.props.course;
        let getCourseList = this.props.courseList;
        if(typeof getCourseList=="string"){
            getCourseList = JSON.parse(this.props.courseList);
        }
        let whichCourse = getCourseList[' '+$.trim(course.course_node_id)];
        let displayClass = 'collapsedCourseBox clearfix';
        return (
            <li className="production_list_wrapper production" data-production-course-id={course.course_node_id} onClick={this.loadProductions.bind(this,whichCourse)}>
                <div className="toggleCourseWrapper">
                    {/*<div className="toggle-courses active"><i className="fa fa-angle-up collapse-up"></i></div>*/}
                    <a className="ref-course-list">
                        <div className="left inline-left-pane">
                            <i className="icon production"></i>
                            <h6 dangerouslySetInnerHTML={{__html: 'Productions' + getCount(this.props.productionCount,'count-list',1)}}></h6>
                        </div>
                    </a>
                </div>

                <div><i className="icon plus-class inactive hide"></i></div>
                <div className="clearfix">
                <div className={displayClass}>
                    <ul className="clearfix productionListing" ref="productionsList">
                        {
                            this.getProductionList(whichCourse)
                        }
                    </ul>
                </div>
                </div>
            </li>
        )
    }

    addProduction(event,course) {
        let courseID = course.course_node_id;
        let {courseList}=this.props;
        if(typeof courseList == 'string')  {
            courseList = JSON.parse(courseList);
        }
        event.stopPropagation();
        let currentChatDialogue = {
            change_chat_view: 1,
            currentChatDialogueDetail: {
                chat_view_type: "add_production"
            }
        };
        $(".main_production_list").removeClass("current");
        $(".production_list.sub").removeClass("current");
        this.props.dispatch(adNewProduction({courseID:courseID}));
        this.props.dispatch(changeChatView(currentChatDialogue));
        if(courseList[' ' + $.trim(course.course_node_id)].production && Object.keys(courseList[' ' + $.trim(course.course_node_id)].production).length){
          $(event.target).closest("li").find(".collapsedCourseBox").addClass("expandedCourseBox");
          $(event.target).closest("li").find(".toggleCourseWrapper .toggle-courses .fa").removeClass("fa-angle-up").addClass("fa-angle-down");
          $("#untitledProd").remove();
          $("[data-production-course-id='"+courseID+"'] .productionListing").prepend("<li class='production_list main_production_list current' id='untitledProd'><div class='subCollapsedCourseBox'><div class='productionTitle clearfix'><i class='icon left sm-dialogue'></i><span>Untitled</span></div></div></li>");
          return true;
        }
            $.ajax({
                url: domainUrl+'board/productionList',
                type: 'POST',
                data:{course_instance_id:course.course_instance_id,userID: window.setUserID,status:course.status},
                success: function(response) {
                  $("#untitledProd").remove();
                  self.props.dispatch(appendProductionList({course_node_id:course.course_node_id,response:response}));
                  $(event.target).closest("li").find(".collapsedCourseBox").addClass("expandedCourseBox");
                  $(event.target).closest("li").find(".toggleCourseWrapper .toggle-courses .fa").removeClass("fa-angle-up").addClass("fa-angle-down");
                  $("[data-production-course-id='"+courseID+"'] .productionListing").prepend("<li class='production_list main_production_list current' id='untitledProd'><div class='subCollapsedCourseBox'><div class='productionTitle clearfix'><i class='icon left sm-dialogue'></i><span>Untitled</span></div></div></li>");
                }
            });
        }

    loadProductions(course){
        if(this.props.user_type == 'guest') {
            window.location.hash = '#register';
            return true;
        }
        var self = this;
        $("#untitledProd").remove();
        let {courseList}=this.props;
        if(typeof courseList == 'string')  {
            courseList = JSON.parse(courseList);
        }
        let currentDialogueDomElement = $("#menudashboard").find('li[data-production-course-id="'+course.course_node_id+'"]');
        let dialogueWrapper = currentDialogueDomElement.find('.collapsedCourseBox');
        let arrowBtn = currentDialogueDomElement.find('.toggleCourseWrapper:first').find('.collapse-up');
        if(dialogueWrapper.hasClass('expandedCourseBox')) {
            arrowBtn.addClass('fa-angle-up').removeClass('fa-angle-down');
            dialogueWrapper.removeClass('expandedCourseBox');
            } else {
                arrowBtn.addClass('fa-angle-down').removeClass('fa-angle-up');
                dialogueWrapper.addClass('expandedCourseBox');
         }

        if(courseList[' ' + $.trim(course.course_node_id)].production && Object.keys(courseList[' ' + $.trim(course.course_node_id)].production).length){
            return true;
        }

       $.ajax({
              url: domainUrl+'board/productionList',
              type: 'POST',
              data:{course_instance_id:course.course_instance_id,userID: window.setUserID,status:course.status},
              success: function(response) {
                if(Object.keys(JSON.parse(response)).length == 0 && JSON.parse(response).constructor == Object){
                  response = {};
                  response.message = "No records found.";
                  response = JSON.stringify(response);
                }
                self.props.dispatch(appendProductionList({course_node_id:course.course_node_id,response:response}));
              }
          });
      }

    getProductionList(course){
        var self = this;
        let productions = course.production;
        if(!productions) {
            return null;
        }
        if(productions.message){
           return (
               <li>
                    <NoRecordFound msg={productions.message}/>
               </li>
            )
        }
        return Object.keys(productions).map(function(key, index) {
            let production = productions[key];
            let users = productions[key].users;
            let ifController = productions[key].is_primary_controller;
            let userNames = Object.keys(users).map(function(id) {
                    let user = users[id];
                    return user.first_name +' '+ user.last_name;
                }).join(', ');
            let addButton = null;
            if(production.status=="D" || ifController != window.setUserID){
                addButton = <div className='add-production'  data-id={production.production_node_id}><i className='icon plus-class inactive'></i></div>;
            }
            else{
                addButton = <div className='add-production'   data-id={production.production_node_id} onClick={event => {self.loadProductionDetail.call(self,event,course.course_instance_id,production.production_node_id,production.status,course,'add')}}><i className='icon plus-class rollover'></i></div>;
            }
            let putHref = "#"+production.production_node_id;
            return(
                    <li className="production_list main_production_list" key={key} data-id={production.production_node_id}>
                        <div className="subCollapsedCourseBox collapsed productionlistTitle" data-id={production.production_node_id} onClick={event => {self.loadProductionDetail.call(self,event,course.course_instance_id,production.production_node_id,production.status,course,"productionInstances")}}>
                            <div className="productionTitle clearfix"><i className="icon left sm-dialogue"></i><span>{production.production_name}</span></div>
                        </div>
                    </li>
                )
        });
    }

    getProductionListInstances(courseID,productionID,status,course){
     var self = this;
     let productionsInstances=this.props.productionInstance;
      if(!productionsInstances) {
            return null;
      }
      productionsInstances = productionsInstances[productionID];
      if(!productionsInstances) {
            return null;
      }
      return Object.keys(productionsInstances).map(function(key, index) {
        return(
                 <li className="production_list sub" key={key} id={productionsInstances[key]}>
                    <div className="subCollapsedCourseBox" onClick={event => {self.loadProductionDetail.call(self,event,courseID,productionID,status,course,"productionInstances")}}>
                       <div className="productionTitle clearfix"><i className="icon left sm-dialogue"></i><span>{productionsInstances[key]}</span></div>
                    </div>
                 </li>
            )
        });
    }

    loadProductionDetail(event,courseID,productionID,status,course,mode,productionInstanceID){
        event.stopPropagation();
        if(this.props.user_type == 'guest') {
            //window.location.hash = '#register';
            //return true;
        }
        var self = this;
        NProgress.start({position: 'middle'});
        // debugger;
        let listContainer = $("#menudashboard").find('.course-list-panel');
        let currentElement = listContainer.find('li[data-id="'+productionID+'"]');
        $('.dialogue_list.current').removeClass('current');
        currentElement.closest('li').removeClass('current');
        $(".main_production_list").removeClass("current");
        currentElement.addClass('current');
        let arrowBtn = currentElement.find('.toggle-courses .fa');
        let currentChatDialogue = {
            change_chat_view: 1,
            currentChatDialogueDetail: {
                chat_view_type: "view_production_template",
                expand_course_node_id: course.course_node_id
            }
        };

        if(mode=="view"){
          if(!newProductionInstance){
            if(currentElement.find('.toggle-courses .fa').hasClass("fa-angle-down")){
                currentElement.find('.toggle-courses .fa').removeClass("fa-angle-down").addClass("fa-angle-up");
                $("#"+productionID).show();
                autoProductionClickCheck = false;
            }
            else{
                if(!autoProductionClickCheck){
                  $("#untitledProd").remove();
                  $(".production_list.sub").removeClass("current");
                  currentElement.find('.toggle-courses .fa').removeClass("fa-angle-up").addClass("fa-angle-down");
                  $("#"+productionID).hide();
                }
                else{
                  $("#"+productionID).show();
                }
                autoProductionClickCheck = false;
            }

            if(!productionInstanceID){
                    productionInstanceID = null;
                  }
                else{
                  if(!newProductionInstance){
                    $(".production_list.sub").removeClass("current");
                  }
                  $("#"+productionInstanceID).addClass("current");
             }
          }

             $.ajax({
                  url: domainUrl+'board/editCourse',
                  type: 'POST',
                  data:{course_instance_id:courseID,production_node_id:productionID,status:status,userID: window.setUserID},
                  success: function(response) {
                      self.props.dispatch(appendProductionDetail({course_node_id:course.course_node_id,response:response}));
                      if(!newProductionInstance){
                        self.props.dispatch(changeChatView(currentChatDialogue));
                      }
                      self.props.dispatch(appendProductionInstance({productionID:productionID,response:JSON.parse(response).productionDataList}));
                      $("#untitledProd").remove();
                      if(newProductionInstance==true){
                         newProductionInstance = false;
                         autoProductionClickCheck = false;
                         setTimeout(function(){
                          $("#"+productionID + " li:first").addClass("current");
                           $("#"+productionID + " li:first .subCollapsedCourseBox").trigger("click");
                        });
                      }
                      NProgress.done();
                  }
              });
        }
        else{
                 // currentChatDialogue.currentChatDialogueDetail.chat_view_type = "loading_data";
                 // / self.props.dispatch(changeChatView(currentChatDialogue));
                 if(mode=="productionInstances"){
                  $("#untitledProd").remove();
                  $(".production_list.sub").removeClass("current");
                  $("#"+productionInstanceID).addClass("current");
                  currentChatDialogue.currentChatDialogueDetail.chat_view_type = "edit_production_template";
                  $.ajax({
                        url: domainUrl+'board/getProductionTemplate',
                        type: 'POST',
                        data:{course_instance_id:courseID,production_node_id:productionID,status:status,userID: window.setUserID},
                        success: function(response) {
                          if(status=="P"){
                            self.props.dispatch(appendProductionStart({response:response}));
                            self.props.dispatch(changeChatView(currentChatDialogue));
                          }
                          else{
                            currentChatDialogue.currentChatDialogueDetail.chat_view_type = "view_production_template";
                            self.props.dispatch(appendProductionDetail({course_node_id:course.course_node_id,response:response}));
                            self.props.dispatch(changeChatView(currentChatDialogue));
                            self.props.dispatch(appendProductionInstance({productionID:productionID,response:JSON.parse(response).productionDataList}));
                          }
                          NProgress.done();
                        }
                    });
                 }
                 else if($("#"+productionID + " li").length>0){
                  $(".production_list.sub").removeClass("current");
                  $("#"+productionInstanceID).addClass("current");

                  if(productionInstanceID!=null){
                       currentChatDialogue.currentChatDialogueDetail.chat_view_type = "edit_production_template";
                    }
                  else{
                       currentChatDialogue.currentChatDialogueDetail.chat_view_type = "start_production_template";
                       currentElement.find('.toggle-courses .fa').removeClass("fa-angle-down").addClass("fa-angle-up");
                       $("#"+productionID).show();
                       $("#untitledProd").remove();
                       $("#"+productionID).prepend("<li class='production_list sub current' id='untitledProd'><div class='subCollapsedCourseBox'><div class='productionTitle clearfix'><i class='icon left sm-dialogue'></i><span>Untitled</span></div></div></li>");
                   }
                  $.ajax({
                        url: domainUrl+'board/getProductionTemplate',
                        type: 'POST',
                        data:{course_instance_id:courseID,production_node_id:productionID,status:status,userID: window.setUserID,production_data_node_id:productionInstanceID},
                        success: function(response) {
                            if(status=="P"){
                              self.props.dispatch(appendProductionStart({response:response}));
                              self.props.dispatch(changeChatView(currentChatDialogue));
                            }
                            NProgress.done();
                        }
                    });

                 }
                 else{
                  $.ajax({
                  url: domainUrl+'board/editCourse',
                  type: 'POST',
                  data:{course_instance_id:courseID,production_node_id:productionID,status:status,userID: window.setUserID},
                  success: function(response) {
                  if(!productionInstanceID){
                      productionInstanceID = null;
                    }
                  $(".production_list.sub").removeClass("current");
                  $("#"+productionInstanceID).addClass("current");
                      //self.props.dispatch(appendProductionDetail({course_node_id:course.course_node_id,response:response}));
                      //self.props.dispatch(changeChatView(currentChatDialogue));
                      if(mode=="add" && currentElement.find('.toggle-courses .fa').hasClass("fa-angle-down")){
                        //self.props.dispatch(appendProductionDetail({course_node_id:course.course_node_id,response:response}));
                        self.props.dispatch(appendProductionInstance({productionID:productionID,response:JSON.parse(response).productionDataList}));
                      }
                      $("#untitledProd").remove();
                      if(productionInstanceID!=null){
                           currentChatDialogue.currentChatDialogueDetail.chat_view_type = "edit_production_template";
                        }
                      else{
                           currentChatDialogue.currentChatDialogueDetail.chat_view_type = "start_production_template";
                           currentElement.find('.toggle-courses .fa').removeClass("fa-angle-down").addClass("fa-angle-up");
                           $("#"+productionID).show();
                           $("#untitledProd").remove();
                           $("#"+productionID).prepend("<li class='production_list sub current' id='untitledProd'><div class='subCollapsedCourseBox'><div class='productionTitle clearfix'><i class='icon left sm-dialogue'></i><span>Untitled</span></div></div></li>");
                       }

                      $.ajax({
                            url: domainUrl+'board/getProductionTemplate',
                            type: 'POST',
                            data:{course_instance_id:courseID,production_node_id:productionID,status:status,userID: window.setUserID,production_data_node_id:productionInstanceID},
                            success: function(response) {
                              if(status=="P"){
                                self.props.dispatch(appendProductionStart({response:response}));
                                self.props.dispatch(changeChatView(currentChatDialogue));
                              }
                              NProgress.done();
                            }
                       });
                  }
              });
          }
        }
    }
    componentDidUpdate(){
        this.highlightSearch();
    }
    componentDidMount(){
        this.highlightSearch();
    }
    highlightSearch(){
        if (this.props.searchString != '') {
            highlightSearch($(this.refs.actorsList), this.props.searchString)
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
        productionInstance:state.productionInstance,
        user_type: state.user_type
    }
}
const ConnectedProductionList = connect(mapStateToProps)(ProductionList);
export default ConnectedProductionList;
