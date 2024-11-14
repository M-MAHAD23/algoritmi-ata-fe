import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { useUserInfo } from './hooks/hooks';

// Import pages
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Panel from './layout/Panel';
import Landing from './pages/Landing/Landing';
import ECommerce from './pages/Dashboard/ECommerce';
import Submit from './components/Student/Submit';
import Router from './routes/Router';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const { token, userInfo } = useUserInfo(); // Check if token exists to conditionally render routes

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Router />

    </>
  );
}

export default App;
