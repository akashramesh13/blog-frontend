import React, { useEffect } from 'react';
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
import About from './components/About/About';
import Essays from './components/Essays/Essays';
import "./App.scss";

const App: React.FC = () => {
  useEffect(() => {
    // Global Cursor Tracking for Grid Glow (from akashramesh13.github.io)
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    // Header Scroll Progress Tracking
    const handleScroll = () => {
      const progressBar = document.getElementById('scroll-progress');
      if (!progressBar) return;
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const scrollPercent = (window.scrollY / scrollTotal) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/essays" component={Essays} />
        <Route path="/post/view/:id" component={PostViewer} />
        <PrivateRoute path="/post/new" component={PostEditorPage} />
        <PrivateRoute path="/post/edit/:id" component={PostEditorPage} />
        <PrivateRoute path="/profile/:profileId" component={Profile} />
        <PrivateRoute path="/profile" component={Profile} />
        <Redirect to="/" />
      </Switch>
      <Footer />
      <Toaster position="bottom-center" toastOptions={{ style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-glass-border)' } }} />
      <Analytics />
    </Router>
  );
};

export default App;
