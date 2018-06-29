import React from 'react';
import {connect} from 'react-redux';

class EditStartProductionDetail extends React.Component {
    constructor() {
      super();
      this.state={
        tempArray:{},
        production:{},
        stage:0
      };      
    }
    render() {
          let getProduction = this.props.productionStart;
          let formComponents = getProduction.formJson;
          let productionName = $.trim($(".main_production_list.current .productionlistTitle").text());
          let currentProductionVariables = getProduction.formJson.variables;
          let getPermissionStatus = getProduction.permission;
          let canCurrentUserSee = "";
          if(this.state.stage==0){
            this.rebuildNodes(formComponents.nodes,"first");
          }

          if(formComponents.customHTML && getPermissionStatus!=""){
            let customHTML = formComponents.customHTML;
            return(  
                  <div>        
                    {canCurrentUserSee}
                    <div dangerouslySetInnerHTML={{__html: customHTML}}></div>    
                  </div>    
                  )
          }  


          if(getPermissionStatus==""){
            canCurrentUserSee = <div className='prod-list-row' style={{color:'#ff0000'}}>You do not have rights to see this production at this stage.</div>;
          }
    return(  
      <div>        
        {canCurrentUserSee}
        <div>
          {
            this.getProductionFields()
          }
          {
            this.showVariables()
          }
        </div>    
      </div>    
      )
    }

showVariables(currentProductionVariables){
  let getNewProduction = this.props.productionStart;
  if(getNewProduction.permission!=""){  
    let currentNewProductionVariables = getNewProduction.formJson.variables;
    if(currentNewProductionVariables==null || !currentNewProductionVariables){
      currentNewProductionVariables = {};
    }
    return Object.keys(currentNewProductionVariables).map(function(key, index) {
      if(!currentNewProductionVariables[index]['hidden']){      
        delete currentNewProductionVariables[index]['hidden'];
        let getKeys = Object.keys(currentNewProductionVariables[index]);
         return (<div key={index}>
          {getKeys.map((arrkey, arrindex) => (
            <div key={arrindex} className="prod-list-row">
              <div className="list-col">
                  <span>{getKeys[arrindex]}</span>                                          
              </div>
              <div className="list-col">
                  {currentNewProductionVariables[index][arrkey]}
              </div>
            </div>
          ))}
        </div>);
       }
    }); 
  }
}    


rebuildNodes(data,turn){
  var self = this;
  let getProduction;
  let getProductionID;
  this.state.stage=1;
 if(this.state.whichProduction){
    getProductionID = this.state.whichProduction;  
  }
  else{
    getProduction = this.props.productionStart;   
    getProductionID = getProduction.production_data_node_id;
    this.state.whichProduction = getProductionID;
    this.state.getRole = getProduction.production_details_user.role_id;
  }
  if(!this.state.tempArray[getProductionID] || turn=='first'){
    this.state.tempArray[getProductionID] = [];    
  }
  if(data){
   for(var x=0;x<data.length;x++){
        this.state.tempArray[getProductionID].push({level:data[x].level,inputValue:data[x].inputValue,value:data[x].value, nodeID:data[x].nodeID,label:data[x].label,parentID:data[x].parentID,nodeSequence:data[x].nodeSequence,inputType:data[x].inputType,inputOptions:data[x].inputOptions,dataType:data[x].dataType,roles:data[x].roles});        
        if(data[x].nodes!=undefined){
            this.rebuildNodes(data[x].nodes);                      
        }
    }    
  }
}

changeValue(index,event,inputType){    
  var getValue = $(event.target).val(); 
  var arrayTemp = this.state.tempArray; 
  if(inputType=="checkbox"){
    if(arrayTemp[this.state.whichProduction][index].inputValue!=undefined){
      var getPrevValue = arrayTemp[this.state.whichProduction][index].inputValue.split("~#~");
    }
    else{
      var getPrevValue = [];
    }
    var getIndex = getPrevValue.indexOf(getValue);
   // console.log(getIndex);
    if(getIndex>-1){      
     getPrevValue.splice(getIndex,1);
    }
    else{
      getPrevValue.push(getValue);
    }    
   // console.log(getPrevValue);
    var tempVar="";
    for(var x=0;x<getPrevValue.length;x++){
        if(x==getPrevValue.length-1){
          tempVar = tempVar+getPrevValue[x];
        }
        else{
          tempVar = tempVar+getPrevValue[x]+"~#~";
        }
    }
    getValue = tempVar;
  }
  arrayTemp[this.state.whichProduction][index].inputValue = getValue;
  this.setState({
   tempArray: arrayTemp
  });
}


getProductionFields(){
    var self = this;
    let courseClassStructure = {};
    courseClassStructure = this.state.tempArray[this.state.whichProduction]; 
    if(!courseClassStructure){      
      return null;
    }
    return Object.keys(courseClassStructure).map(function(key, index) {
          let label = courseClassStructure[key].value;
          let nodeID = courseClassStructure[key].nodeID;
          let inputType = courseClassStructure[key].inputType;
          let inputValue = courseClassStructure[key].inputValue;   
          if(inputValue==undefined){
            inputValue = "";
          }
          var getRolePermisson =  courseClassStructure[key].roles;
          var getViewRights = false;
          var getEditRights = false;
          var readonly = false;          
          for(var x=0; x<getRolePermisson.length;x++){
            if(getRolePermisson[x].roleID==self.state.getRole){
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
                      <input type="text" data-id={nodeID} value={inputValue} onChange={event => self.changeValue.call(self,index,event)} className="form-control input-field productionElm" disabled={readonly}/>
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
                      <textarea rows="4" data-id={nodeID} className="form-control productionElm textarea-field" disabled={readonly} value={inputValue} onChange={event => self.changeValue.call(self,index,event)}></textarea>
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
            var getOptions = courseClassStructure[key].inputOptions;
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
                         Object.keys(getNewOptions).map(function(key, myIndex) {
                          return(
                                  <div className="checkbox" key={myIndex}>
                                  <input data-id={nodeID} value={getNewOptions[myIndex].value} onChange={event => self.changeValue.call(self,index,event,'checkbox')} className="productionCheckboxElm" type="checkbox" checked={getNewOptions[myIndex].checked} disabled={readonly}/> 
                                  {getNewOptions[myIndex].value}
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
            var getOptions = courseClassStructure[key].inputOptions;
            if(getOptions!=null){
              return(
                   <div className="prod-list-row" key={index}>
                    <div className="list-col">
                        <span>{label}</span>                                                
                    </div>
                    <div className="list-col">
                     <div>
                      <select className="form-control productionElm select-field" data-id={nodeID} disabled={readonly} value={inputValue} onChange={event => self.changeValue.call(self,index,event)}>
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
            var getOptions = courseClassStructure[key].inputOptions;
            var getOptionsValue = inputValue;
            var getNewOptions = [];
            if(getOptions!=null){
              for(var x=0;x<getOptions.length;x++){
                if(getOptionsValue.indexOf(getOptions[x])!=-1){
                  getNewOptions.push({value:getOptions[x],checked:true});    
                }
                else{
                  getNewOptions.push({value:getOptions[x],checked:false});    
                }
              }              
                return(
                   <div className="prod-list-row" key={index}>
                    <div className="list-col">
                        <span>{label}</span>                                                
                    </div>
                    <div className="list-col">
                     <div>
                       {
                        getOptions.map((key, myIndex) => (
                              <div className="radio" key={myIndex}>
                              <input type="radio" value={getOptions[myIndex]} onChange={event => self.changeValue.call(self,index,event)} data-id={nodeID} name={nodeID} className="productionRadioElm" checked={getNewOptions[myIndex].checked} disabled={readonly}/> 
                              {getOptions[myIndex]}
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
                      <input type="text" data-id={nodeID} data-index={index} className="form-control input-field productionElm datepicker" value={inputValue} disabled={readonly} onChange={event => self.changeValue.call(self,index,event)} readOnly="true"/>
                  </div>
                </div>
              )
         }
         else if(inputType=="File" && getViewRights && inputValue==""){
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>                                                
                  </div>
                  <div className="list-col">
                      <input type="file" data-upload-id={nodeID} className="form-control productionElm" disabled={readonly} onChange={event => self.uploadFile.call(self,nodeID,index)}/>      
                      <input type="hidden" data-id={nodeID} className="form-control productionElm"/>
                  </div>
                </div>
              )
         }
         else if(inputType=="File" && getViewRights){
          var fileName = inputValue.split("/");
          fileName = fileName[fileName.length-1];
          var showButton;
          if(readonly){
            showButton = "none";
          }
          else{
            showButton = "inline-block";
          }
          return(
                 <div className="prod-list-row" key={index}>
                  <div className="list-col">
                      <span>{label}</span>                                                
                  </div>
                  <div className="list-col">
                      <a href={inputValue} target='_blank' className="cbFileName">{fileName}</a> <br/> <button onClick={event => self.removeFile.call(self,nodeID,index)} disabled={readonly} style={{display:showButton}}> Remove Attachment </button>
                      <input type="hidden" value={inputValue} data-id={nodeID} className="form-control productionElm"/>         
                  </div>
                </div>
              )
         }
         else if(inputType=="Grouping.Properties"  && getViewRights){
          return(
                 <div className="prod-list-row" key={index}>
                  <h6>{label}</h6>
                </div>
              )
         }
      });
}

uploadFile(nodeID,index){
  var arrayTemp = this.state.tempArray;
  var getThis = this;
  var formData = new FormData();
  var getFiles = $('[data-upload-id="'+nodeID+'"]')[0].files[0];
  formData.append('file', getFiles);
  formData.append("apiname","iconupload");
  jQuery.ajax({
        type: 'POST',
        url : domainUrl+"api/",
        data: formData,
        dataType: 'json',
        async: true,
        enctype: 'multipart/form-data',
        cache: false,
        contentType: false,
        processData: false,
        success:function(data){
          $('[data-id="'+nodeID+'"]').val(data.data);
          arrayTemp[getThis.state.whichProduction][index].inputValue = data.data;
          getThis.setState({
           tempArray: arrayTemp
          });
        },
        error: function(data) {
          alert("An error occured while uploading file");
        }
    });
}

removeFile(nodeID,index){
    var getThis = this;
    bootbox.confirm("Are you sure you want to remove this attachment?",function(result){
      if(result){
           var arrayTemp = getThis.state.tempArray;
           $('[data-id="'+nodeID+'"]').val("");
           arrayTemp[getThis.state.whichProduction][index].inputValue = "";
           getThis.setState({
             tempArray: arrayTemp
            });
      }
    });
}

setupCBScript(){
  $("#cbScript").remove(); 
  var newScript = document.createElement("script");
  var getScriptContainer = $("#viewCourseDefaultWrapper");
  let getProduction = this.props.productionStart;
  let formComponents = getProduction.formJson; 
  var allClear = true; 
  $("#viewCourseDefaultWrapper").append("<div id='cbScript'></div>"); 
  $.ajax({
          url: domainUrl+'api/validation',
          success: function(response) {
            var jsonData = response.data;
            if(jsonData.constructor!==Array){
              for(var key in jsonData){
                if(jsonData[key]){
                  newScript.innerHTML = newScript.innerHTML + jsonData[key].Code;
                }
              }
            }
            if(formComponents.script){
              var getValidationValue = formComponents.script;
              newScript.innerHTML = newScript.innerHTML + "function validateCB(){allClear = true;$('.cberror').remove();"+getValidationValue+" return allClear}";
            }
            else{
              newScript.innerHTML = newScript.innerHTML + "function validateCB(){allClear = true;$('.cberror').remove(); return allClear}";
            }  
            $("#viewCourseDefaultWrapper #cbScript").append(newScript);
          }
    });
}    

componentDidMount() {  
  $("#react-button-cancel-add-new-course").remove();
  let getProduction = this.props.productionStart;
  let formComponents = getProduction.formJson;
  let getNodID = getProduction.production_data_node_id;
  $("#course_action_menu .productionRHSButtons").remove();
  $("#course_action_menu a").addClass("hide");
  if(formComponents.customHTML){
      $("#course_action_menu").append("<a href='javascript:void(0)' data-action='prodbtn_0' class='productionRHSButtons'><i class='icon publish'></i><br><span>"+formComponents.actions.label+"</span></a>");      
  }
  else{              
    let formActions = formComponents.actions.subactions;
    if(formComponents.actions.length!=0){
      for(var x=0;x<formActions.length;x++){
          $("#course_action_menu").append("<a href='javascript:void(0)' data-action='prodbtn_"+x+"' class='productionRHSButtons'><i class='icon publish'></i><br><span>"+formActions[x].label+"</span></a>");
      }
    }
  }
  this.setupCBScript();        

  this.setState({
        production:JSON.stringify(getProduction)
  });
  setTimeout(function(){
      //$(".prod-list-row .list-col input:file").filestyle();      
    });
}

componentWillReceiveProps(newProps){
  if(JSON.stringify(newProps.productionStart)!=this.state.production){
    let getProduction = newProps.productionStart;
    let formComponents = getProduction.formJson;
    $("#course_action_menu .productionRHSButtons").remove();
    $("#course_action_menu a").addClass("hide");
    if(formComponents.customHTML){
      $("#course_action_menu").append("<a href='javascript:void(0)' data-action='prodbtn_0' class='productionRHSButtons'><i class='icon publish'></i><br><span>"+formComponents.actions.label+"</span></a>");      
    } 
    else{           
      let formActions = formComponents.actions.subactions;
      if(formComponents.actions.length!=0){
        for(var x=0;x<formActions.length;x++){
            $("#course_action_menu").append("<a href='javascript:void(0)' data-action='prodbtn_"+x+"' class='productionRHSButtons'><i class='icon publish'></i><br><span>"+formActions[x].label+"</span></a>");
        }
      }    
    }
    let getNodID = getProduction.production_data_node_id;  
    this.setState({
        whichProduction:getNodID,
        getRole:getProduction.production_details_user.role_id,
        production:JSON.stringify(getProduction),
        stage:0
    });
  }
  else{
    $("#course_action_menu .productionRHSButtons").removeClass("hide");
  }
}

componentDidUpdate(){
  var self = this;
  if(this.state.stage==0){
    let getProduction = this.props.productionStart;
    let formComponents = getProduction.formJson;
    this.rebuildNodes(formComponents.nodes,'first');
  }
  setTimeout(function(){
      //$(".prod-list-row .list-col input:file").filestyle();
      $(".productionElm.datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        onSelect: function(dateText) {
          var index = $(this).attr("data-index");
          var arrayTemp = self.state.tempArray; 
          arrayTemp[self.state.whichProduction][index].inputValue = $(this).val();
          self.setState({
           tempArray: arrayTemp
          });
        }
      });
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
const ConnectedEditStartProductionDetail = connect(mapStateToProps)(EditStartProductionDetail);
export default ConnectedEditStartProductionDetail;