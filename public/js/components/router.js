import React from 'react';

import { Switch, Route, Transition  } from 'react-router-dom';
import Inbox from './dashboard/dashboard';
import Marketplace from './marketplace/marketplace';
import NotFound from './not_found';
import Group from './group/group';
import Dashboard from './dashboard_new/dashboard_new';
import Product from './product/product';
import Data from './data/data';
import Tokenexpire from './token_expire';

class Router extends React.Component {
    render() {
        if(JS_ROUTE_PATH == 1) {
            return (
                <main className="flex-item" id="menudashboard">
                    <Switch>
                        <Route exact path='/dev/' component={Marketplace}/>
                        <Route path='/dev/store' component={Marketplace}/>
                        <Route path='/dev/inbox' component={Inbox}/>
                        <Route path='/dev/group' component={Group}/>                        
                        <Route path='/dev/dashboard' component={Dashboard}/> 
                        <Route path='/dev/products' component={Product}/>
                        <Route path='/dev/data' component={Data}/>                        
                        <Route path='/dev/tokenexpire' component={Tokenexpire}/>
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            )
        }


        if(JS_ROUTE_PATH == 2) {
            return (
                <main className="flex-item" id="menudashboard">
                    <Switch>
                        <Route exact path='/qa/' component={Marketplace}/>
                        <Route path='/qa/store' component={Marketplace}/>
                        <Route path='/qa/inbox' component={Inbox}/>
                        <Route path='/qa/group' component={Group}/>                        
                        <Route path='/qa/dashboard' component={Dashboard}/> 
                        <Route path='/qa/products' component={Product}/>
                        <Route path='/qa/data' component={Data}/>  
                        <Route path='/qa/tokenexpire' component={Tokenexpire}/> 
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            )
        }

        if(JS_ROUTE_PATH == 3) {
            return (
                <main className="flex-item" id="menudashboard">
                    <Switch>
                        <Route exact path='/sta/' component={Marketplace}/>
                        <Route path='/sta/store' component={Marketplace}/>
                        <Route path='/sta/inbox' component={Inbox}/>
                        <Route path='/sta/group' component={Group}/>                        
                        <Route path='/sta/dashboard' component={Dashboard}/>    
                        <Route path='/sta/products' component={Product}/>
                        <Route path='/sta/data' component={Data}/>  
                        <Route path='/sta/tokenexpire' component={Tokenexpire}/> 
                        <Route component={NotFound}/>
                    </Switch>
                </main>
            )
        }

        return (
            <main className="flex-item" id="menudashboard">
                <Switch>
                    <Route exact path='/pu/' component={Marketplace}/>
                    <Route path='/pu/store' component={Marketplace}/>
                    <Route path='/pu/inbox' component={Inbox}/>
                    <Route path='/pu/group' component={Group}/>                    
                    <Route path='/pu/dashboard' component={Dashboard}/>
                    <Route path='/pu/products' component={Product}/>
                    <Route path='/pu/data' component={Data}/>
                    <Route path='/pu/tokenexpire' component={Tokenexpire}/> 
                    <Route component={NotFound}/>
                </Switch>
            </main>
        )
    }
}
export default Router;
