import './App.css';
import { Route, Routes } from 'react-router-dom';
import StartUp from './pages/StartUp';
import Game from './pages/Game';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartUp />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}

export default App;
