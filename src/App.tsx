// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import EditPage from "./components/EditPage";
import viewPage from "./components/ViewPage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/home" component={Home} />
        <PrivateRoute path="/" exact component={Home} />
        <PrivateRoute path="/edit/:id" component={EditPage} />
        <PrivateRoute path="/view/:id" component={viewPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
