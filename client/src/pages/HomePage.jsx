import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useBlogs, useEvents } from '../hooks/useApi';

const HomePage = () => {
  const navigate = useNavigate();
  const { blogs, loading: blogsLoading, error: blogsError } = useBlogs({ limit: 2 });
  const { events, loading: eventsLoading, error: eventsError } = useEvents({ limit: 2 });
  
  const loading = blogsLoading || eventsLoading;
  const error = blogsError || eventsError;

  const handleJoinCommunity = () => {
    navigate('/forum');
  };

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.slug}`);
  };

  const handleEventClick = (event) => {
    navigate(`/events/${event.slug}`);
  };

  const handleViewAllBlogs = () => {
    navigate('/blog');
  };

  const handleViewAllEvents = () => {
    navigate('/events');
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

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Events</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading events...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.slice(0, 2).map((event) => (
                <div key={event.id} className="text-center">
                  <h3 className="text-2xl font-bold text-black">{event.title}</h3>
                  <p className="mt-2 text-gray-500">
                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} 
                    {event.event_time && ` • ${event.event_time}`}
                    {event.location && ` • ${event.location}`}
                  </p>
                  <button
                    onClick={() => handleEventClick(event)}
                    className="mt-4 inline-block text-black font-bold hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={handleViewAllEvents}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              View All Events
            </button>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-16">
        <h2 className="text-4xl font-bold text-center mb-16">Latest Articles</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((blog) => (
              <Card
                key={blog.id}
                item={blog}
                type="blog"
                onClick={handleBlogClick}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <button
            onClick={handleViewAllBlogs}
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            View All Articles
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;