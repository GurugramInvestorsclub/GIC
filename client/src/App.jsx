import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout activePage="home">
            <HomePage />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout activePage="about">
            <AboutPage />
          </Layout>
        } />
        <Route path="/blog" element={
          <Layout activePage="blog">
            <BlogPage />
          </Layout>
        } />
        <Route path="/blog/:slug" element={
          <Layout activePage="blog">
            <BlogDetailPage />
          </Layout>
        } />
        <Route path="/events" element={
          <Layout activePage="events">
            <EventsPage />
          </Layout>
        } />
        <Route path="/events/:slug" element={
          <Layout activePage="events">
            <EventDetailPage />
          </Layout>
        } />
        <Route path="/forum" element={
          <Layout activePage="forum">
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Forum Coming Soon</h1>
              <p className="text-gray-600">Our community forum is under development.</p>
            </div>
          </Layout>
        } />
        <Route path="*" element={
          <Layout>
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
              <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;