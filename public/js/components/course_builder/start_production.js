import React from 'react';
import {connect} from 'react-redux';
import {appendProductionStart,changeChatView} from '../../actions/actions';

class StartProduction extends React.Component {
    constructor() {
      super();
      this.state={
        courseClassStructure:{},
        tempArray:[]
      };
    }
    render() {
        let getProduction = this.props.productionStart;
        let formComponents = getProduction.formJson;
        return (
            <div className="display-wrapper dashSlider clearfix set-height active courseViewData">
                <div className="control-bar view-course-control-bar" id="viewCourseControlBar">
                    <div className="row">
                        <div className="col-md-12 left-head">
                            <div className="block-head view-block-head">
                                <div className="course-top-panel">
                                    <div className="viewCourseTitleHeadline">Production</div>
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
                                        {
                                            this.getProductionFields()
                                        }
                                    </div>
                                    <div>
                                    {
                                        this.addProductionButtons()
                                    }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


rebuildNodes(data){

  for(var x=0;x<data.length;x++){
        this.state.tempArray.push({level:data[x].level,inputValue:data[x].inputValue,value:data[x].value, nodeID:data[x].nodeID,label:data[x].label,parentID:data[x].parentID,nodeSequence:data[x].nodeSequence,inputType:data[x].inputType,inputOptions:data[x].inputOptions,dataType:data[x].dataType,roles:data[x].roles});
        if(data[x].nodes!=undefined){
            this.rebuildNodes(data[x].nodes);
        }
    }
    this.setState({
        courseClassStructure:this.state.tempArray
    });
}

submitStartProduction(source,productionID){
    let getProduction = this.props.productionStart;
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

    var dataToSend = {class_id:getProduction.formJson.dataClass,production_details_node_id:getProduction.production_details_node_id,operationKey:getProduction.operationKey,target:source,targetProduction:productionID,nodes:holdElements};

  let currentChatDialogue = {
      change_chat_view: 1,
      currentChatDialogueDetail: {
          chat_view_type: "saving_data"
      }
  };
  self.props.dispatch(changeChatView(currentChatDialogue));
    $.ajax({
          url: domainUrl+'board/saveProductionTemplate',
          type: 'POST',
          data: dataToSend,
          success: function(response) {
            let currentChatDialogue = {
                change_chat_view: 1,
                currentChatDialogueDetail: {
                    chat_view_type: "view_production_template"
                }
            };
            //self.props.dispatch(changeChatView(currentChatDialogue));
            autoProductionClickCheck = true;
            newProductionInstance = true;
            $(".main_production_list.current .productionlistTitle").trigger("click");
            var msg = {type:'updateProductionList',production_node_id:getProduction.production_details_node_id,userID: window.setUserID};
            socket.send(JSON.stringify(msg));
          }
      });
}

addProductionButtons(){
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    if(formComponents.actions.length==0){
      return true;
    }
    let formActions = formComponents.actions.subactions;
    return (<div>
    {formActions.map((key, index) => (
        <button key={index} id={formActions[index].conditions[0].dataSource} onClick={this.submitStartProduction.bind(this,formActions[index].conditions[0].dataSource,formActions[index].conditions[0].dataProduction)} style={{display:'none'}}>{formActions[index].label}</button>
    ))}
    </div>);

}


getProductionFields(){
    var self = this;
    let getProduction = this.props.productionStart;
    let getRoleID = getProduction.production_details_user.role_id;
    return Object.keys(this.state.courseClassStructure).map(function(key, index) {
          let label = self.state.courseClassStructure[key].value;
          let nodeID = self.state.courseClassStructure[key].nodeID;
          let inputType = self.state.courseClassStructure[key].inputType;
          let inputValue = self.state.courseClassStructure[key].inputValue;
          if(inputValue==undefined){
            inputValue = "";
          }
          var getRolePermisson =  self.state.courseClassStructure[key].roles;
          var getViewRights = false;
          var getEditRights = false;
          var readonly = false;
          for(var x=0; x<getRolePermisson.length;x++){
            if(getRolePermisson[x].roleID==getRoleID){
              getViewRights = getRolePermisson[x].view;
              getEditRights = getRolePermisson[x].edit;
            }
          }

          if(!getEditRights){
            readonly = true;
          }

          if(inputType=="Input" && getViewRights){
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>
                  </div>
                  <div className="list-col">
                      <input type="text" data-id={nodeID} className="form-control input-field productionElm" disabled={readonly}/>
                  </div>
                </div>
              )
         }
         else if(inputType=="Text Area" && getViewRights){
            return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>
                  </div>
                  <div className="list-col">
                      <textarea data-id={nodeID} className="form-control productionElm textarea-field" disabled={readonly}></textarea>
                  </div>
                </div>
            )
         }
         else if(inputType=="Instruction" && getViewRights){
            return(
                 <div className="prod-list-row" key={index}>
                  <div>
                      <span>{label}</span>
                  </div>
                </div>
            )
         }
         else if(inputType=="Check Box" && getViewRights){
            var getOptions = self.state.courseClassStructure[key].inputOptions;
            var getOptionsValue = inputValue.split("~#~");
            var getNewOptions = [];
              for(var x=0;x<getOptions.length;x++){
                if(getOptionsValue.indexOf(getOptions[x])!=-1){
                  getNewOptions.push({value:getOptions[x],checked:true});
                }
                else{
                  getNewOptions.push({value:getOptions[x],checked:false});
                }
              }
              if(getOptions!=null){
                return(
                     <div className="prod-list-row" key={index}>
                      <div className="list-col">
                          <span>{label}</span>
                      </div>
                      <div className="list-col">
                       <div>
                       {
                         Object.keys(getNewOptions).map(function(key, index) {
                          return(
                                  <div className="checkbox" key={index}>
                                  <input data-id={nodeID} value={getNewOptions[index].value} className="productionCheckboxElm" type="checkbox" disabled={readonly}/>
                                  {getNewOptions[index].value}
                                  </div>
                            )
                        })
                      }
                       </div>
                      </div>
                    </div>
                )
            }
         }
         else if(inputType=="Drop Down" && getViewRights){
            var getOptions = self.state.courseClassStructure[key].inputOptions;
            if(getOptions!=null){
              return(
                   <div className="prod-list-row" key={index}>
                    <div className="list-col">
                        <span>{label}</span>
                    </div>
                    <div className="list-col">
                     <div>
                      <select className="form-control productionElm select-field" data-id={nodeID} disabled={readonly}>
                          <option value="">Select</option>
                          {getOptions.map((key, index) => (
                              <option key={index}>{getOptions[index]}</option>
                          ))}
                       </select>
                     </div>
                    </div>
                  </div>
              )
          }
         }
         else if(inputType=="Radio" && getViewRights){
            var getOptions = self.state.courseClassStructure[key].inputOptions;
            var getOptionsValue = inputValue;
            if(getOptions!=null){
                return(
                   <div className="prod-list-row" key={index}>
                    <div className="list-col">
                        <span>{label}</span>
                    </div>
                    <div className="list-col">
                     <div>
                       {
                        getOptions.map((key, index) => (
                              <div className="radio" key={index}>
                              <input type="radio" value={getOptions[index]} data-id={nodeID} name={nodeID} className="productionRadioElm" disabled={readonly}/>
                              {getOptions[index]}
                              </div>
                          ))
                      }
                     </div>
                    </div>
                  </div>
              )
            }
         }
         else if(inputType=="Calendar" && getViewRights){
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>
                  </div>
                  <div className="list-col">
                      <input type="text" data-id={nodeID} className="form-control input-field productionElm datepicker" readOnly="true" disabled={readonly}/>
                  </div>
                </div>
              )
         }
         else if(inputType=="File" && getViewRights){
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>
                  </div>
                  <div className="list-col">
                      <input type="file" data-id={nodeID} className="form-control input-field productionElm" disabled={readonly}/>
                  </div>
                </div>
              )
         }
         else if(inputType=="Grouping.Properties"){
          return(
                 <div className="prod-list-row" key={index}>
                  <h6>{label}</h6>
                </div>
              )
         }
      });
}

componentDidMount() {
    $("#react-button-cancel-add-new-course").remove();
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    $("#course_action_menu .productionRHSButtons").remove();
    $("#course_action_menu a").addClass("hide");
    this.rebuildNodes(formComponents.nodes);
    let formActions = formComponents.actions.subactions;
    if(formComponents.actions.length!=0){
      for(var x=0;x<formActions.length;x++){
          $("#course_action_menu").append("<a href='javascript:void(0)' data-action='"+formActions[x].conditions[0].dataSource+"' class='productionRHSButtons'><i class='icon publish'></i><br><span>"+formActions[x].label+"</span></a>");
      }
    }
    setTimeout(function(){
      $(".prod-list-row .list-col input:file").filestyle();
    });
}

componentDidUpdate(){
  setTimeout(function(){
      $(".prod-list-row .list-col input:file").filestyle();
  });
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
const ConnectedStartProduction = connect(mapStateToProps)(StartProduction);
export default ConnectedStartProduction;
