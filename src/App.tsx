import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import PostEditorPage from './components/PostEditorPage/PostEditorPage';
import PostViewer from './components/PostViewer/PostViewer';
import NavBar from './components/Navbar/NavBar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Profile from './components/Profile/Profile';
import "./App.scss";

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/post/view/:id" component={PostViewer} />
        <PrivateRoute path="/post/new" component={PostEditorPage} />
        <PrivateRoute path="/post/edit/:id" component={PostEditorPage} />
        <PrivateRoute path="/profile/:profileId" component={Profile} />
        <PrivateRoute path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
      <Footer />
      <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' } }} />
      <Analytics />
    </Router>
  );
};

export default App;
