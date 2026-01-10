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
import EditorConsole from './pages/editor-console';
import Login from './pages/login';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 w-full max-w-[90%] lg:max-w-[80%] mx-auto pt-5 pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/opinion" element={<Opinion />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/masthead" element={<Masthead />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/editor" element={<ProtectedRoute><EditorConsole/></ProtectedRoute>} />
            <Route path="/articles/:id" element={<Article />} />
            <Route path="/articles/:id/:edit" element={<ProtectedRoute><ArticleEdit /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
