import React from "react";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Collection from "./components/Collection";
import Dashboard from "./components/Dashboard";
import Explore from "./components/Explore";
import Login from "./components/Login";
import "./stylesheets/main.scss";

function App() {

 
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/collection" component={Collection} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/explore" component={Explore} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
