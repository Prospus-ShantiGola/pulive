const CHANGE_CHAT_TYPE = 'CHANGE_CHAT_TYPE';
const UPDATE_CHAT_LIST = 'UPDATE_CHAT_LIST'
const APPEND_NEW_CHAT = 'APPEND_NEW_CHAT';
const REMOVE_CHAT = 'REMOVE_CHAT';
const EDIT_CHAT = 'EDIT_CHAT';
const APPEND_DIALOGUE_LIST = 'APPEND_DIALOGUE_LIST';

// when no dialogue is selected then change chat view to "This page is under construction" mode.
const CHANGE_CHAT_VIEW = 'CHANGE_CHAT_VIEW';

const APPEND_ACTOR_LIST = 'APPEND_ACTOR_LIST';
const APPEND_RESOURCE_LIST = 'APPEND_RESOURCE_LIST';
const UPDATE_ACTOR_LIST = 'UPDATE_ACTOR_LIST';
const REMOVE_ACTOR = 'REMOVE_ACTOR';
const ADD_NEW_COURSE = 'ADD_NEW_COURSE';

const EDIT_TITLE = 'EDIT_TITLE';


const UPDATE_COURSE_TITLE = 'UPDATE_COURSE_TITLE';
const UPDATE_DIALOGUE_TITLE = 'UPDATE_DIALOGUE_TITLE';

const UPDATE_COURSE_LIST = 'UPDATE_COURSE_LIST';

const SEARCH_FILTER = 'SEARCH_FILTER';

const SHOW_ADMIN_HEADER = 'SHOW_ADMIN_HEADER';

const ADD_NEW_PRODUCTION = 'ADD_NEW_PRODUCTION';

const APPEND_PRODUCTION_LIST = 'APPEND_PRODUCTION_LIST';

const APPEND_PRODUCTION_DETAIL = 'APPEND_PRODUCTION_DETAIL';

const UPDATE_PRODUCTION_COURSE = 'UPDATE_PRODUCTION_COURSE';

const APPEND_PRODUCTION_START = 'APPEND_PRODUCTION_START';

const APPEND_PRODUCTION_INSTANCE = 'APPEND_PRODUCTION_INSTANCE';

const UPDATE_CHAT_TEXT = 'UPDATE_CHAT_TEXT';

const UPDATE_LETTER_TEXT = 'UPDATE_LETTER_TEXT';
const ACTIVE_MP_APP = 'ACTIVE_MP_APP';

const MANAGE_HEADER_NOTIFICATION = 'MANAGE_HEADER_NOTIFICATION';

const SUBSCRIBE_APP = 'SUBSCRIBE_APP';
const SHOW_SUBSCRIBED_APP = 'SHOW_SUBSCRIBED_APP';
const CHANGE_PAGE_NAME = 'CHANGE_PAGE_NAME';
const APPEND_COURSE_LIST = 'APPEND_COURSE_LIST';
const START_NEW_PRODUCTION_COURSE = 'START_NEW_PRODUCTION_COURSE';
const ACTIVE_FILTER = 'ACTIVE_FILTER';
const UPDATE_GROUP_LIST = 'UPDATE_GROUP_LIST';
const GROUP_FORM = 'GROUP_FORM';
const ROLES_LIST = 'ROLES_LIST';
const ADD_ROLE_LIST = 'ADD_ROLE_LIST';
const REMOVE_ADDED_ROLE = 'REMOVE_ADDED_ROLE';
const ACTORS_LIST = 'ACTORS_LIST';
const UPDATE_GROUP_ACTOR_LIST = 'UPDATE_GROUP_ACTOR_LIST';
const LOGIN_USER = 'LOGIN_USER';
const UPDATE_GROUP_ROLE_LIST = 'UPDATE_GROUP_ROLE_LIST';
const REMOVE_ROLE_FROM_GROUP = 'REMOVE_ROLE_FROM_GROUP';
const REMOVE_ACTOR_FROM_GROUP = 'REMOVE_ACTOR_FROM_GROUP';
const ACTORS_APP = 'ACTORS_APP';
const UPDATE_VIEW_TYPE = 'UPDATE_VIEW_TYPE';
const UPDATE_SEARCH_STRING = 'UPDATE_SEARCH_STRING';

export function updateSearchString(value){
    return {
        type: UPDATE_SEARCH_STRING,
        value: value,
    }
}
export function updateViewType(value){
    return {
        type: UPDATE_VIEW_TYPE,
        value: value,
    }
}

export function actorsApp(value){
    return {
        type: ACTORS_APP,
        value: value,
    }
}

export function removeActorFromGroup(value){
    return {
        type: REMOVE_ACTOR_FROM_GROUP,
        value: value,
    }
}
export function removeRoleFromGroup(value){
    return {
        type: REMOVE_ROLE_FROM_GROUP,
        value: value,
    }
}
export function updateGroupRoleList(value){
    return {
        type: UPDATE_GROUP_ROLE_LIST,
        value: value,
    }
}
export function updateGroupActorList(value){
    return {
        type: UPDATE_GROUP_ACTOR_LIST,
        value: value,
    }
}

export function actorsList(value){
    return {
        type: ACTORS_LIST,
        value: value,
    }
}

export function removeAddedRole(value){
    return {
        type: REMOVE_ADDED_ROLE,
        value: value,
    }
}
export function addRoleList(value){
    return {
        type: ADD_ROLE_LIST,
        value: value,
    }
}

export function rolesList(value){
    return {
        type: ROLES_LIST,
        value: value,
    }
}
export function groupForm(value){
    return {
        type: GROUP_FORM,
        value: value,
    }
}

export function updateGroupList(value){
    return {
        type: UPDATE_GROUP_LIST,
        value: value,
    }
}
export function activeFilter(value){
    return {
        type: ACTIVE_FILTER,
        value: value,
    }
}

export function changePageName(value) {
    return {
        type: CHANGE_PAGE_NAME,
        value: value,
    }
}

const EXPAND_LIST_VIEW = 'EXPAND_LIST_VIEW';

const UPDATE_NOTIFICATION_STATUS = 'UPDATE_NOTIFICATION_STATUS';

const MANAGE_HEADER_NOTIFICATION_COUNT = 'MANAGE_HEADER_NOTIFICATION_COUNT'

export function manageHeaderNotificationCount(value) {
    return {
        type: MANAGE_HEADER_NOTIFICATION_COUNT,
        value: value,
    }
}

export function updateNotificationStatus(value){
    return {
        type : UPDATE_NOTIFICATION_STATUS,
        value : value,
    }
}

export function expandListView(value){
    return {
        type : EXPAND_LIST_VIEW,
        value : value,
    }
}

export function manageHeaderNotification(value) {
    return {
        type: MANAGE_HEADER_NOTIFICATION,
        value: value,
    }
}

export function activeMpApp(value) {
    return {
        type: ACTIVE_MP_APP,
        value: value,
    }
}

export function updateLetterText(value) {
    return {
        type: UPDATE_LETTER_TEXT,
        value: value,
    }
}

export function updateChatText(value) {
    return {
        type: UPDATE_CHAT_TEXT,
        value: value,
    }
}

export function showAdminHeader(value) {
    return {
        type: SHOW_ADMIN_HEADER,
        value: value
    }
}
export function searchFilter(value) {
    return {
      type: SEARCH_FILTER,
      value: value
    }
}
export function updateCourseList(value) {
    return {
        type: UPDATE_COURSE_LIST,
        value: value
    }
}
export function updateCourseTitle(value) {
    return {
        type: UPDATE_COURSE_TITLE,
        value: value
    }
}

export function updateDialogueTitle(value) {
    return {
        type: UPDATE_DIALOGUE_TITLE,
        value: value
    }
}

export function editTitle(value) {
    return {
        type: EDIT_TITLE,
        value: value
    }
}


export function changeChatType(value) {
    return {
        type: CHANGE_CHAT_TYPE,
        value: value
    }
}

export function updateChatList(value) {
    return {
        type: UPDATE_CHAT_LIST,
        value: value
    }
}

export function appendNewChat(value) {
    return {
        type: APPEND_NEW_CHAT,
        value: value
    }
}

export function removeChat(value) {
    return {
        type: REMOVE_CHAT,
        value: value
    }
}

export function editChat(value) {
    return {
        type: EDIT_CHAT,
        value: value
    }
}
export function appendDialogueList(value) {
    return {
        type: APPEND_DIALOGUE_LIST,
        value: value
    }
}
export function changeChatView(value) {
    return {
        type: CHANGE_CHAT_VIEW,
        value: value
    }
}
export function appendActorList(value) {
    return {
        type: APPEND_ACTOR_LIST,
        value: value
    }
}
export function appendResourceList(value) {
    return {
        type: APPEND_RESOURCE_LIST,
        value: value
    }
}
export function updateActorList(value) {
    return {
        type: UPDATE_ACTOR_LIST,
        value: value
    }
}
export function removeActor(value) {
    return {
        type: REMOVE_ACTOR,
        value: value
    }
}
export function addNewCourse(value) {
    return {
        type: ADD_NEW_COURSE,
        value: value
    }
}

export function adNewProduction(value) {
    return {
        type: ADD_NEW_PRODUCTION,
        value: value
    }
}

export function appendProductionList(value) {
    return {
        type: APPEND_PRODUCTION_LIST,
        value: value
    }
}

export function appendProductionDetail(value) {
    return {
        type: APPEND_PRODUCTION_DETAIL,
        value: value
    }
}

export function updateProductionCourse(value) {
    return {
        type: UPDATE_PRODUCTION_COURSE,
        value: value
    }
}

export function appendProductionStart(value) {
    return {
        type: APPEND_PRODUCTION_START,
        value: value
    }
}

export function appendProductionInstance(value) {
    return {
        type: APPEND_PRODUCTION_INSTANCE,
        value: value
    }
}

export function subscribeApp(value) {
    return {
        type: SUBSCRIBE_APP,
        value: value
    }
}
export function showSubscribedApp(value) {
    return {
        type: SHOW_SUBSCRIBED_APP,
        value: value
    }
}

export function appendCourseList(value) {
    return {
        type: APPEND_COURSE_LIST,
        value: value
    }
}

export function startNewProductionCourse(value) {
    return {
        type: START_NEW_PRODUCTION_COURSE,
        value: value
    }
}

export function loginUser(value) {
    return {
        type: LOGIN_USER,
        value: value
    }
}
