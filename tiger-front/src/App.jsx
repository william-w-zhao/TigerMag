import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Home from './pages/home';
import Article from './pages/article';
import ArticleEdit from './pages/article-edit';
import Upload from './pages/upload';
import Login from './pages/login';
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen max-w-[80%] mx-auto p-5"> 
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<ProtectedRoute><Upload /></ProtectedRoute>}/>
        <Route path="/articles/:id" element={<Article />} />
        <Route path="/articles/:id/:edit" element={<ProtectedRoute><ArticleEdit/></ProtectedRoute>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
