import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NavBar from './components/NavBar'

function App() {
  return (
    <>
      <NavBar />
      <h1>Playlist Converter</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
