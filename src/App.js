import logo from './logo.svg';
import './App.css';
import { MapBox } from './components/MapBox';
import { MapBoxTemperature } from './components/MapBoxTemperature';
import { createBrowserRouter } from 'react-router-dom';


function App() {

  return (
    <div className="App">
      <MapBoxTemperature />
    </div>
  );
}

export default App;
