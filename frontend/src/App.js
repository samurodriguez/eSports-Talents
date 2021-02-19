import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './components/providers/AuthProvider';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import TeamProfilePage from './pages/TeamProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import RequestsPage from './pages/RequestsPage';
import ExplorePage from './pages/ExplorePage';

function App() {
  return (
    <AuthProvider value={''}>
      <Router>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route path="/register/:role">
            <RegisterPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/post/:postId">
            <PostPage />
          </Route>
          <Route path="/profile">
            <ProfilePage />
          </Route>
          <Route path="/user/:userId">
            <UserProfilePage />
          </Route>
          <Route path="/team/:teamId">
            <TeamProfilePage />
          </Route>
          <Route path="/notifications">
            <NotificationsPage />
          </Route>
          <Route path="/requests">
            <RequestsPage />
          </Route>
          <Route path="/explore">
            <ExplorePage />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
