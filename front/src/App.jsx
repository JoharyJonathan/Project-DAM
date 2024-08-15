import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import Users from './Users';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Profile from './Profile';

function App() {

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Sign Up</Link></li>
          <li><Link to="/profile">Profile</Link></li>
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