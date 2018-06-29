import React from 'react';
const AddNewReducer = (state = {
    chatType: '',
    chatItems: {},
    courseList: {},
    view_type: ''
}, action) => {

    switch (action.type) {
        case 'ADD_NEW_DIALOGUE':
            console.log(action);
            return state;
        break;
    }
    return (typeof state == 'undefined') ? {}: state;
}
export default AddNewReducer;
