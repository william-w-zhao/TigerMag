import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/home';
import Upload from './pages/upload';
import Login from './pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<ProtectedRoute><Upload /></ProtectedRoute>}/>
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
