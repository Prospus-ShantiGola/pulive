import React from 'react';
import {connect} from 'react-redux';
import {updateCourseList, searchFilter} from '../../actions/actions';
import HeaderSearchFilter from './header_search_filter';

class ColumnHeaderFilter extends React.Component {
  render() {
    return this.getHeaderTemplate()
  }

  getHeaderTemplate() {
    let self = this;
    let columnList = self.props.Columns.state.columnList[self.props.view_type];
      return (

        <table className="table table-style table-responsive table-head courseboard-table">
            <thead>
                <tr>
                    <th></th>
                    {
                        columnList.map(function(column, index) {
                              return self.getHeaderFilterTemplate(column,index);
                        })
                    }
                </tr>
            </thead>
        </table>

      )
  }

  resetFilter(search_main_title) {
  }

  getHeaderFilterTemplate(column,index) {
    let self = this;
    if(column.isHeaderFilter){
      let filterShow = 'dropdown-menu multi-menu hide';
        if(column.isHeaderFilterShow){
            filterShow = 'dropdown-menu multi-menu show';
        }
      return (
              <th className="filterDrp" key={index} onClick={self.resetFilter.bind(self,column.title)} >
                  <span>{column.title}<i className="fa fa-angle-down"></i></span>

                  <ul aria-labelledby="dLabel" role="menu" className="dropdown-menu multi-menu hide">
                    {
                      this.getFilterOptions(column)
                    }
                  </ul>
              </th>
            )
    }

    return (
        <th className="filterDrp" key={index}>
          <span>{column.title}</span>
        </th>

    )
  }

  filterSearchAction(value){
      this.props.dispatch(searchFilter({search_filter : value.option.title,search_filter_key : value.option.filterKey,search_main_title : value.search_main_title}));
  }
  filterAction(value){
    console.log(this.props.filter);
    let data = {
        'setUserID' : window.setUserID,
        'view_type' : this.props.view_type,
        'key' : value.option.filterKey,
        'value'  : value.option.value,
        'title' : value.title,
        'type' : 'json'
    }
    this.props.dispatch(searchFilter({}));
    this.makeAjaxCall(data);
  }
  makeAjaxCall(data){
    let self = this;
    $.ajax({
        url: domainUrl+'menudashboard/index',
        data: data,
        type: 'POST',
        success: function(response) {
          self.props.dispatch(updateCourseList({response: response}));
        }
    });
  }
  getFilterOptions(column){
    let self = this;
    let filterOption = column.filterOptions
    return filterOption.map(function(option,index) {
              if(option.child){
                return self.getChiledFilterOption(option,column.title,index)
              }
              let value = {'title' : column.title,'option':option};
              return <li className={option.className} key={index} onClick={self.filterAction.bind(self,value)}>{option.title}</li>

           })
  }

  getChiledFilterOption(option,search_main_title,index){
        let self = this;
        return (
          <span key = {index}>
            <li className={option.className}>{option.title}<i className="fa fa-angle-right"></i>

            <ul className="multi-sub-menu dropdown-menu">
            {
                option.child.map(function(childElement,index){
                    let value = {search_main_title:search_main_title,'option':childElement};
                    return <li className={childElement.className} key={index} onClick={self.filterSearchAction.bind(self,value)}>{childElement.title}</li>
                })
            }
            </ul>
        </li>
        <HeaderSearchFilter />

        </span>
      )
  }



}
const mapStateToProps = (state) => {
    return {
        view_type: state.view_type,
        search_filter_key : state.search_filter_key,
        filter : state.filter,
    }
}
const ConnectedColumnHeaderFilter = connect(mapStateToProps)(ColumnHeaderFilter);
export default ConnectedColumnHeaderFilter;
