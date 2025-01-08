import logo from './logo.svg';
import './App.css';

function App() {
  const handleClick = () => {
    console.log("Hello World");
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button className="custom-button" onClick={handleClick}>Click Me</button>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </header>
    </div>
  );
}

export default App;
