function MarketPlaceObject(newState) {
    if(!(this instanceof MarketPlaceObject)) {
        return new MarketPlaceObject(newState);
    }
    if (typeof newState.app_list == 'string') {
        newState.app_list = JSON.parse(newState.app_list);
    } else {
        newState.app_list = JSON.parse(JSON.stringify(newState.app_list));
    }
    this.newState = newState;
}

MarketPlaceObject.prototype = {
    toggleActiveApp: function(state) {
        this.newState.active_app = state;
        return this;
    },
    subscribeApp: function(app_id) {
        this.newState['app_list'][app_id].is_subscribed = 1;
        return this;
    },
    getState() {
        let state = this.newState;
        this.newState = null;
        return state;
    }
}
window.MarketPlaceObject = MarketPlaceObject;
export default MarketPlaceObject;