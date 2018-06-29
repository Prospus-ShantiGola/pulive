import React from 'react';
import Navigation from './navigation/navigation';
import Router from './router';

export default class MainContainer extends React.Component {
    render() {
        return (
            <section>
                <div className="flex-container">

                    <Navigation />
                    <Router />


                    
                </div>
            </section>
        )
    }
}
