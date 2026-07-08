import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { initFirebaseAuthBridge } from './firebase/authBridge';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PostHogPageView from "./components/PostHogPageView";
import About from './pages/about';
import Issues from "./pages/issues";
import Issue from "./pages/issue";
import Article from './pages/article';
import ArticleEdit from './pages/article-edit';
import ArticleNew from './pages/article-new';
import Author from "./pages/author";
import Contact from './pages/contact';
import EditorConsole from './pages/editor-console';
import Home from './pages/home';
import Login from './pages/login';
import Masthead from './pages/masthead';
import News from './pages/news';
import Opinion from './pages/opinion';

function App() {
  useEffect(() => initFirebaseAuthBridge(), []);

  return (
    <BrowserRouter>
      <PostHogPageView/>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 w-full max-w-[90%] lg:max-w-[80%] mx-auto pt-1 lg:pt-3 pb-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/edit" element={<ProtectedRoute><Home editMode={ true } /></ProtectedRoute>} />
            <Route path="/news" element={<News />} />
            <Route path="/news/edit" element={<ProtectedRoute><News editMode={ true }/></ProtectedRoute>} />
            <Route path="/opinion" element={<Opinion />} />
            <Route path="/opinion/edit" element={<ProtectedRoute><Opinion editMode={ true }/></ProtectedRoute>} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/issues/:id" element={<Issue />} />
            <Route path="/masthead" element={<Masthead />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/editor" element={<ProtectedRoute><EditorConsole/></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><EditorConsole/></ProtectedRoute>} />
            <Route path="/articles/:id" element={<Article />} />
            <Route path="/articles/:id/:edit" element={<ProtectedRoute><ArticleEdit /></ProtectedRoute>} />
            <Route path="/article-new" element={<ProtectedRoute><ArticleNew /></ProtectedRoute>} />
            <Route path="/authors/:slug" element={<Author />} />
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
