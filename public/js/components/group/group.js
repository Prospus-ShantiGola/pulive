import React from 'react';
import {connect} from 'react-redux';
import GroupList from './sections/group_list';
import GroupDetail from './sections/group_Detail';
import RightActionBar from './sections/right_action_bar';
import {changePageName, updateGroupList} from '../../actions/actions';

class Group extends React.Component {
    render(){
        return (
            <span className="flex-item">
                <GroupList/>
                <GroupDetail/>
                <RightActionBar/>
            </span>
        )
    }
    componentDidMount() {
        let self = this;
        let params = {page_name: 'group'};
        self.props.dispatch(changePageName(params));
        $.ajax({
            url: domainUrl + "group/index",
            type: 'post',
            success: function(response) {
                response = JSON.parse(response);
                let groupList = response;
                console.log(response);
                self.props.dispatch(updateGroupList(response));


            }
        });
        $(".nano").nanoScroller();
        NProgress.done();

    }
    componentWillUnmount() {
        NProgress.start({position: 'full'});
    }
}
const mapStateToProps = (state) => {
    return {};
}

const ConnectedGroup = connect(mapStateToProps)(Group);
export default ConnectedGroup;
