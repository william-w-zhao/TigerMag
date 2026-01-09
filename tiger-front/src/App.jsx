import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/home';
import News from './pages/News';
import Opinion from './pages/opinion';
import Archives from './pages/archives';
import Masthead from './pages/masthead';
import About from './pages/about';
import Contact from './pages/contact';
import Article from './pages/article';
import ArticleEdit from './pages/article-edit';
import Upload from './pages/upload';
import Staff from './pages/staff';
import Login from './pages/login';

function App() {
  return (
    <div className="min-h-screen max-w-[80%] mx-auto"> 
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/opinion" element={<Opinion />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/masthead" element={<Masthead />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/editor" element={<ProtectedRoute><Upload /></ProtectedRoute>}/>
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>}/>
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
