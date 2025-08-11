import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { useBlogs } from '../hooks/useApi';

const BlogPage = () => {
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'

  // Your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgOm6V6gjP3ZrsqBH8XfMVAvXbzQvs34EpTjEY2P-nMHntRt3-AUgBmODvFzPcLUdqAw/exec';

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog.slug}`);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubmitMessage('Please enter your email address');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitStatus('');
      }, 4000);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitMessage('Please enter a valid email address');
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitStatus('');
      }, 4000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitStatus('');
    
    try {
      // Create URLSearchParams for form data (better compatibility than FormData)
      const formData = new URLSearchParams();
      formData.append('email', email.trim());
      formData.append('source', 'Blog Newsletter');

      // Submit to Google Sheets via your Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
        mode: 'no-cors' // Required for Google Apps Script
      });

      // Since we're using no-cors, we can't read the response
      // We assume success if no error is thrown
      setSubmitMessage('🎉 Thank you for subscribing! You\'ll receive our latest investment insights soon.');
      setSubmitStatus('success');
      setEmail('');
      
      // Clear success message after 6 seconds
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitStatus('');
      }, 6000);

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitMessage('⚠️ Something went wrong. Please try again or email us directly.');
      setSubmitStatus('error');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitStatus('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
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

      {/* Enhanced Newsletter Signup with Google Sheets Integration */}
      <section className="py-16 bg-gray-50 rounded-xl text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get our latest investment insights and market analysis delivered directly to your inbox.
          </p>
          
          {/* Newsletter Form */}
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors
                  ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                  ${submitStatus === 'error' ? 'border-red-300' : 'border-gray-200'}
                `}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-black text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 
                  ${isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-800 transform hover:scale-105'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
            
            {/* Status Messages */}
            {submitMessage && (
              <div className={`mt-4 p-4 rounded-lg text-sm font-medium transition-all duration-300 transform ${
                submitStatus === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {submitMessage}
              </div>
            )}
            
            {/* Privacy Note */}
            <p className="text-gray-500 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;