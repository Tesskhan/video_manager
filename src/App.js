import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import YourLists from './Screens/YourLists'; // Import YourLists component
import YourFavourites from './Screens/YourFavourites'; // Import YourFavourites component
import YourProfile from './Screens/YourProfile'; // Import YourProfile component

function HomePage() {
  return (
    <div>
      <h2>Welcome to My Application</h2>
      <p>Select an option below:</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>My Application</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/favourites">Favourites</Link> | <Link to="/lists">Lists</Link> | <Link to="/profile">Profile</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} /> {/* Set HomePage as the welcome page */}
            <Route path="/favourites" element={<YourFavourites />} />
            <Route path="/lists" element={<YourLists />} />
            <Route path="/profile" element={<YourProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
