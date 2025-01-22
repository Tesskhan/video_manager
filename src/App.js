import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom'; // Updated import
import './App.css';
import logo from './logo.svg';
import YourLists from './Screens/YourLists';
import YourFavourites from './Screens/YourFavourites';
import YourProfile from './Screens/YourProfile';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import './firebaseConfig'; // Ensure you have initialized Firebase in this file

function HomePage({ isAuthenticated, setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsLogin(true);
      setSuccess('Registration successful. Please log in.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="HomePage">
      <div className="HomePage-logo">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
      {!isAuthenticated && (
        <div className="HomePage-form">
          <h2>Welcome to VideoListing</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="custom-button">Login</button>
              <p>Don't have an account? <button type="button" onClick={toggleForm} className="link-button">Sign Up</button></p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" name="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" className="custom-button">Register</button>
              <p>Already have an account? <button type="button" onClick={toggleForm} className="link-button">Login</button></p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function Profile({ setIsAuthenticated }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="Profile">
      <button className="custom-button" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="App-nav">
            <ul>
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? "nav-button active" : "nav-button"} // Conditionally add active class
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/favourites" 
                  className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}
                >
                  Your Favourites
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/lists" 
                  className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}
                >
                  Your Lists
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}
                >
                  Your Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/favourites" element={<YourFavourites />} />
            <Route path="/lists" element={<YourLists />} />
            <Route path="/profile" element={<Profile setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
