import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import About from './pages/about';
import Archive from './pages/archive.jsx';
import Article from './pages/article';
import ArticleEdit from './pages/article-edit';
import ArticleNew from './pages/article-new';
import Contact from './pages/contact';
import EditorConsole from './pages/editor-console';
import Home from './pages/home';
import HomeEdit from './pages/home-edit.jsx';
import Login from './pages/login';
import Masthead from './pages/masthead';
import News from './pages/News';
import NewsEdit from './pages/news-edit.jsx';
import Opinion from './pages/opinion';
import OpinionEdit from './pages/opinion-edit.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 w-full max-w-[90%] lg:max-w-[80%] mx-auto pt-3 pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/edit" element={<ProtectedRoute><HomeEdit/></ProtectedRoute>} />
            <Route path="/news" element={<News />} />
            <Route path="/news/edit" element={<ProtectedRoute><NewsEdit/></ProtectedRoute>} />
            <Route path="/opinion" element={<Opinion />} />
            <Route path="/opinion/edit" element={<ProtectedRoute><OpinionEdit/></ProtectedRoute>} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/masthead" element={<Masthead />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/editor" element={<ProtectedRoute><EditorConsole/></ProtectedRoute>} />
            <Route path="/articles/:id" element={<Article />} />
            <Route path="/articles/:id/:edit" element={<ProtectedRoute><ArticleEdit /></ProtectedRoute>} />
            <Route path="/article-new" element={<ProtectedRoute><ArticleNew /></ProtectedRoute>} />
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
