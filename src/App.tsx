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
import BlogEditorPage from "./components/BlogEditorPage";
import BlogViewer from "./components/BlogViewer";
import Register from "./components/Register";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/blog/view/:id" component={BlogViewer} />
        <PrivateRoute path="/blog/new" component={BlogEditorPage} />
        <PrivateRoute path="/blog/edit/:id" component={BlogEditorPage} />
        <Redirect to="/" />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
