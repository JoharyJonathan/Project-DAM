import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if an user is already logged in
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token)
  }, []);

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/users">Users</Link></li>
          {!isAuthenticated && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
          {isAuthenticated && (
            <>
              <li><Link to="/profile">Profile</Link></li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/users' element={<Users />}/>
        <Route path='/login' element={<SignIn />}/>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App