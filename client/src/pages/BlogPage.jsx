import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useBlogs } from '../hooks/useApi';

const BlogPage = () => {
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [email, setEmail] = useState('');

  // Mock blog data - will be replaced with API calls
  const categories = [
    { id: 'all', name: 'All Posts' },
    { id: 'market-analysis', name: 'Market Analysis' },
    { id: 'company-research', name: 'Company Research' },
    { id: 'strategy', name: 'Strategy' },
    { id: 'education', name: 'Education' },
    { id: 'events', name: 'Events' }
  ];

  useEffect(() => {
    if (blogs.length > 0) {
      // Find featured blog (first one with featured tag or first blog)
      const featured = blogs.find(blog => blog.tags?.includes('Featured')) || blogs[0];
      setFeaturedBlog(featured);
      
      // Set filtered blogs (excluding featured)
      const nonFeaturedBlogs = blogs.filter(blog => blog.id !== featured?.id);
      setFilteredBlogs(nonFeaturedBlogs);
    }
  }, [blogs]);

  const handleCategoryFilter = (categoryId) => {
    setActiveCategory(categoryId);
    
    const nonFeaturedBlogs = blogs.filter(blog => blog.id !== featuredBlog?.id);
    
    if (categoryId === 'all') {
      setFilteredBlogs(nonFeaturedBlogs);
    } else {
      // Filter by category or tags since API might not have category field
      setFilteredBlogs(nonFeaturedBlogs.filter(blog => 
        blog.category === categoryId || 
        blog.tags?.some(tag => tag.toLowerCase().includes(categoryId.replace('-', ' ')))
      ));
    }
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
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

      {/* Category Filter */}
      <section className="mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryFilter(category.id)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      {featuredBlog && (
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <img 
                src={featuredBlog.image_url} 
                alt={featuredBlog.title}
                className="w-full h-80 md:h-full object-cover"
              />
              <div className="p-8 flex flex-col justify-center">
                <span className="inline-block bg-black text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4 w-fit">
                  Featured
                </span>
                <h2 className="text-3xl font-bold mb-4">{featuredBlog.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredBlog.content.substring(0, 200)}...
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>{formatDate(featuredBlog.published_date)}</span>
                    <span className="mx-2">•</span>
                    <span>{getReadTime(featuredBlog.content)} min read</span>
                  </div>
                  <button
                    onClick={() => handleBlogClick(featuredBlog)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Read Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading articles...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  item={blog}
                  type="blog"
                  onClick={handleBlogClick}
                />
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found in this category.</p>
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className="mt-4 text-black font-semibold hover:underline"
                >
                  View all articles
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredBlogs.length > 0 && (
              <div className="text-center mt-16">
                <button className="bg-gray-50 border border-gray-200 text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Load More Articles
                </button>
              </div>
            )}
          </>
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