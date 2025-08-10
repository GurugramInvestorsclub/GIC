import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useBlogs } from '../hooks/useApi';

const BlogPage = () => {
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();
  const [email, setEmail] = useState('');

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.slug}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setEmail('');
      alert('Thank you for subscribing!');
    }
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Investment Insights & Analysis"
        subtitle="Deep dives into market trends, company analysis, and investment strategies from our community of experienced investors and researchers."
        size="large"
      />

      {/* Articles Grid */}
      <section className="py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading articles...</p>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog) => (
                <Card
                  key={blog.id}
                  item={blog}
                  type="blog"
                  onClick={handleBlogClick}
                />
              ))}
            </div>

            {/* Load More Button - Future Enhancement */}
            {blogs.length >= 10 && (
              <div className="text-center mt-16">
                <button className="bg-gray-50 border border-gray-200 text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Load More Articles
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gray-50 rounded-xl text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get our latest investment insights and market analysis delivered directly to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;