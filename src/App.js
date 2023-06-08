import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import BookingComponent from './components/BookingComponent';

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/booking" component={BookingComponent} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;


