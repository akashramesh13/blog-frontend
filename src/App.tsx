// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from "react-router-dom";
import BlogEditorPage from "./components/BlogEditorPage/BlogEditorPage";
import BlogViewer from "./components/BlogViewer/BlogViewer";
import NavBar from "./components/Navbar/NavBar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

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
