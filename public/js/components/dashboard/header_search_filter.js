import React from 'react';
import {connect} from 'react-redux';
import {updateCourseList,searchFilter} from '../../actions/actions';


class HeaderSearchFilter extends React.Component {
    render () {
        return this.getSearchFilter()
    }


    getSearchFilter() {
      let search_filter;
      if(this.props.searchOn){
          search_filter = this.props.filter[this.props.searchOn.toLowerCase()].search_filter;
      }
      if(search_filter) {
        return (
            <span>
                <ul className="show-sub-child"><li className="active">{search_filter}</li></ul>
                <div className="search-item-wrap">
                    <div className="input-group">
                        <input type="text"  className="form-control search-js" placeholder="Search" ref="filterSearch" />
                        <span className="input-group-btn">
                            <button className="btn btn-default ben" type="button" onClick={this.searchAction.bind(this)}><i className="fa fa-search"></i></button>
                        </span>
                    </div>
                </div>
            </span>
        )
      }
      return null

    }


    searchAction() {

        let self = this;
        let searchText = self.refs.filterSearch.value;
        if(searchText == ''){
            return;
        }
        let filter = this.props.filter[this.props.searchOn.toLowerCase()];
        this.props.dispatch(searchFilter({'title' : this.props.searchOn,'filter_key' : filter.filterKey,search_filter : filter.search_filter,'value' : searchText,'dashboard_search' : filter.dashboard_search}));
        let searchOn = self.props.searchOn.toLowerCase();
        let search_filter_key = self.props.filter[searchOn].filterKey;
        let data = {
            'setUserID' : window.setUserID,
            'view_type' : self.props.view_type,
            'key' : search_filter_key,
            'value'  : searchText,
            'title' : searchOn,
            'type' : 'json'
        }

        this.makeAjaxCall(data);

    }


    makeAjaxCall(data){
        NProgress.start({position: 'middle'});
        let self = this;
        $.ajax({
            url: domainUrl + 'menudashboard/index',
            data: data,
            type: 'POST',
            success: function (response) {
                self.props.dispatch(updateCourseList({response: response}));
                NProgress.done();
            }
        });
    }

}
const mapStateToProps = (state) => {
    return {
        view_type: state.view_type,
        filter : state.filter,
        searchOn : state.searchOn,
    }
}

const ConnectedHeaderSearchFilter = connect(mapStateToProps)(HeaderSearchFilter);
export default ConnectedHeaderSearchFilter;
