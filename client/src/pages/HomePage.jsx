import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useBlogs } from '../hooks/useApi';

const HomePage = () => {
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();

  const handleJoinCommunity = () => {
    navigate('/forum');
  };

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.slug}`);
  };

  const handleViewMore = () => {
    navigate('/blog');
  };

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString + 'T00:00:00');
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  // Get only the latest 2 blogs
  const latestBlogs = blogs.slice(0, 2);

  return (
    <div>
      {/* Hero Section */}
      <Hero
        title="Gurugram Investors Club"
        subtitle="Building wealth through informed analysis, collaborative research, and strategic networking in the heart of India's financial capital."
        showCTA={true}
        ctaText="Join Our Community"
        ctaAction={handleJoinCommunity}
        size="large"
      />

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black">500+</h3>
            <p className="text-lg text-gray-500 mt-2">Active Members</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black">120+</h3>
            <p className="text-lg text-gray-500 mt-2">Companies Analyzed</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-black">25%</h3>
            <p className="text-lg text-gray-500 mt-2">Avg. Annual Returns</p>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">Latest Articles</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading articles...</p>
          </div>
        ) : latestBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  item={blog}
                  type="blog"
                  onClick={handleBlogClick}
                />
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-16">
              <button
                onClick={handleViewMore}
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                View More
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for new content!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;