import React from 'react';
import {connect} from 'react-redux';
import ColumnHeaderFilter from './column_header_filter'

class Columns extends React.Component {
    constructor(props) {
      super(props);


      let filter_one = [
        {'title' : 'Sort by ascending', 'className' : 'sort-by', 'value' : 'asc', 'filterKey' : 'order_by'},
        {'title' : 'Sort by descending', 'className' : 'sort-by', 'value' : 'desc', 'filterKey' : 'order_by'},
        {'title' : 'Text Filters', 'className' : 'parent-item', 'child' : [
          {'title' : 'Equals To', 'className' : 'sub-filter-instance', 'filterKey' : 'equalto'},
          {'title' : 'Contains', 'className' : 'sub-filter-instance', 'filterKey' : 'contains'}
        ]}
      ];
      let filter_two = [
        {'title' : 'Sort by ascending', 'className' : 'sort-by', 'value' : 'asc', 'filterKey' : 'order_by'},
        {'title' : 'Sort by descending', 'className' : 'sort-by', 'value' : 'desc', 'filterKey' : 'order_by'}
      ];
      let filter_three = [
        {'title' : 'All', 'className' : 'sub-filter-status', 'value' : 'all', 'filterKey' : 'equalto'},
        {'title' : 'Draft', 'className' : 'sub-filter-status', 'value' : 'draft', 'filterKey' : 'equalto'},
        {'title' : 'Published', 'className' : 'sub-filter-status', 'value' : 'published', 'filterKey' : 'equalto'}
      ];

        let columnsArr = {

            'bycourse': [
                /*{title: 'Course', 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_one},*/
                /*{title: 'Domain', 'isHeaderFilterShow' : false, 'isHeaderFilter' : false},*/
                /*{title: 'Date', 'isHeaderFilterShow' : false, 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},*/
                /*{title: 'Status', 'truncateText': true, 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_three}*/
            ],
            'bydialogue': [
                /*{title: 'Dialogue', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                 {title: 'Course', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                 {title: 'Date', 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                 {title: 'Participants', 'truncateText': true,  'isHeaderFilter' : false}*/
            ],

            'byactor': [
                /*{title: 'Actor', 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                 {title: 'Domain', 'isHeaderFilter' : false},
                 {title: 'Title', 'isHeaderFilter' : false},
                 {title: 'Email', 'isHeaderFilter' : true, 'filterOptions' : filter_one}*/
            ],

        }

      this.state = {'columnList' : columnsArr,'name':'Ben'};
    }


    render() {
        let columnList = this.getColumnsList();
        return (
          <ColumnHeaderFilter Columns ={this} />
        )
    }
    getColumnsList() {
      let filter_one = [
        {'title' : 'Sort by ascending', 'className' : 'sort-by', 'value' : 'asc', 'filterKey' : 'order_by'},
        {'title' : 'Sort by decending', 'className' : 'sort-by', 'value' : 'desc', 'filterKey' : 'order_by'},
        {'title' : 'Text Filters', 'className' : 'parent-item', 'child' : [
          {'title' : 'Equals To', 'className' : 'sub-filter-instance'},
          {'title' : 'Contains', 'className' : 'sub-filter-instance'}
        ]}
      ];
      let filter_two = [
        {'title' : 'Sort by ascending', 'className' : 'sort-by', 'value' : 'asc', 'filterKey' : 'order_by'},
        {'title' : 'Sort by decending', 'className' : 'sort-by', 'value' : 'desc', 'filterKey' : 'order_by'}
      ];
      let filter_three = [
        {'title' : 'All', 'className' : 'sub-filter-status', 'value' : 'all', 'filterKey' : 'equalto'},
        {'title' : 'Draft', 'className' : 'sub-filter-status', 'value' : 'draft', 'filterKey' : 'equalto'},
        {'title' : 'Published', 'className' : 'sub-filter-status', 'value' : 'published', 'filterKey' : 'equalto'}
      ];

      let columnsArr = {

          'bycourse' : [
                          {title: 'Course', 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                          {title: 'Domain', 'isHeaderFilterShow' : false, 'isHeaderFilter' : false},
                          {title: 'Date', 'isHeaderFilterShow' : false, 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                          {title: 'Status', 'truncateText': true, 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_three}
                      ],
          'bydialogue' : [
                            {title: 'Dialogue', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                            {title: 'Course', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                            {title: 'Date', 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                            {title: 'Actors', 'truncateText': true,  'isHeaderFilter' : false}
                        ],

          'byactor' : [
                        {title: 'Actor', 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                        {title: 'Domain', 'isHeaderFilter' : false},
                        {title: 'Title', 'isHeaderFilter' : false},
                        {title: 'Email', 'isHeaderFilter' : true, 'filterOptions' : filter_one}
                    ],

      }
/*
        let columnsArr = [
            {title: 'Course', 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_one},
            {title: 'Domain', 'isHeaderFilterShow' : false, 'isHeaderFilter' : false},
            {title: 'Date', 'isHeaderFilterShow' : false, 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},
            {title: 'Status', 'truncateText': true, 'isHeaderFilterShow' : false, 'isHeaderFilter' : true, 'filterOptions' : filter_three}
        ];
        if(this.props.view_type == 'bydialogue') {
            columnsArr = [
                {title: 'Dialogue', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                {title: 'Course', 'isHeaderFilter' : true, 'filterOptions' : filter_one},
                {title: 'Date', 'truncateText': true, 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                {title: 'Actors', 'truncateText': true,  'isHeaderFilter' : false}
            ];
        } else if(this.props.view_type == 'byactor') {
            columnsArr = [
                {title: 'Actor', 'isHeaderFilter' : true, 'filterOptions' : filter_two},
                {title: 'Domain', 'isHeaderFilter' : false},
                {title: 'Title', 'isHeaderFilter' : false},
                {title: 'Email', 'isHeaderFilter' : true, 'filterOptions' : filter_one}
            ];
        }*/
        return columnsArr;
    }
}
const mapStateToProps = (state) => {
    return {
        view_type: state.view_type
    }
}
const ConnectedColumns = connect(mapStateToProps)(Columns);
export default ConnectedColumns;
